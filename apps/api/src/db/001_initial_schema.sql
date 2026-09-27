CREATE TYPE user_role AS ENUM ('applicant', 'institute_nodal_officer', 'state_nodal_officer', 'scrutiny_officer', 'selection_committee', 'ministry_admin', 'approver');
CREATE TYPE doc_type_enum AS ENUM ('ST_CERTIFICATE', 'INCOME_CERTIFICATE', 'MARKSHEET', 'OFFER_LETTER', 'OTHER');
CREATE TYPE scheme_name_enum AS ENUM ('NFST', 'NOS');
CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'ai_checked', 'defective', 'institute_verification', 'ministry_verification', 'interview_or_offer_review', 'provisional_merit', 'provisional_award', 'confirmation_pending', 'confirmed', 'joined', 'joined_abroad', 'active', 'upgraded_mphil_to_phd', 'closed', 'cancelled');
CREATE TYPE doc_status AS ENUM ('pending', 'ai_extracted', 'verified', 'rejected');
CREATE TYPE verification_status AS ENUM ('approved', 'rejected', 'defective');
CREATE TYPE decision_stage AS ENUM ('institute', 'ministry', 'selection_committee');
CREATE TYPE decision_outcome AS ENUM ('approved', 'rejected', 'waitlisted');
CREATE TYPE payment_type_enum AS ENUM ('stipend', 'contingency', 'hra', 'tuition', 'air_passage');
CREATE TYPE payment_status AS ENUM ('pending', 'processed', 'failed', 'refunded');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100),
    category VARCHAR(100),
    location VARCHAR(255),
    is_top_1000_qs BOOLEAN DEFAULT FALSE
);

CREATE TABLE applicants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    dob DATE,
    gender VARCHAR(50),
    category VARCHAR(50),
    is_divyangjan BOOLEAN DEFAULT FALSE,
    family_income DECIMAL(12,2),
    is_orphan BOOLEAN DEFAULT FALSE
);

CREATE TABLE scheme_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_name scheme_name_enum NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    configuration JSONB NOT NULL
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID REFERENCES applicants(id) ON DELETE CASCADE,
    scheme_version_id UUID REFERENCES scheme_versions(id),
    institution_id UUID REFERENCES institutions(id),
    status application_status DEFAULT 'draft',
    rejection_reason VARCHAR(100),
    is_escalated BOOLEAN DEFAULT FALSE,
    form_data JSONB,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    doc_type doc_type_enum NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    status doc_status DEFAULT 'pending'
);

CREATE TABLE extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    extracted_data JSONB,
    confidence_score FLOAT,
    extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES users(id),
    status verification_status NOT NULL,
    remarks TEXT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    decided_by UUID REFERENCES users(id),
    stage decision_stage NOT NULL,
    outcome decision_outcome NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    scheme_version_id UUID REFERENCES scheme_versions(id),
    bucket_name VARCHAR(100) NOT NULL,
    merit_rank INT,
    merit_score FLOAT,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    payment_type payment_type_enum NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    pfms_transaction_id VARCHAR(100),
    processed_at TIMESTAMP
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_table VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    changes JSONB,
    performed_by UUID REFERENCES users(id),
    previous_hash VARCHAR(256),
    current_hash VARCHAR(256) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policy_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_version_id UUID REFERENCES scheme_versions(id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
