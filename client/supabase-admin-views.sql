-- ==============================================================================
-- Admin Dashboard Views and RPCs
-- Run this script in your Supabase SQL Editor
-- ==============================================================================

-- 1. ADD PRIORITY COLUMN TO PRODUCTION ORDERS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'production_orders' AND column_name = 'priority') THEN
        ALTER TABLE production_orders ADD COLUMN priority VARCHAR(20) DEFAULT 'Medium';
    END IF;
END $$;

-- 2. GET KPI SUMMARY ROW
CREATE OR REPLACE FUNCTION get_admin_kpis()
RETURNS json AS $$
DECLARE result json;
BEGIN
    SELECT json_build_object(
        'revenue_mtd', COALESCE((SELECT SUM(amount) FROM payments p JOIN invoices i ON p.invoice_id = i.invoice_id WHERE date_trunc('month', p.payment_date) = date_trunc('month', CURRENT_DATE)), 0),
        'active_jobs', COALESCE((SELECT COUNT(*) FROM production_orders WHERE status NOT IN ('Completed', 'Delivered', 'Cancelled')), 0),
        'completed_jobs', COALESCE((SELECT COUNT(*) FROM production_orders WHERE status IN ('Completed', 'Delivered') AND date_trunc('month', actual_completion_date) = date_trunc('month', CURRENT_DATE)), 0),
        'pending_payments', COALESCE((SELECT SUM(total_amount - COALESCE((SELECT SUM(amount) FROM payments WHERE invoice_id = i.invoice_id), 0)) FROM invoices i WHERE payment_status != 'Paid'), 0),
        'total_customers', COALESCE((SELECT COUNT(*) FROM customers), 0),
        'open_quotations', COALESCE((SELECT COUNT(*) FROM quotations WHERE status IN ('Pending', 'Draft')), 0)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. GET BUSINESS WORKFLOW PIPELINE
CREATE OR REPLACE FUNCTION get_admin_pipeline()
RETURNS json AS $$
DECLARE result json;
BEGIN
    -- This simulates the pipeline counts across various statuses and tables.
    SELECT json_agg(stage_data) INTO result FROM (
        SELECT 1 as step, 'Inquiry' as label, COUNT(*) as count FROM quotations WHERE status = 'Draft'
        UNION ALL
        SELECT 2, 'Estimation', COUNT(*) FROM quotations WHERE status = 'Pending'
        UNION ALL
        SELECT 3, 'Quotation', COUNT(*) FROM quotations WHERE status = 'Sent'
        UNION ALL
        SELECT 4, 'Sample', COUNT(*) FROM sample_orders WHERE status = 'In Progress'
        UNION ALL
        SELECT 5, 'Approval', COUNT(*) FROM quotations WHERE status = 'Approved'
        UNION ALL
        SELECT 6, 'Advance Pmt', COUNT(*) FROM invoices WHERE payment_status = 'Partial'
        UNION ALL
        SELECT 7, 'Job Order', COUNT(*) FROM production_orders WHERE status = 'Pending'
        UNION ALL
        SELECT 8, 'Production', COUNT(*) FROM production_orders WHERE status = 'In Production'
        UNION ALL
        SELECT 9, 'QC', COUNT(*) FROM production_orders WHERE status = 'QC Pending'
        UNION ALL
        SELECT 10, 'Packaging', COUNT(*) FROM production_orders WHERE status = 'Packaging'
        UNION ALL
        SELECT 11, 'Dispatch', COUNT(*) FROM production_orders WHERE status = 'Dispatch Pending'
        UNION ALL
        SELECT 12, 'Invoice', COUNT(*) FROM invoices WHERE payment_status = 'Unpaid'
        UNION ALL
        SELECT 13, 'Payment', COUNT(DISTINCT invoice_id) FROM payments WHERE date_trunc('day', payment_date) = CURRENT_DATE
        UNION ALL
        SELECT 14, 'Closure', COUNT(*) FROM production_orders WHERE status = 'Completed'
    ) sub;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. GET REVENUE PERFORMANCE (LAST 6 MONTHS VS TARGET)
CREATE OR REPLACE FUNCTION get_admin_revenue_trend()
RETURNS json AS $$
DECLARE result json;
BEGIN
    SELECT json_agg(json_build_object('month', TO_CHAR(month, 'Mon YYYY'), 'revenue', total, 'target', target_rev))
    INTO result
    FROM (
        SELECT date_trunc('month', p.payment_date) as month, SUM(p.amount) as total, 150000 as target_rev
        FROM payments p
        WHERE p.payment_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
        GROUP BY 1
        ORDER BY 1
    ) sub;
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. GET JOB STATUS OVERVIEW
CREATE OR REPLACE FUNCTION get_admin_job_status()
RETURNS json AS $$
DECLARE result json;
BEGIN
    SELECT json_agg(json_build_object('name', status, 'value', cnt)) INTO result FROM (
        SELECT status, COUNT(*) as cnt FROM production_orders
        GROUP BY status
    ) sub;
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. GET PRINT TYPE ANALYSIS
CREATE OR REPLACE FUNCTION get_admin_print_types()
RETURNS json AS $$
DECLARE result json;
BEGIN
    SELECT json_agg(json_build_object('type', printing_technology, 'count', cnt)) INTO result FROM (
        SELECT qp.printing_technology, COUNT(po.production_order_id) as cnt 
        FROM production_orders po
        JOIN quotations q ON po.quotation_id = q.quotation_id
        JOIN quotation_products qp ON q.quotation_id = qp.quotation_id
        WHERE qp.printing_technology IS NOT NULL
        GROUP BY qp.printing_technology
    ) sub;
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. GET RECENT JOBS TABLE
CREATE OR REPLACE FUNCTION get_recent_jobs()
RETURNS json AS $$
DECLARE result json;
BEGIN
    SELECT json_agg(json_build_object(
        'id', 'PO-' || po.production_order_id,
        'client', c.company_name,
        'type', qp.printing_technology,
        'priority', po.priority,
        'due', TO_CHAR(po.delivery_date, 'Mon DD, YYYY'),
        'value', q.total_payment,
        'status', po.status
    )) INTO result
    FROM production_orders po
    JOIN quotations q ON po.quotation_id = q.quotation_id
    JOIN customers c ON q.customer_id = c.customer_id
    LEFT JOIN LATERAL (SELECT printing_technology FROM quotation_products WHERE quotation_id = q.quotation_id LIMIT 1) qp ON true
    ORDER BY po.created_at DESC
    LIMIT 10;
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8. GET INVENTORY ALERTS (LOW STOCK)
CREATE OR REPLACE FUNCTION get_inventory_alerts()
RETURNS json AS $$
DECLARE result json;
BEGIN
    SELECT json_agg(json_build_object(
        'item', material_name,
        'current', current_stock,
        'min', minimum_stock_level,
        'reorder', reorder_quantity,
        'unit', unit_of_measure
    )) INTO result
    FROM material_inventory
    WHERE current_stock <= minimum_stock_level
    ORDER BY current_stock ASC;
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 9. GET USER ROLE OVERVIEW
CREATE OR REPLACE FUNCTION get_user_role_overview()
RETURNS json AS $$
DECLARE result json;
BEGIN
    SELECT json_agg(json_build_object('role', role, 'users', cnt)) INTO result FROM (
        SELECT role, COUNT(*) as cnt FROM employees
        WHERE is_active = true
        GROUP BY role
    ) sub;
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 10. GET ADMIN ACTION CENTER SUMMARY
CREATE OR REPLACE FUNCTION get_admin_action_center()
RETURNS json AS $$
DECLARE result json;
BEGIN
    SELECT json_build_object(
        'delayed_jobs', COALESCE((SELECT COUNT(*) FROM production_orders WHERE delivery_date < CURRENT_DATE AND status NOT IN ('Completed','Delivered')), 0),
        'pending_approvals', COALESCE((SELECT COUNT(*) FROM production_orders WHERE production_approved = false), 0),
        'pending_quotations', COALESCE((SELECT COUNT(*) FROM quotations WHERE status = 'Pending'), 0),
        'overdue_invoices', COALESCE((SELECT COUNT(*) FROM invoices WHERE payment_status != 'Paid' AND due_date < CURRENT_DATE), 0)
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
