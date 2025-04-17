import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laboratorium',
        href: '/laboratories',
    },
];

const dummyData: {
    title: string;
    description: string;
    room: string;
    dailySlots: number;
    status: string;
    link: string;
    image: string;
}[] = [
    {
        title: 'Laboratorium Kimia',
        description: 'Laboratorium kimia adalah tempat untuk melakukan percobaan kimia.',
        room: 'Lab 1',
        dailySlots: 10,
        status: 'Buka',
        link: '/laboratories/example',
        image: '/img/tests/laboratory-1.jpg',
    },
    {
        title: 'Laboratorium Fisika',
        description: 'Laboratorium fisika adalah tempat untuk melakukan percobaan fisika.',
        room: 'Lab 2',
        dailySlots: 5,
        status: 'Tutup',
        link: '/laboratories/example',
        image: '/img/tests/laboratory-1.jpg',
    },
    {
        title: 'Laboratorium Biologi',
        description: 'Laboratorium biologi adalah tempat untuk melakukan percobaan biologi.',
        room: 'Lab 3',
        dailySlots: 15,
        status: 'Buka',
        link: '/laboratories/example',
        image: '/img/tests/laboratory-1.jpg',
    },
    {
        title: 'Laboratorium Komputer',
        description: 'Laboratorium komputer adalah tempat untuk melakukan percobaan komputer.',
        room: 'Lab 4',
        dailySlots: 20,
        status: 'Buka',
        link: '/laboratories/example',
        image: '/img/tests/laboratory-1.jpg',
    },
];

export default function Laboratories() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengujian" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {dummyData.map((data, index) => (
                        <Card className="gap-0 p-2" key={index}>
                            <CardHeader className="px-0">
                                <Link href={data.link}>
                                    <img src={data.image} alt="Laboratory 1 Image" className="rounded-md" />
                                </Link>
                                <CardTitle>
                                    <Link href={data.link}>
                                        <h3>{data.title}</h3>
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-0">
                                <CardDescription className="space-y-2">
                                    <p className="truncate-2-lines">{data.description}</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div
                                            className="text-light-base bg-purple-base flex items-center gap-1 rounded-md px-2 py-1"
                                            title="Laboratorium"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 384 512"
                                                className="h-4 w-4 md:h-5 md:w-5"
                                                fill="currentColor"
                                            >
                                                <path d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z" />
                                            </svg>
                                            <span className="small-font-size">{data.room}</span>
                                        </div>
                                        <div
                                            className="text-light-base bg-lime-base flex items-center gap-1 rounded-md px-2 py-1"
                                            title="Laboratorium"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 320 512"
                                                fill="currentColor"
                                                className="h-4 w-4 md:h-5 md:w-5"
                                            >
                                                <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-223.1L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6l29.7 0c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9 232 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-16 0z" />
                                            </svg>
                                            <span className="small-font-size">{data.dailySlots}</span>
                                        </div>
                                        <div
                                            className="text-light-base bg-cyan-base flex items-center gap-1 rounded-md px-2 py-1"
                                            title="Laboratorium"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                                fill="currentColor"
                                                className="h-4 w-4 md:h-5 md:w-5"
                                            >
                                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                                            </svg>
                                            <span className="small-font-size">{data.status}</span>
                                        </div>
                                    </div>
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
