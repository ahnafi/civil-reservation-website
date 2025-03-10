// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verifikasi Email" description="Silakan verifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan ke email Anda.">
            <Head title="Verifikasi Email" />
            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}
            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="link" className={`bg-blue-base text-light-base cursor-pointer ${processing ? 'cursor-not-allowed' : ''}`}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Kirim Ulang Verifikasi Email
                </Button>

                <TextLink href={route('logout')} method="post" className="text-blue-base mx-auto block text-sm">
                    Keluar
                </TextLink>
            </form>
        </AuthLayout>
    );
}
