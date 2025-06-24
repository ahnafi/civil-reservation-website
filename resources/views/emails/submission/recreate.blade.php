@extends('emails.layouts.main')

@section('title', 'Pengujian Ulang Diperlukan')

@section("content")

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Halo Bapak/Ibu {{ $submission->user->name }},</p>
                <p>Kami informasikan berdasarkan hasil pengujian sebelumnya, pengujian untuk permohonan Anda dengan nomor
                    <span
                        style="padding: 2px 4px; background-color:#fef3c7; border-radius: 4px; font-weight: bold; display: inline-block; color: #f59e0b;">{{ $submission->code }}</span>
                    dilakukan ulang.
                </p>
                <p>Pengujian ulang ini diperlukan karena alasan teknis atau ketidaksesuaian hasil, dan akan dilakukan oleh
                    tim laboratorium dalam waktu dekat.</p>
                <p>Namun, sesuai dengan prosedur layanan kami, pengujian ulang memerlukan pembayaran tambahan sesuai biaya
                    pengujian yang berlaku.</p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p><strong>Rincian Pengujian yang Akan Diulang:</strong></p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0"
                style="color:#000;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border-collapse:collapse;">
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
                    <td style="padding: 5px 15px 5px 0; font-weight:bold">TOTAL BIAYA ULANG</td>
                    <td style="padding: 0 15px;"></td>
                    <td style="padding: 0 15px;"></td>
                    <td style="padding: 0 0 0 15px; font-weight:bold; color: #f59e0b;" align="right">Rp
                        {{ number_format($submission->total_cost, 0, ',', '.') }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p style="font-weight: 600;">👉 Link Pembayaran:</p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0" style="border-collapse:separate;line-height:100%;">
                <tr>
                    <td align="center" bgcolor="#f59e0b" role="presentation"
                        style="border:none;border-radius:6px;cursor:auto;mso-padding-alt:12px 24px;background:#f59e0b;"
                        valign="middle">
                        <a href="{{ route('history-submission-detail', $submission->code) }}"
                            style="display:inline-block;background:#f59e0b;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 24px;mso-padding-alt:0px;border-radius:6px;">
                            Lanjutkan ke Pembayaran
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:18px;text-align:left;color:#64748b;">
                <p>Setelah pembayaran dikonfirmasi, kami akan segera menjadwalkan ulang pengujian Anda dan memberikan
                    notifikasi lebih lanjut.</p>
            </div>
        </td>
    </tr>

@endsection