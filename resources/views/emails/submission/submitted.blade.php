@extends('emails.layouts.admin')

@section('title', 'Pengajuan Baru Menunggu Review')

@section("content")

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Halo Admin,</p>
                <p>Ada pengajuan baru yang perlu direview dengan nomor 
                    <span
                        style="padding: 2px 4px; background-color:#dbeafe; border-radius: 4px; font-weight: bold; display: inline-block; color: #1d4ed8;">{{ $submission->code }}</span>
                    dari <strong>{{ $submission->user->name }}</strong>.
                </p>
                <p>Berikut adalah rincian pengajuan yang diajukan:</p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0"
                style="color:#000;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border-collapse:collapse;">
                <tr style="background-color: #f8fafc; border-bottom:2px solid #e2e8f0;">
                    <th style="padding: 12px 15px; text-align: left; font-weight: bold; color: #1e293b; border-right: 1px solid #e2e8f0;">Item</th>
                    <th style="padding: 12px 15px; text-align: left; font-weight: bold; color: #1e293b; border-right: 1px solid #e2e8f0;">Jenis Pengujian</th>
                    <th style="padding: 12px 15px; text-align: left; font-weight: bold; color: #1e293b; border-right: 1px solid #e2e8f0;">Kuantitas</th>
                    <th style="padding: 12px 15px; text-align: right; font-weight: bold; color: #1e293b;">Harga</th>
                </tr>
                @foreach ($submission->tests as $item)
                    <tr style="border-bottom:1px solid #e2e8f0;">
                        <td style="padding: 12px 15px; border-right: 1px solid #e2e8f0;">{{$item->name}}</td>
                        <td style="padding: 12px 15px; border-right: 1px solid #e2e8f0;">Satuan</td>
                        <td style="padding: 12px 15px; border-right: 1px solid #e2e8f0;">{{$item->pivot->quantity}}</td>
                        <td style="padding: 12px 15px; text-align: right;">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    </tr>
                @endforeach

                @foreach ($submission->packages as $item)
                    <tr style="border-bottom:1px solid #e2e8f0;">
                        <td style="padding: 12px 15px; border-right: 1px solid #e2e8f0;">{{$item->name}}</td>
                        <td style="padding: 12px 15px; border-right: 1px solid #e2e8f0;">Paket</td>
                        <td style="padding: 12px 15px; border-right: 1px solid #e2e8f0;">1</td>
                        <td style="padding: 12px 15px; text-align: right;">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    </tr>
                @endforeach

                <tr style="background-color: #dbeafe; border-top: 2px solid #1d4ed8;">
                    <td style="padding: 15px; font-weight: bold; color: #1d4ed8;">TOTAL</td>
                    <td style="padding: 15px;"></td>
                    <td style="padding: 15px;"></td>
                    <td style="padding: 15px; font-weight: bold; text-align: right; color: #1d4ed8;">Rp {{ number_format($submission->total_cost, 0, ',', '.') }}</td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p><strong>Informasi Pengaju:</strong></p>
                <ul style="margin: 8px 0; padding-left: 20px;">
                    <li><strong>Nama:</strong> {{ $submission->user->name }}</li>
                    <li><strong>Email:</strong> {{ $submission->user->email }}</li>
                    <li><strong>Perusahaan:</strong> {{ $submission->company_name ?? '-' }}</li>
                    <li><strong>Nama Proyek:</strong> {{ $submission->project_name ?? '-' }}</li>
                    <li><strong>Tanggal Pengajuan:</strong> {{ $submission->created_at->format('d F Y, H:i') }}</li>
                </ul>
                <p>Mohon segera melakukan review dan tindak lanjut terhadap pengajuan ini.</p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0" style="border-collapse:separate;line-height:100%;">
                <tr>
                    <td align="center" bgcolor="#1d4ed8" role="presentation"
                        style="border:none;border-radius:6px;cursor:auto;mso-padding-alt:12px 24px;background:#1d4ed8;"
                        valign="middle">
                        <a href="{{ url('/admin/submissions') }}"
                            style="display:inline-block;background:#1d4ed8;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 24px;mso-padding-alt:0px;border-radius:6px;">
                            Review Pengajuan
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

@endsection