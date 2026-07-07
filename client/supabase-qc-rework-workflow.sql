-- ===========================================================
-- QC / REWORK WORKFLOW MIGRATION
-- DynamicsPrint Style Workflow
-- Safe migration - does NOT destroy existing data
-- ===========================================================

BEGIN;

--------------------------------------------------------------
-- SAMPLE ORDERS
--------------------------------------------------------------

ALTER TABLE sample_orders
ADD COLUMN IF NOT EXISTS qc_cycle INTEGER NOT NULL DEFAULT 0;

ALTER TABLE sample_orders
ADD COLUMN IF NOT EXISTS rework_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE sample_orders
ADD COLUMN IF NOT EXISTS current_qc_id INTEGER;

ALTER TABLE sample_orders
ADD COLUMN IF NOT EXISTS last_qc_result VARCHAR(30);

--------------------------------------------------------------
-- PRODUCTION ORDERS
--------------------------------------------------------------

ALTER TABLE production_orders
ADD COLUMN IF NOT EXISTS qc_cycle INTEGER NOT NULL DEFAULT 0;

ALTER TABLE production_orders
ADD COLUMN IF NOT EXISTS rework_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE production_orders
ADD COLUMN IF NOT EXISTS current_qc_id INTEGER;

ALTER TABLE production_orders
ADD COLUMN IF NOT EXISTS last_qc_result VARCHAR(30);

--------------------------------------------------------------
-- QUALITY CHECKS
--------------------------------------------------------------

ALTER TABLE quality_checks
ADD COLUMN IF NOT EXISTS qc_cycle INTEGER NOT NULL DEFAULT 1;

ALTER TABLE quality_checks
ADD COLUMN IF NOT EXISTS workflow_status VARCHAR(30)
DEFAULT 'Pending';

ALTER TABLE quality_checks
ADD COLUMN IF NOT EXISTS closed BOOLEAN DEFAULT FALSE;

--------------------------------------------------------------
-- Activity Log
--------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workflow_activity_log
(
    activity_id BIGSERIAL PRIMARY KEY,

    job_type VARCHAR(20) NOT NULL,

    job_id VARCHAR(30) NOT NULL,

    qc_id INTEGER,

    activity VARCHAR(60) NOT NULL,

    performed_by INTEGER
    REFERENCES employees(employee_id),

    remarks TEXT,

    created_at TIMESTAMPTZ
    DEFAULT now()
);

CREATE INDEX IF NOT EXISTS
idx_workflow_activity_job

ON workflow_activity_log(job_id);

--------------------------------------------------------------
-- QC HISTORY VIEW
--------------------------------------------------------------

CREATE OR REPLACE VIEW qc_latest_result AS

SELECT DISTINCT ON
(
COALESCE(sample_order_id,production_order_id)
)

qc_id,

sample_order_id,

production_order_id,

overall_status,

workflow_status,

rework_required,

approved_for_dispatch,

qc_cycle,

created_at

FROM quality_checks

ORDER BY
COALESCE(sample_order_id,production_order_id),
created_at DESC;

--------------------------------------------------------------
-- Existing QC rows
--------------------------------------------------------------

UPDATE quality_checks
SET workflow_status =
CASE

WHEN approved_for_dispatch=true
THEN 'Approved'

WHEN overall_status='Passed'
THEN 'Awaiting Approval'

WHEN overall_status='Failed'
THEN 'Rejected'

ELSE 'Pending'

END

WHERE workflow_status IS NULL
OR workflow_status='Pending';

--------------------------------------------------------------
-- Existing Sample Orders
--------------------------------------------------------------

UPDATE sample_orders
SET

last_qc_result =
CASE

WHEN status='Approved'
THEN 'Approved'

WHEN status='Rejected'
THEN 'Rejected'

WHEN status='In Progress'
AND customer_feedback IS NOT NULL
THEN 'Rejected'

ELSE NULL

END;

--------------------------------------------------------------
-- Existing Production Orders
--------------------------------------------------------------

UPDATE production_orders
SET

last_qc_result=
CASE

WHEN status='Completed'
THEN 'Approved'

WHEN status='Rework Required'
THEN 'Rejected'

WHEN status='Failed'
THEN 'Rejected'

ELSE NULL

END;

COMMIT;