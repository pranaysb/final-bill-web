-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the 'addresses' table
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address_text TEXT NOT NULL,
    gst_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment on table and columns
COMMENT ON TABLE public.addresses IS 'Stores buyer addresses for quick selection.';
COMMENT ON COLUMN public.addresses.name IS 'Name of the buyer/company.';
COMMENT ON COLUMN public.addresses.address_text IS 'Full address, including street, city, state, pincode.';
COMMENT ON COLUMN public.addresses.gst_number IS 'GST Identification Number of the buyer.';

-- 2. Create the 'invoices' table
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no TEXT NOT NULL,
    buyer_address TEXT NOT NULL,
    invoice_date DATE NOT NULL,
    vehicle_no TEXT,
    quantity INT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    rate NUMERIC(10, 2) NOT NULL,
    taxable_value NUMERIC(10, 2) NOT NULL,
    cgst_amount NUMERIC(10, 2) NOT NULL,
    sgst_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment on table and columns
COMMENT ON TABLE public.invoices IS 'Stores all generated invoice records.';
COMMENT ON COLUMN public.invoices.buyer_address IS 'The full buyer address text at the time of invoice creation.';
COMMENT ON COLUMN public.invoices.invoice_date IS 'The billing date for the invoice.';
COMMENT ON COLUMN public.invoices.total_amount IS 'The final amount including all taxes.';
COMMENT ON COLUMN public.invoices.taxable_value IS 'The amount before CGST and SGST are applied.';