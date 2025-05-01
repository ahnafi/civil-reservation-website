import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, ClipboardCheck, Clock, Building2, Package, Beaker, FileText } from "lucide-react";

// Type definition for test record
interface TestRecord {
  id: number;
  code: string;
  company_name: string;
  test_submission_date: string;
  status: string;
  test_id: number | null;
  package_id: number;
  test_name: string | null;
  package_name: string;
  lab_id: number;
  lab_code: string;
  lab_name: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Component for info items
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="mt-0.5 text-gray-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  </div>
);

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let colorClasses = "bg-gray-100 text-gray-800";
  
  if (status === "approved") {
    colorClasses = "bg-green-100 text-green-800";
  } else if (status === "pending") {
    colorClasses = "bg-yellow-100 text-yellow-800";
  } else if (status === "rejected") {
    colorClasses = "bg-red-100 text-red-800";
  }
  
  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses} inline-flex items-center gap-1.5`}>
      {status === "approved" && <ClipboardCheck className="w-4 h-4" />}
      {status === "pending" && <Clock className="w-4 h-4" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default function TestDetailView() {
  // Normally this would come from props or a data fetching hook
  const testRecord: TestRecord = {
    "id": 45,
    "code": "SBM-001045",
    "company_name": "PT. Karya Masa Kini",
    "test_submission_date": "2025-05-13",
    "status": "approved",
    "test_id": null,
    "package_id": 3,
    "test_name": null,
    "package_name": "Uji Kekuatan Beton dan Baja",
    "lab_id": 3,
    "lab_code": "LSBB",
    "lab_name": "Lab Struktur dan Bahan Bangunan"
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with back button */}
      <div className="mb-6">
        <Button variant="outline" size="sm" className="gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Detail Pengujian</h1>
            <p className="text-gray-500">Informasi lengkap tentang pengujian yang dilakukan</p>
          </div>
          <Button className="gap-2">
            <Printer className="w-4 h-4" />
            Cetak
          </Button>
        </div>
      </div>

      {/* Main card */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{testRecord.code}</CardTitle>
              <CardDescription>Diajukan pada {formatDate(testRecord.test_submission_date)}</CardDescription>
            </div>
            <StatusBadge status={testRecord.status} />
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informasi Umum</h3>
              
              <InfoItem 
                icon={<Building2 className="w-5 h-5" />} 
                label="Perusahaan" 
                value={testRecord.company_name} 
              />
              
              <InfoItem 
                icon={<Package className="w-5 h-5" />} 
                label="Paket Pengujian" 
                value={testRecord.package_name} 
              />
              
              <InfoItem 
                icon={<Beaker className="w-5 h-5" />} 
                label="Laboratorium" 
                value={testRecord.lab_name} 
              />
              
              <InfoItem 
                icon={<FileText className="w-5 h-5" />} 
                label="Kode Lab" 
                value={testRecord.lab_code} 
              />
            </div>
            
            {/* Right column - Timeline or additional info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Status Pengujian</h3>
              
              <div className="relative pl-6 border-l-2 border-green-500">
                <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2.5"></div>
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500">13 Mei 2025</p>
                  <p className="font-medium">Pengajuan diterima</p>
                  <p className="text-sm text-gray-600">Pengajuan pengujian telah diterima</p>
                </div>
                
                <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2.5 top-20"></div>
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500">14 Mei 2025</p>
                  <p className="font-medium">Verifikasi</p>
                  <p className="text-sm text-gray-600">Sampel telah diverifikasi oleh Lab LSBB</p>
                </div>
                
                <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2.5 top-40"></div>
                <div>
                  <p className="text-sm font-medium text-gray-500">15 Mei 2025</p>
                  <p className="font-medium">Pengujian disetujui</p>
                  <p className="text-sm text-gray-600">Hasil pengujian telah disetujui</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t border-gray-200 gap-2 flex justify-end">
          <Button variant="outline">Lihat Hasil Lengkap</Button>
          <Button>Unduh Laporan</Button>
        </CardFooter>
      </Card>
    </div>
  );
}