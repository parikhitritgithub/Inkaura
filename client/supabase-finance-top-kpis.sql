-- ============================================================
--  RPC: get_finance_top_kpis
--  Returns the same JSON shape as the original function,
--  but derives the numbers directly from the live tables
--  (invoices, payments, sundry_expenses, job_financial_closure).
-- ============================================================

CREATE OR REPLACE FUNCTION get_finance_top_kpis(
    p_date_range text,
    p_customer_id text,
    p_invoice_status text,
    p_payment_status text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result            json;
    v_start_date        date;

    -- KPI containers (defaults to 0 / empty)
    v_total_revenue         numeric := 0;
    v_net_profit            numeric := 0;
    v_outstanding_receivables numeric := 0;
    v_overdue_invoices      numeric := 0;
    v_advance_payments      numeric := 0;
    v_total_sundry          numeric := 0;
    v_avg_invoice           numeric := 0;
    v_jobs_closed           int := 0;
    v_sundry_recovered      numeric := 0;
    v_sundry_total_closed   numeric := 0;
    v_expense_recovery_pct  numeric := 0;
    v_profit_margin         numeric := 0;
BEGIN
    ------------------------------------------------------------------
    -- 1️⃣ Date range handling (same as before)
    ------------------------------------------------------------------
    IF p_date_range = 'month' THEN
        v_start_date := date_trunc('month', CURRENT_DATE);
    ELSIF p_date_range = 'quarter' THEN
        v_start_date := date_trunc('quarter', CURRENT_DATE);
    ELSIF p_date_range = 'ytd' THEN
        v_start_date := date_trunc('year', CURRENT_DATE);
    ELSE
        v_start_date := '2000-01-01'::date;   -- far‑past fallback
    END IF;

    ------------------------------------------------------------------
    -- 2️⃣ Total Revenue (sum of invoiced amount)
    ------------------------------------------------------------------
    SELECT COALESCE(SUM(i.total_amount), 0)
    INTO v_total_revenue
    FROM invoices i
    WHERE i.invoice_date >= v_start_date
      AND i.status <> 'Draft'                                 -- ignore drafts
      AND (p_customer_id IS NULL OR i.customer_id = p_customer_id)
      AND (p_invoice_status IS NULL OR i.status = p_invoice_status)
      AND (p_payment_status IS NULL OR i.payment_status = p_payment_status);

    ------------------------------------------------------------------
    -- 3️⃣ Net Profit (from closure, fallback 0 if none)
    ------------------------------------------------------------------
    SELECT COALESCE(SUM(j.net_profit_loss), 0)
    INTO v_net_profit
    FROM job_financial_closure j
    WHERE j.closure_date >= v_start_date
      AND (p_customer_id IS NULL OR
           j.invoice_id IN (SELECT invoice_id FROM invoices WHERE customer_id = p_customer_id));

    ------------------------------------------------------------------
    -- 4️⃣ Outstanding Receivables (invoiced – discount, unpaid)
    ------------------------------------------------------------------
    SELECT COALESCE(SUM(i.total_amount -
                        i.total_amount * COALESCE(i.discount_amount,0)/100), 0)
    INTO v_outstanding_receivables
    FROM invoices i
    WHERE i.invoice_date >= v_start_date
      AND i.status <> 'Draft'
      AND i.payment_status <> 'Paid'
      AND (p_customer_id IS NULL OR i.customer_id = p_customer_id)
      AND (p_invoice_status IS NULL OR i.status = p_invoice_status)
      AND (p_payment_status IS NULL OR i.payment_status = p_payment_status);

    ------------------------------------------------------------------
    -- 5️⃣ Overdue Invoices (same as outstanding but past due date)
    ------------------------------------------------------------------
    SELECT COALESCE(SUM(i.total_amount -
                        i.total_amount * COALESCE(i.discount_amount,0)/100), 0)
    INTO v_overdue_invoices
    FROM invoices i
    WHERE i.due_date < CURRENT_DATE
      AND i.invoice_date >= v_start_date
      AND i.status <> 'Draft'
      AND i.payment_status <> 'Paid'
      AND (p_customer_id IS NULL OR i.customer_id = p_customer_id)
      AND (p_invoice_status IS NULL OR i.status = p_invoice_status)
      AND (p_payment_status IS NULL OR i.payment_status = p_payment_status);

    ------------------------------------------------------------------
    -- 6️⃣ Advance Payments (unchanged)
    ------------------------------------------------------------------
    SELECT COALESCE(SUM(p.amount), 0)
    INTO v_advance_payments
    FROM payments p
    WHERE p.payment_date >= v_start_date
      AND p.payment_type = 'Advance'
      AND (p_customer_id IS NULL OR
           p.quotation_id IN (SELECT quotation_id FROM quotations WHERE customer_id = p_customer_id));

    ------------------------------------------------------------------
    -- 7️⃣ Total Sundry Expenses (unchanged)
    ------------------------------------------------------------------
    SELECT COALESCE(SUM(se.total_amount), 0)
    INTO v_total_sundry
    FROM sundry_expenses se
    WHERE se.expense_date >= v_start_date
      AND (p_customer_id IS NULL OR se.customer_id = p_customer_id);

    ------------------------------------------------------------------
    -- 8️⃣ Average Invoice Value (mean of invoiced amount)
    ------------------------------------------------------------------
    SELECT COALESCE(AVG(i.total_amount), 0)
    INTO v_avg_invoice
    FROM invoices i
    WHERE i.invoice_date >= v_start_date
      AND i.status <> 'Draft'
      AND (p_customer_id IS NULL OR i.customer_id = p_customer_id)
      AND (p_invoice_status IS NULL OR i.status = p_invoice_status);

    ------------------------------------------------------------------
    -- 9️⃣ Jobs Closed (count of closures)
    ------------------------------------------------------------------
    SELECT COUNT(*)
    INTO v_jobs_closed
    FROM job_financial_closure j
    WHERE j.closure_date >= v_start_date
      AND (p_customer_id IS NULL OR
           j.invoice_id IN (SELECT invoice_id FROM invoices WHERE customer_id = p_customer_id));

    ------------------------------------------------------------------
    -- 🔟 Sundry Recovery (from closure)
    ------------------------------------------------------------------
    SELECT COALESCE(SUM(j.sundry_expenses_recovered), 0),
           COALESCE(SUM(j.total_sundry_expenses), 0)
    INTO v_sundry_recovered, v_sundry_total_closed
    FROM job_financial_closure j
    WHERE j.closure_date >= v_start_date;

    ------------------------------------------------------------------
    -- 1️⃣1️⃣ Derived percentages
    ------------------------------------------------------------------
    v_expense_recovery_pct :=
        CASE WHEN v_sundry_total_closed > 0
             THEN (v_sundry_recovered / v_sundry_total_closed) * 100
             ELSE 0 END;

    v_profit_margin :=
        CASE WHEN v_total_revenue > 0
             THEN (v_net_profit / v_total_revenue) * 100
             ELSE 0 END;

    ------------------------------------------------------------------
    -- 1️⃣2️⃣ Build result JSON (exact same keys as before)
    ------------------------------------------------------------------
    v_result := json_build_object(
        'total_revenue',         v_total_revenue,
        'net_profit',            v_net_profit,
        'profit_margin',         v_profit_margin,
        'outstanding_receivables', v_outstanding_receivables,
        'overdue_invoices',      v_overdue_invoices,
        'advance_payments',      v_advance_payments,
        'total_sundry',          v_total_sundry,
        'expense_recovery_pct',  v_expense_recovery_pct,
        'avg_invoice_value',     v_avg_invoice,
        'jobs_closed',           v_jobs_closed
    );

    RETURN v_result;
END;
$$;