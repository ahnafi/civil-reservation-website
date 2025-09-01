import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen">
                <nav className="small-font-size section-padding-x mx-auto flex max-w-screen-lg items-center justify-end gap-4 py-4 md:py-8">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="border-dark-secondary hover:border-dark-base dark:border-light-base inline-block rounded-sm border px-5 py-1.5 leading-normal dark:hover:border-[#62605b]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="hover:border-dark-secondary dark:hover:bg-zinc-900 dark:hover:border-light-base inline-block rounded-sm border border-transparent px-5 py-1.5 leading-normal"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={route('register')}
                                className="border-dark-tertiary hover:border-dark-secondary dark:bg-zinc-900 dark:border-light-base inline-block rounded-sm border px-5 py-1.5 leading-normal dark:hover:border-[#62605b]"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </nav>
                <div className="section-padding-x mx-auto flex max-w-screen-lg items-center justify-between gap-4 py-4 md:py-8">
                    <div className="border-dark-base dark:border-light-base flex flex-col-reverse items-center justify-between overflow-hidden rounded-lg border bg-white shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] md:flex-row dark:bg-[#161615] dark:shadow-[0px_0px_1px_0px_rgba(255,255,255,0.03),0px_1px_2px_0px_rgba(255,255,255,0.06)]">
                        <div className="small-font-size p-4 md:p-8">
                            <h2 className="font-semibold">Selamat Datang</h2>
                            <h4 className="mb-1 font-medium">di Sistem Reservasi Lab Teknik Sipil</h4>
                            <p className="text-dark-secondary dark:text-light-secondary small-font-size">
                                Sistem reservasi lab teknik sipil ini bertujuan untuk mempermudah mahasiswa ataupun pihak eksternal dalam melakukan
                                reservasi lab.
                            </p>
                            <p className="text-dark-secondary dark:text-light-secondary small-font-size">
                                Kami sarankan untuk memulai dengan yang berikut ini.
                            </p>
                            <ul className="text-dark-secondary dark:text-light-secondary mb-4 flex flex-col">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                        Lihat panduan penggunaan sistem reservasi di
                                        <a
                                            href="https://laravel.com/docs"
                                            target="_blank"
                                            className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                        >
                                            <span>Video Berikut</span>
                                            <svg
                                                width={10}
                                                height={11}
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-2.5 w-2.5"
                                            >
                                                <path
                                                    d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                    stroke="currentColor"
                                                    strokeLinecap="square"
                                                />
                                            </svg>
                                        </a>
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                        Baca aturan reservasi lab di
                                        <a
                                            href="https://laracasts.com"
                                            target="_blank"
                                            className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                        >
                                            <span>Terms and Conditions</span>
                                            <svg
                                                width={10}
                                                height={11}
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-2.5 w-2.5"
                                            >
                                                <path
                                                    d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                    stroke="currentColor"
                                                    strokeLinecap="square"
                                                />
                                            </svg>
                                        </a>
                                    </span>
                                </li>
                            </ul>
                            <a
                                href={auth.user ? route('dashboard') : route('login')}
                                className="small-font-size inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                            >
                                Reservasi Sekarang
                            </a>
                        </div>
                        <div className="border-dark-base dark:border-light-base h-64 w-full bg-[url('/img/backgrounds/gedung-ft.jpg')] bg-cover bg-center bg-no-repeat md:h-84 md:border-l lg:h-96 xl:h-108"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
