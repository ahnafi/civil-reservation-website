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
    avatar?: string;
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
    image: string;
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

// Submission Type
export interface SubmissionSchedule {
    id: number;
    code: string;
    company_name: string;
    test_submission_date: string;
    status: string;
    test_id: number;
    package_id: number;
    test_name: string;
    package_name: string;
    lab_id: number;
    lab_code: string;
    lab_name: string;
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
    image: string;
}

// Transaction Types
export type TransactionStatus = 'pending' | 'success' | 'failed';
export type PaymentMethod = 'BANK JATENG' | 'BANK MANDIRI' | 'BANK BNI' | 'BANK BRI' | 'BANK BSI' | 'BANK BTN';

export interface Transaction {
    id: number;
    code: string;
    amount: number;
    payment_method?: PaymentMethod | null;
    note?: string | null;
    status: TransactionStatus;
    payment_invoice_file?: string | null;
    payment_receipt_image?: string | null;
    payment_deadline: string;
    payment_date?: string | null;
    submission_id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

// Testing Types
export type TestingStatus = 'testing' | 'completed';

export interface Testing {
    id: number;
    code?: string | null;
    status: TestingStatus;
    note?: string | null;
    documents?: string | null;
    test_date: string;
    completed_at?: string | null;
    submission_id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    links?: unknown;
}

export type PaginatedTests = Pagination<Test>;
export type PaginatedPackage = Pagination<Package>;
export type PaginatedLaboratories = Pagination<Laboratory>;
