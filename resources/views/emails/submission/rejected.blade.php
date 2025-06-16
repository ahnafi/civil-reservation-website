@extends('emails.layouts.main')

@section('title', 'Pengajuan Peminjaman Ditolak')

@section("content")
    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Halo Bapak/Ibu {{$submission->user->name}},</p>
                <p>Kami mengucapkan terima kasih atas pengajuan Anda dengan nomor
                    <span
                        style="padding: 2px 4px; background-color:#fee2e2; border-radius: 4px; font-weight: bold; display: inline-block; color: #dc2626;">{{ $submission->code }}</span>.
                </p>
                <p>Setelah melalui proses evaluasi, kami informasikan bahwa pengajuan Anda belum dapat disetujui pada saat
                    ini.</p>

                @if($reason)
                    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 15px 0;">
                        <p style="margin: 0; font-weight: 600; color: #dc2626;">Alasan penolakan:</p>
                        <p style="margin: 8px 0 0 0; color: #7f1d1d;">{{ $reason ?? "Tidak ada alasan penolakan" }}</p>
                    </div>
                @endif

                <p>Berikut adalah rincian pengujian yang diajukan:</p>
            </div>
        </td>
    </tr>
    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table 0="[object Object]" 1="[object Object]" 2="[object Object]" border="0"
                style="color:#000;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;">
                <tr style="border-bottom:1px solid #ecedee;text-align:left;">
                    <th style="padding: 0 15px 10px 0;">Item</th>
                    <th style="padding: 0 15px;">Jenis Pengujian</th>
                    <th style="padding: 0 15px;">Kuantitas</th>
                    <th style="padding: 0 0 0 15px;" align="right">Harga</th>
                </tr>
                @foreach ($submission->tests as $item)
                    <tr>
                        <td style="padding: 5px 15px 5px 0;">{{$item->name}}</td>
                        <td style="padding: 0 15px;">Satuan</td>
                        <td style="padding: 0 15px;">{{$item->pivot->quantity}}</td>
                        <td style="padding: 0 0 0 15px;" align="right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    </tr>
                @endforeach

                @foreach ($submission->packages as $item)
                    <tr>
                        <td style="padding: 0 15px 5px 0;">{{$item->name}}</td>
                        <td style="padding: 0 15px;">Paket</td>
                        <td style="padding: 0 15px;">1</td>
                        <td style="padding: 0 0 0 15px;" align="right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    </tr>
                @endforeach

                <tr style="border-bottom:2px solid #ecedee;text-align:left;padding:15px 0;">
                    <td style="padding: 5px 15px 5px 0; font-weight:bold">TOTAL</td>
                    <td style="padding: 0 15px;"></td>
                    <td style="padding: 0 15px;"></td>
                    <td style="padding: 0 0 0 15px; font-weight:bold" align="right">Rp
                        {{ number_format($submission->total_cost, 0, ',', '.') }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:18px;text-align:left;color:#64748b;">
                <p>Kami memahami bahwa ini mungkin tidak sesuai harapan Anda. Jika Anda ingin mengetahui alasan penolakan
                    atau ingin mengajukan ulang, silakan hubungi kami melalui halaman bantuan di aplikasi.</p>

            </div>
        </td>
    </tr>

@endsection