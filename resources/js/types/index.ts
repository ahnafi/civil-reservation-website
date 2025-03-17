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
    dailySlot: number;
    isActive: boolean;
    category_id: number;
    laboratory_id: number;
    created_at: Date;
    updated_at: Date;
    deletedAt: Date | null;
    category: Category;
    laboratory: Laboratory;
}

export interface Pagination<T> {
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

export type PaginatedTests = Pagination<Test>;
