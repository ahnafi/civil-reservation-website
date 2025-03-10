import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import LaboratoryLogo from "@/components/laboratory-logo";

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                    <LaboratoryLogo/>
                </Link>
                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="px-4 md:px-8 pt-4 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-4 md:px-8 py-4">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
