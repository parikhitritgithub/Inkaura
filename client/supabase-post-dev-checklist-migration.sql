-- ============================================================
-- POST DEVELOPMENT CHECKLIST - Migration Script
-- ============================================================
-- Adds a JSONB column to quality_checks to store post-press
-- development checklist data. This is verified by the approver
-- (Admin/Supervisor) before they can approve the QC report.
--
-- The verifier is always the same person who approves (approved_by),
-- so we don't need a separate FK for checklist_verified_by.
-- ============================================================

-- Add the checklist JSONB column
ALTER TABLE quality_checks 
ADD COLUMN IF NOT EXISTS post_dev_checklist JSONB DEFAULT NULL;

-- Add timestamp for when checklist was verified
ALTER TABLE quality_checks 
ADD COLUMN IF NOT EXISTS checklist_verified_date TIMESTAMPTZ;

-- The JSONB structure will be:
-- {
--   "client_approval_present": true/false,
--   "carton_type": "RTI" | "STI" | "CLB" | "SLB" | "",
--   "punching_registration": true/false,
--   "printing_defects_check": true/false,
--   "finishing_correct": true/false,
--   "cutting_folding_binding": true/false,
--   "product_count_verified": true/false,
--   "carton_pasting_direction": true/false,
--   "alignment_precision": true/false,
--   "excess_paper_removed": true/false,
--   "clean_smooth_edges": true/false,
--   "correct_labels_applied": true/false,
--   "legal_compliance_markings": true/false,
--   "checker_notes": ""
-- }

COMMENT ON COLUMN quality_checks.post_dev_checklist IS 'Post Press New Development Checklist - JSONB containing all checklist items verified before approval';
COMMENT ON COLUMN quality_checks.checklist_verified_date IS 'Date when the checklist was verified (verifier = approved_by)';
