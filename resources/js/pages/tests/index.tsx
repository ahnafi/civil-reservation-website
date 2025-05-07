import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PaginatedTests, Test, TestCart } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengujian',
        href: '/tests',
    },
];

export default function Tests({ tests }: { tests: PaginatedTests }) {
    const [testCart, setTestCart] = useState<TestCart[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const savedTest = localStorage.getItem('test_cart');
        if (savedTest) {
            const parsedTest = JSON.parse(savedTest);
            setTestCart(parsedTest);
        }
    }, []);

    const handleAddTestToCart = (test: Test) => {
        setIsAdding(true);
        const existingTest: TestCart | undefined = testCart.find((item) => item.test_id === test.id);
        if (existingTest) {
            alert('Test already exists in the cart');
            setIsAdding(false);
        } else {
            const newTestCart: TestCart = {
                test_id: test.id,
                slug: test.slug,
                unit: test.minimum_unit,
                test: test,
            }
            setTestCart([...testCart, newTestCart]);
            alert('Test added to cart');
            localStorage.setItem('test_cart', JSON.stringify([...testCart, newTestCart]));
            setIsAdding(false);
        }
    };

    const formatRupiah = (value: number, currency = 'IDR') => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const renderPaginationLinks = () => {
        const { links, current_page, last_page } = tests;

        const numberedLinks = links.filter((link) => !link.label.includes('Sebelumnya') && !link.label.includes('Berikutnya'));

        return (
            <div className="mt-6 flex items-center justify-center gap-1 small-font-size">
                <Button variant="outline" size="icon" disabled={current_page === 1} asChild={current_page !== 1}>
                    {current_page !== 1 ? (
                        <Link href={tests.prev_page_url || '#'}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    ) : (
                        <span>
                            <ChevronLeft className="h-4 w-4" />
                        </span>
                    )}
                </Button>
                {numberedLinks.map((link, i: number) => (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        className={link.active ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        asChild={!link.active}
                    >
                        {!link.active ? (
                            <Link href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        )}
                    </Button>
                ))}
                <Button variant="outline" size="icon" disabled={current_page === last_page} asChild={current_page !== last_page}>
                    {current_page !== last_page ? (
                        <Link href={tests.next_page_url || '#'}>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <span>
                            <ChevronRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </div>
        );
    };

    return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengujian" />
            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {tests.data.map((data: Test) => (
                        <Card className="gap-0 p-2" key={data.id}>
                            <CardHeader className="px-0">
                                <Link href={'/test/' + data.slug}>
                                    <img
                                        src={'/storage/test_image/' + data.images}
                                        alt={data.name}
                                        className="h-48 w-full rounded-md object-cover md:h-54 lg:h-60"
                                    />
                                </Link>
                                <CardTitle>
                                    <Link href={'/test/' + data.slug}>
                                        <h3 className="truncate-2-lines">{data.name}</h3>
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-0">
                                <CardDescription className="mb-4 space-y-2">
                                    <p className="truncate-2-lines">{data.description}</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-light-base bg-amber-base flex items-center gap-1 rounded-md px-2 py-1" title="Satuan">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                                className="h-4 w-4 md:h-5 md:w-5"
                                                fill="currentColor"
                                            >
                                                <path d="M342.6 9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L28.1 342.6C10.1 360.6 0 385 0 410.5L0 416c0 53 43 96 96 96l5.5 0c25.5 0 49.9-10.1 67.9-28.1L448 205.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-32-32-96-96-32-32zM205.3 256L352 109.3 402.7 160l-96 96-101.5 0z" />
                                            </svg>
                                            <span className="small-font-size">{data.category.name}</span>
                                        </div>
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
                                            <span className="small-font-size">{data.laboratory.code}</span>
                                        </div>
                                        <div
                                            className="text-light-base bg-teal-base flex items-center gap-1 rounded-md px-2 py-1"
                                            title="Minimum Pemesanan"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                fill="currentColor"
                                                className="h-4 w-4 md:h-5 md:w-5"
                                            >
                                                <path d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
                                            </svg>
                                            <span className="small-font-size">{data.minimum_unit}</span>
                                        </div>
                                    </div>
                                </CardDescription>
                                <div className="flex flex-wrap items-center justify-between">
                                    <h4 className="font-semibold">{formatRupiah(data.price)}</h4>
                                    <Button
                                        onClick={() => handleAddTestToCart(data)}
                                        variant="outline"
                                        disabled={isAdding}
                                        className="cursor-pointer flex items-center justify-between gap-1 rounded-md px-3 py-2"
                                    >
                                        <svg
                                            className="h-4 w-4 md:h-5 md:w-5"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                                            ></path>
                                        </svg>
                                        <span className="small-font-size">Tambah ke Keranjang</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {renderPaginationLinks()}
                <span className="mt-4 small-font-size text-center text-gray-500 col">
                    Menampilkan {tests.from} hingga {tests.to} dari {tests.total} pengujian
                </span>
            </div>
        </AppLayout>
    );
}
