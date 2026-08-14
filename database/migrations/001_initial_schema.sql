/*
=========================================================
MX-PS HUB — INITIAL DATABASE SCHEMA
MX-PS Katsina Gold & Precious Stones Trading Company
=========================================================

Database:
PostgreSQL

Purpose:
- Users
- KYC
- Seller profiles
- Marketplace listings
- Orders
- Transactions
- Wallet records
- Admin approvals
- Audit logs
=========================================================
*/

BEGIN;

/*
=========================================================
EXTENSIONS
=========================================================
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

/*
=========================================================
UPDATED_AT FUNCTION
=========================================================
*/

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/*
=========================================================
USERS
=========================================================
*/

CREATE TABLE IF NOT EXISTS users (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    email VARCHAR(255) UNIQUE,

    phone VARCHAR(30) UNIQUE,

    password_hash TEXT,

    full_name VARCHAR(255),

    role VARCHAR(50) NOT NULL
        DEFAULT 'user',

    account_status VARCHAR(50) NOT NULL
        DEFAULT 'pending',

    email_verified BOOLEAN NOT NULL
        DEFAULT FALSE,

    phone_verified BOOLEAN NOT NULL
        DEFAULT FALSE,

    kyc_status VARCHAR(50) NOT NULL
        DEFAULT 'not_started',

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

/*
=========================================================
USER INDEXES
=========================================================
*/

CREATE INDEX IF NOT EXISTS idx_users_role
    ON users(role);

CREATE INDEX IF NOT EXISTS idx_users_account_status
    ON users(account_status);

CREATE INDEX IF NOT EXISTS idx_users_kyc_status
    ON users(kyc_status);

/*
=========================================================
KYC APPLICATIONS
=========================================================
*/

CREATE TABLE IF NOT EXISTS kyc_applications (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    status VARCHAR(50) NOT NULL
        DEFAULT 'pending',

    document_type VARCHAR(100),

    document_reference TEXT,

    verification_provider VARCHAR(100),

    provider_reference TEXT,

    rejection_reason TEXT,

    reviewed_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    submitted_at TIMESTAMPTZ,

    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

/*
=========================================================
KYC INDEXES
=========================================================
*/

CREATE INDEX IF NOT EXISTS idx_kyc_user_id
    ON kyc_applications(user_id);

CREATE INDEX IF NOT EXISTS idx_kyc_status
    ON kyc_applications(status);

/*
=========================================================
SELLER PROFILES
=========================================================
*/

CREATE TABLE IF NOT EXISTS seller_profiles (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE
        REFERENCES users(id)
        ON DELETE CASCADE,

    business_name VARCHAR(255),

    business_type VARCHAR(100),

    description TEXT,

    verification_status VARCHAR(50) NOT NULL
        DEFAULT 'pending',

    approved_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    approved_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

/*
=========================================================
MARKETPLACE LISTINGS
=========================================================
*/

CREATE TABLE IF NOT EXISTS listings (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    seller_id UUID NOT NULL
        REFERENCES seller_profiles(id)
        ON DELETE RESTRICT,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    category VARCHAR(100) NOT NULL,

    material_type VARCHAR(100),

    quantity NUMERIC(20,8),

    unit VARCHAR(50),

    price NUMERIC(30,8),

    currency VARCHAR(20)
        DEFAULT 'NGN',

    status VARCHAR(50) NOT NULL
        DEFAULT 'draft',

    verification_status VARCHAR(50) NOT NULL
        DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

/*
=========================================================
LISTING INDEXES
=========================================================
*/

CREATE INDEX IF NOT EXISTS idx_listings_seller
    ON listings(seller_id);

CREATE INDEX IF NOT EXISTS idx_listings_category
    ON listings(category);

CREATE INDEX IF NOT EXISTS idx_listings_status
    ON listings(status);

/*
=========================================================
ORDERS
=========================================================
*/

CREATE TABLE IF NOT EXISTS orders (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    buyer_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    seller_id UUID NOT NULL
        REFERENCES seller_profiles(id)
        ON DELETE RESTRICT,

    listing_id UUID NOT NULL
        REFERENCES listings(id)
        ON DELETE RESTRICT,

    quantity NUMERIC(20,8) NOT NULL,

    unit_price NUMERIC(30,8) NOT NULL,

    total_amount NUMERIC(30,8) NOT NULL,

    currency VARCHAR(20)
        DEFAULT 'NGN',

    status VARCHAR(50) NOT NULL
        DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

/*
=========================================================
ORDER INDEXES
=========================================================
*/

CREATE INDEX IF NOT EXISTS idx_orders_buyer
    ON orders(buyer_id);

CREATE INDEX IF NOT EXISTS idx_orders_seller
    ON orders(seller_id);

CREATE INDEX IF NOT EXISTS idx_orders_status
    ON orders(status);

/*
=========================================================
TRANSACTIONS
=========================================================
*/

CREATE TABLE IF NOT EXISTS transactions (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    order_id UUID
        REFERENCES orders(id)
        ON DELETE SET NULL,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    transaction_type VARCHAR(100) NOT NULL,

    provider VARCHAR(100),

    provider_reference TEXT,

    blockchain VARCHAR(100),

    blockchain_tx_hash TEXT,

    amount NUMERIC(30,8),

    currency VARCHAR(20),

    status VARCHAR(50) NOT NULL
        DEFAULT 'pending',

    metadata JSONB,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

/*
=========================================================
TRANSACTION INDEXES
=========================================================
*/

CREATE INDEX IF NOT EXISTS idx_transactions_user
    ON transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_order
    ON transactions(order_id);

CREATE INDEX IF NOT EXISTS idx_transactions_status
    ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_transactions_provider_reference
    ON transactions(provider_reference);

/*
=========================================================
WALLETS
=========================================================
*/

CREATE TABLE IF NOT EXISTS wallets (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    network VARCHAR(100) NOT NULL,

    address TEXT NOT NULL,

    wallet_type VARCHAR(50)
        DEFAULT 'external',

    status VARCHAR(50) NOT NULL
        DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, network, address)
);

/*
=========================================================
WALLET INDEXES
=========================================================
*/

CREATE INDEX IF NOT EXISTS idx_wallets_user
    ON wallets(user_id);

CREATE INDEX IF NOT EXISTS idx_wallets_network
    ON wallets(network);

/*
=========================================================
ADMIN APPROVALS
=========================================================
*/

CREATE TABLE IF NOT EXISTS admin_approvals (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    target_type VARCHAR(100) NOT NULL,

    target_id UUID NOT NULL,

    action VARCHAR(100) NOT NULL,

    requested_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    reviewed_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    status VARCHAR(50) NOT NULL
        DEFAULT 'pending',

    reason TEXT,

    reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

/*
=========================================================
ADMIN APPROVAL INDEXES
=========================================================
*/

CREATE INDEX IF NOT EXISTS idx_admin_approvals_status
    ON admin_approvals(status);

CREATE INDEX IF NOT EXISTS idx_admin_approvals_target
    ON admin_approvals(target_type, target_id);

/*
=========================================================
AUDIT LOGS
=========================================================
*/

CREATE TABLE IF NOT EXISTS audit_logs (

    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    user_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    action VARCHAR(255) NOT NULL,

    resource_type VARCHAR(100),

    resource_id UUID,

    request_id VARCHAR(255),

    ip_address INET,

    user_agent TEXT,

    metadata JSONB,

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

/*
=========================================================
AUDIT INDEXES
=========================================================
*/

CREATE INDEX IF NOT EXISTS idx_audit_logs_user
    ON audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action
    ON audit_logs(action);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
    ON audit_logs(created_at);

/*
=========================================================
UPDATED_AT TRIGGERS
=========================================================
*/

DROP TRIGGER IF EXISTS users_updated_at
ON users;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS kyc_applications_updated_at
ON kyc_applications;

CREATE TRIGGER kyc_applications_updated_at
BEFORE UPDATE ON kyc_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS seller_profiles_updated_at
ON seller_profiles;

CREATE TRIGGER seller_profiles_updated_at
BEFORE UPDATE ON seller_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS listings_updated_at
ON listings;

CREATE TRIGGER listings_updated_at
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS orders_updated_at
ON orders;

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS transactions_updated_at
ON transactions;

CREATE TRIGGER transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS wallets_updated_at
ON wallets;

CREATE TRIGGER wallets_updated_at
BEFORE UPDATE ON wallets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS admin_approvals_updated_at
ON admin_approvals;

CREATE TRIGGER admin_approvals_updated_at
BEFORE UPDATE ON admin_approvals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

/*
=========================================================
SCHEMA COMPLETE
=========================================================
*/

COMMIT;
