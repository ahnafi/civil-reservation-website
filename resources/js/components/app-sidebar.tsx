import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, SharedData } from '@/types';
import { Link , usePage} from '@inertiajs/react';
import {
    BookOpen,
    ClipboardPen,
    CalendarDays,
    PanelsTopLeft,
    FileText,
    FlaskConical,
    Folder,
    HardHat,
    History,
    LayoutGrid,
    Package,
    ShoppingCart,
} from 'lucide-react';

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
        title: 'Reservasi Pengujian',
        url: '/orders/cart',
        icon: ClipboardPen,
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
        url: '/history/transactions',
        icon: History,
    },
    {
        title: 'Pengujian',
        url: '/history/testings',
        icon: History,
    },
];

const otherNavItems: NavItem[] = [
    {
        title: 'Panduan Reservasi',
        url: '/tutorial',
        icon: BookOpen,
    }
];

const adminItems: NavItem[] = [
    {
        title: 'Dashboard Admin',
        url: '/admin',
        icon: PanelsTopLeft,
    }
];


export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const page = usePage();

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
                <NavMain label="Reservasi" items={orderNavItems} />
                <NavMain label="Riwayat" items={historyNavItems} />
                <NavMain label="Lainnya" items={otherNavItems} />
                { user.role === 'admin' && (
                    <NavMain label="Admin" items={adminItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
