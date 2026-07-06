-- ============================================================
-- FINANCE DASHBOARD RPC FUNCTIONS
-- ============================================================

-- ── 1. get_finance_top_kpis ───────────────────────────────────
CREATE OR REPLACE FUNCTION get_finance_top_kpis(
    p_date_range     TEXT    DEFAULT 'all',
    p_customer_id    TEXT    DEFAULT NULL,
    p_invoice_status TEXT    DEFAULT NULL,
    p_payment_status TEXT    DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result          json;
    v_start_date    DATE;
    v_total_revenue NUMERIC;
    v_total_sundry  NUMERIC;
    v_net_profit    NUMERIC;
BEGIN
    -- Calculate start date based on range
    v_start_date := CASE p_date_range
        WHEN 'month'   THEN DATE_TRUNC('month', CURRENT_DATE)
        WHEN 'quarter' THEN DATE_TRUNC('quarter', CURRENT_DATE)
        WHEN 'ytd'     THEN DATE_TRUNC('year', CURRENT_DATE)
        ELSE '2000-01-01'::DATE
    END;

    -- Total revenue from invoices
    SELECT COALESCE(SUM(total_amount), 0)
    INTO v_total_revenue
    FROM invoices
    WHERE invoice_date >= v_start_date
      AND (p_customer_id    IS NULL OR customer_id = p_customer_id)
      AND (p_invoice_status IS NULL OR status      = p_invoice_status);

    -- Total sundry expenses
    SELECT COALESCE(SUM(total_amount), 0)
    INTO v_total_sundry
    FROM sundry_expenses
    WHERE expense_date >= v_start_date
      AND (p_customer_id IS NULL OR customer_id = p_customer_id);

    v_net_profit := v_total_revenue - v_total_sundry;

    SELECT json_build_object(
        'total_revenue', v_total_revenue,
        'total_sundry',  v_total_sundry,
        'net_profit',    v_net_profit
    ) INTO result;

    RETURN result;
END;
$$;

-- ── 2. get_finance_trend_charts ───────────────────────────────
CREATE OR REPLACE FUNCTION get_finance_trend_charts(
    p_date_range  TEXT DEFAULT 'all',
    p_customer_id TEXT DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result       json;
    v_start_date DATE;
BEGIN
    v_start_date := CASE p_date_range
        WHEN 'month'   THEN DATE_TRUNC('month', CURRENT_DATE)
        WHEN 'quarter' THEN DATE_TRUNC('quarter', CURRENT_DATE)
        WHEN 'ytd'     THEN DATE_TRUNC('year', CURRENT_DATE)
        ELSE CURRENT_DATE - INTERVAL '6 months'
    END;

    SELECT json_agg(row_data ORDER BY month_date)
    INTO result
    FROM (
        SELECT
            DATE_TRUNC('month', gs.month_date)          AS month_date,
            TO_CHAR(gs.month_date, 'Mon YY')            AS month,
            COALESCE(SUM(i.total_amount), 0)::numeric   AS revenue,
            COALESCE(SUM(se.total_amount), 0)::numeric  AS expenses
        FROM (
            SELECT generate_series(
                DATE_TRUNC('month', v_start_date),
                DATE_TRUNC('month', CURRENT_DATE),
                '1 month'
            ) AS month_date
        ) gs
        LEFT JOIN invoices i
            ON DATE_TRUNC('month', i.invoice_date) = gs.month_date
            AND (p_customer_id IS NULL OR i.customer_id = p_customer_id)
        LEFT JOIN sundry_expenses se
            ON DATE_TRUNC('month', se.expense_date::date) = gs.month_date
            AND (p_customer_id IS NULL OR se.customer_id = p_customer_id)
        GROUP BY gs.month_date
        ORDER BY gs.month_date
    ) row_data;

    RETURN COALESCE(result, '[]'::json);
END;
$$;

-- ── 3. get_finance_expense_analytics ─────────────────────────
CREATE OR REPLACE FUNCTION get_finance_expense_analytics(
    p_date_range TEXT DEFAULT 'all'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result       json;
    v_start_date DATE;
    categories   json;
    total        NUMERIC;
BEGIN
    v_start_date := CASE p_date_range
        WHEN 'month'   THEN DATE_TRUNC('month', CURRENT_DATE)
        WHEN 'quarter' THEN DATE_TRUNC('quarter', CURRENT_DATE)
        WHEN 'ytd'     THEN DATE_TRUNC('year', CURRENT_DATE)
        ELSE '2000-01-01'::DATE
    END;

    SELECT json_agg(json_build_object('name', expense_category, 'value', total_cat))
    INTO categories
    FROM (
        SELECT
            expense_category,
            SUM(total_amount)::numeric AS total_cat
        FROM sundry_expenses
        WHERE expense_date >= v_start_date
        GROUP BY expense_category
        ORDER BY total_cat DESC
        LIMIT 8
    ) sub;

    SELECT COALESCE(SUM(total_amount), 0)
    INTO total
    FROM sundry_expenses
    WHERE expense_date >= v_start_date;

    SELECT json_build_object(
        'categories', COALESCE(categories, '[]'::json),
        'total',      total
    ) INTO result;

    RETURN result;
END;
$$;

-- ── 4. get_finance_invoice_analytics ─────────────────────────
CREATE OR REPLACE FUNCTION get_finance_invoice_analytics(
    p_date_range TEXT DEFAULT 'all'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result       json;
    v_start_date DATE;
    status_dist  json;
BEGIN
    v_start_date := CASE p_date_range
        WHEN 'month'   THEN DATE_TRUNC('month', CURRENT_DATE)
        WHEN 'quarter' THEN DATE_TRUNC('quarter', CURRENT_DATE)
        WHEN 'ytd'     THEN DATE_TRUNC('year', CURRENT_DATE)
        ELSE '2000-01-01'::DATE
    END;

    SELECT json_agg(json_build_object('name', status, 'amount', total_amt, 'count', cnt))
    INTO status_dist
    FROM (
        SELECT
            COALESCE(status, 'Unknown')         AS status,
            COALESCE(SUM(total_amount), 0)::numeric AS total_amt,
            COUNT(*)::int                       AS cnt
        FROM invoices
        WHERE invoice_date >= v_start_date
        GROUP BY status
        ORDER BY total_amt DESC
    ) sub;

    SELECT json_build_object(
        'status_distribution', COALESCE(status_dist, '[]'::json)
    ) INTO result;

    RETURN result;
END;
$$;

-- ── GRANT PERMISSIONS ─────────────────────────────────────────
GRANT EXECUTE ON FUNCTION get_finance_top_kpis(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_finance_trend_charts(TEXT, TEXT)          TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_finance_expense_analytics(TEXT)           TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_finance_invoice_analytics(TEXT)           TO anon, authenticated;