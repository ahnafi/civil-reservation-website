import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    identity: string;
    role: string;
    photo: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}
export interface Category {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export interface Laboratory {
    id: number;
    name: string;
    code: string;
    room: string;
    slug: string;
    images: string[];
    daily_slot?: number;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export interface Test {
    id: number;
    name: string;
    slug: string;
    price: number;
    description: string;
    images: string[];
    minimum_unit: number;
    daily_slot: number;
    is_active: boolean;
    category_id: number;
    laboratory_id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    category: Category;
    laboratory: Laboratory;
    packages: Package[] | null;
}

export interface Package {
    id: number;
    name: string;
    slug: string;
    price: number;
    images: string[];
    description: string;
    tests: Test[] | null;
    laboratory: Laboratory;
}

export interface Pagination<T> {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    from: number;
    to: number;
    data: T[];
}

// Page Props
export interface PageProps {
    laboratory?: Laboratory;
    tests?: Array<{
        category: Category;
        id: number;
        name: string;
        slug: string;
        price: number;
        description: string;
        images: string;
        minimum_unit: number;
        daily_slot: number;
        is_active: boolean;
    }>;
    packages?: Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        images: string;
        description: string;
    }>;
}

// Base Submission Detail
export type BaseSubmission = {
    id: number;
    code: string;
    submission_type: 'internal' | 'external';
    test_submission_date: string | null;
    status: string;
    user_note: string | null;

    test_id: number | null;
    package_id: number | null;

    test_name: string | null;
    package_name: string | null;

    lab_id: number | null;
    lab_code: string | null;
    lab_name: string | null;
};

// Internal Submission Type
export type InternalSubmission = BaseSubmission & {
    submission_type: 'internal';

    name: string;
    program_study: string;
    research_title: string;
    personnel_count: number;
    supervisor: string;

    company_name: null;
    project_name: null;
    project_address: null;
    total_cost: null;
};

// External Submission Type
export type ExternalSubmission = BaseSubmission & {
    submission_type: 'external';

    // External detail fields
    company_name: string;
    project_name: string;
    project_address: string;
    total_cost: number;

    // Internal fields are always null
    name: null;
    program_study: null;
    research_title: null;
    personnel_count: null;
    supervisor: null;
};

export type SubmissionWithDetails = InternalSubmission | ExternalSubmission;

// External Submission Type
export interface SubmissionSchedule {
    id: number;
    code: string;
    test_submission_date: string;
    submission_type: 'internal' | 'external';
    status: string;

    test_id: number;
    test_name: string;
    test_slug: string;
    quantity: number;
    test_price: number;
    test_images: string[];

    package_id: number;
    package_name: string;
    package_slug: string;
    package_price: number;
    package_images: string[];

    lab_id: number;
    lab_code: string;
    lab_name: string;

    // external details
    company_name: string;
    project_name: string;
    project_address: string;

    researcher_name: string;
    program_study: string;
    research_title: string;
    personnel_count: number;
    supervisor: string;

    created_at: string;
    updated_at: string;
}

// Schedule Type
export interface GeneralSchedule {
    test_submission_date: string;
    company_name: string;
    lab_code: string;
    package_name: string;
    test_name: string;
}

export interface SimpleOption {
    id: number;
    name: string;
}

export interface LaboratorySimple {
    id: number;
    code: string;
    slug: string;
    name: string;
    description: string;
    images: string[];
}

// Transaction Types
export type TransactionStatus = 'pending' | 'success' | 'failed';
export type PaymentMethod = 'BANK JATENG' | 'BANK MANDIRI' | 'BANK BNI' | 'BANK BRI' | 'BANK BSI' | 'BANK BTN';
export type PaymentType = 'main' | 'additional';

export interface Transaction {
    id: number;
    code: string;
    amount: number;
    payment_type: PaymentType;
    payment_method?: PaymentMethod;
    note?: string;
    status: TransactionStatus;
    submission_code: string;
    payment_invoice_files?: string[];
    payment_receipt_images?: string[];
    payment_deadline: string;
    payment_date?: string;
    submission_id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface Testing {
    id: number;
    code?: string | null;
    status: string;
    note?: string | null;
    documents?: string | null;
    test_date: string;
    completed_at?: string | null;
    submission_id: number;
    submission_code: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    links?: unknown;
}

export interface testForSchedule {
    id: number;
    name: string;
    description: string;
    images: string[];
    minimum_unit: number;
    daily_slot: number;
    is_active: boolean;
    category_id: number;
    category_name: string;
    laboratory_id: number;
    laboratory_code: string;
    laboratory_name: string;
}

export interface scheduleForSchedule {
    id: number;
    date: string;
    available_slots: number;
    approved_count: number;
    pending_count: number;
}

export interface Booking {
    company_name: string;
    project_name: string;
    project_address: string;
    test_submission_date: string;
    submission_tests: Test[];
    submission_packages: Package[];
}

export interface TestCart {
    test_id: number;
    slug: string;
    unit: number;
    test: Test;
}

export interface PackageCart {
    package_id: number;
    slug: string;
    package: Package;
    quantity: number;
}

export interface BookingForm {
    company_name: string;
    project_name: string;
    project_address: string;
    test_submission_date: string;
    note: string;
    total_cost: number;
}

export type PaginatedTests = Pagination<Test>;
export type PaginatedPackage = Pagination<Package>;
export type PaginatedLaboratories = Pagination<Laboratory>;
