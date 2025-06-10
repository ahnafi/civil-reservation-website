import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
    
const formSchema = z.object({
    company_name: z.string().min(1, "Nama perusahaan wajib diisi"),
    project_name: z.string().min(1, "Nama proyek wajib diisi"),
    project_address: z.string().min(1, "Alamat proyek wajib diisi"),
    test_submission_date: z.string(),
    user_note: z.string().optional()
});

export default function OrderForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company_name: "",
            project_name: "",
            project_address: "",
            test_submission_date: "",
            user_note: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log("Form Data:", data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg p-4 shadow-sm">
                <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Nama Perusahaan <span className="text-red-base">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan nama perusahaan" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="project_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Nama Proyek <span className="text-red-base">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan nama proyek" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="project_address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Alamat Proyek <span className="text-red-base">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan alamat proyek" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="user_note"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catatan</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tambahkan catatan (jika ada)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Kirim Pesanan</Button>
            </form>
        </Form>
    );
}
