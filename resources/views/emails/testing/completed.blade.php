@extends('emails.layouts.main')

@section('title', 'Pengujian Telah Selesai')

@section("content")

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Halo {{ $testing->submission->user->name }},</p>
                <p>Kami informasikan bahwa pengujian untuk permohonan Anda dengan nomor
                    <span
                        style="padding: 2px 4px; background-color:#d1fae5; border-radius: 4px; font-weight: bold; display: inline-block; color: #047857;">{{ $testing->code }}</span>
                    telah selesai dilakukan oleh tim Laboratorium Teknik Sipil Universitas Jenderal Soedirman.
                </p>
                <p>Anda dapat melihat hasil dan detail pengujian melalui laman resmi kami.</p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p><strong>Rincian Pengujian yang Telah Selesai:</strong></p>
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
                    <th style="padding: 0 0 0 15px;" align="right">Status</th>
                </tr>
                @foreach ($testing->submission->tests as $item)
                    <tr>
                        <td style="padding: 5px 15px 5px 0;">{{$item->name}}</td>
                        <td style="padding: 0 15px;">Satuan</td>
                        <td style="padding: 0 15px;">{{$item->pivot->quantity}}</td>
                        <td style="padding: 0 0 0 15px;" align="right">
                            <span style="padding: 2px 6px; background-color: #dcfce7; color: #166534; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                Selesai
                            </span>
                        </td>
                    </tr>
                @endforeach

                @foreach ($testing->submission->packages as $item)
                    <tr>
                        <td style="padding: 0 15px 5px 0;">{{$item->name}}</td>
                        <td style="padding: 0 15px;">Paket</td>
                        <td style="padding: 0 15px;">1</td>
                        <td style="padding: 0 0 0 15px;" align="right">
                            <span style="padding: 2px 6px; background-color: #dcfce7; color: #166534; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                Selesai
                            </span>
                        </td>
                    </tr>
                @endforeach
            </table>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; padding: 12px; margin: 15px 0; border-radius: 6px;">
                <p style="margin: 0; font-size: 13px; color: #0c4a6e; text-align: center;">
                    <strong>📋 Informasi:</strong> Hasil pengujian sudah tersedia dan dapat diunduh melalui aplikasi. Silakan klik tombol di bawah untuk melihat hasil lengkap.
                </p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0" style="border-collapse:separate;line-height:100%;">
                <tr>
                    <td align="center" bgcolor="#16a34a" role="presentation"
                        style="border:none;border-radius:6px;cursor:auto;mso-padding-alt:12px 24px;background:#16a34a;"
                        valign="middle">
                        <a href="{{ route('history-testing-detail', $testing->code) }}"
                            style="display:inline-block;background:#16a34a;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 24px;mso-padding-alt:0px;border-radius:6px;">
                            Lihat Hasil Pengujian
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
                <p>Terima kasih telah mempercayakan pengujian kepada Laboratorium Teknik Sipil Universitas Jenderal Soedirman.</p>
            </div>
        </td>
    </tr>

@endsection