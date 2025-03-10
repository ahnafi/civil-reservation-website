import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CloudUpload, X } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";

const formSchema = z.object({
    companyName: z.string().min(1, "Nama perusahaan wajib diisi"),
    projectName: z.string().min(1, "Nama proyek wajib diisi"),
    projectAddress: z.string().min(1, "Alamat proyek wajib diisi"),
    document: z.instanceof(FileList).refine(files => files.length > 0, "Dokumen wajib diunggah"),
    notes: z.string().optional()
});

export default function OrderForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            projectName: "",
            projectAddress: "",
            document: undefined,
            notes: ""
        }
    });

    const [files, setFiles] = useState<FileList | null>(null);
    const [fileToRemove, setFileToRemove] = useState<File | null>(null);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log("Form Data:", data);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            setFiles(selectedFiles);
            form.setValue("document", selectedFiles);
        }
    };

    const handleRemoveFile = (file: File) => {
        setFileToRemove(file);
    };

    const confirmRemoveFile = () => {
        if (files && fileToRemove) {
            const newFiles = Array.from(files).filter(f => f !== fileToRemove);
            const dataTransfer = new DataTransfer();
            newFiles.forEach(file => dataTransfer.items.add(file));
            setFiles(dataTransfer.files);
            form.setValue("document", dataTransfer.files);
            setFileToRemove(null);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg p-4 shadow-sm">
                <FormField
                    control={form.control}
                    name="companyName"
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
                    name="projectName"
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
                    name="projectAddress"
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
                    name="document"
                    render={() => (
                        <FormItem>
                            <FormLabel>
                                Unggah File <span className="text-red-base">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="rounded-lg border border-dashed border-gray-400 p-4 text-center">
                                    <label className="cursor-pointer">
                                        <input type="file" multiple className="hidden" onChange={handleFileChange} />
                                        <div className="flex flex-col items-center">
                                            <CloudUpload className="h-10 w-10 text-gray-500" />
                                            <p className="mb-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                                            <p className="text-xs text-gray-500">SVG, PNG, JPG, or GIF</p>
                                        </div>
                                    </label>
                                </div>
                            </FormControl>
                            {files && files.length > 0 && (
                                <ul className="mt-2 text-sm text-gray-700">
                                    {Array.from(files).map((file: File, index: number) => (
                                        <li key={index} className="w-fit flex items-center gap-2 truncate rounded-md bg-gray-100 px-2 py-1">
                                            <span>{file.name}</span>
                                            <button type="button" className="text-red-base font-semibold cursor-pointer" onClick={() => handleRemoveFile(file)}>
                                                <X className="w-4"/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catatan (Opsional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Tambahkan catatan (jika ada)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Kirim Pesanan</Button>
            </form>

            {fileToRemove && (
                <AlertDialog open={!!fileToRemove} onOpenChange={() => setFileToRemove(null)}>
                    <AlertDialogTrigger asChild>
                        <button className="hidden">Trigger</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Hapus File</AlertDialogTitle>
                            <AlertDialogDescription>Apakah Anda yakin ingin menghapus file ini?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button className="cursor-pointer" variant="outline" onClick={() => setFileToRemove(null)}>
                                Batal
                            </Button>
                            <Button className="cursor-pointer" variant="destructive" onClick={confirmRemoveFile}>
                                Hapus
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Form>
    );
}
