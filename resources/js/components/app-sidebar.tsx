import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, FileText, CalendarDays, FlaskConical, Folder, HardHat, History, LayoutGrid, Package, ShoppingCart } from 'lucide-react';

const serviceNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Laboratorium',
        url: '/laboratories',
        icon: FlaskConical,
    },
    {
        title: 'Pengujian',
        url: '/tests',
        icon: HardHat,
    },
    {
        title: 'Paket',
        url: '/packages',
        icon: Package,
    },
    {
        title: 'Jadwal Pengujian',
        url: '/schedule',
        icon: CalendarDays,
    },
];

const orderNavItems: NavItem[] = [
    {
        title: 'Keranjang',
        url: '/orders/cart',
        icon: ShoppingCart,
    },
    {
        title: 'Hasil Pengujian',
        url: '/',
        icon: FileText,
    },
];

const historyNavItems: NavItem[] = [
    {
        title: 'Pengajuan',
        url: '/history/submissions',
        icon: History,
    },
    {
        title: 'Transaksi',
        url: '/history/payments',
        icon: History,
    },
    {
        title: 'Pengujian',
        url: '/history/tests',
        icon: History,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <img src="/img/logos/unsoed.png" alt="Unsoed Logo" className="w-10" />
                                <div className="flex flex-col gap-1">
                                    <small className="text-xs font-black">Laboratorium Teknik Sipil</small>
                                    <small className="text-[10px] font-medium">Universitas Jenderal Soedirman</small>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label="Layanan" items={serviceNavItems} />
                <NavMain label="Pesanan" items={orderNavItems} />
                <NavMain label="Riwayat" items={historyNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
