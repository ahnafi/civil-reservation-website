@extends('emails.layouts.admin')

@section('title', 'Lanjutkan Pembayaran')

@section("content")

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Halo Bapak/Ibu {{$transaction->submission->user->name}},</p>
                <p>Transaksi pembayaran Anda dengan nomor
                    <span
                        style="padding: 2px 4px; background-color:#fef3c7; border-radius: 4px; font-weight: bold; display: inline-block; color: #f59e0b;">{{ $transaction->code }}</span>
                    telah berhasil dibuat.
                </p>
                <p>Mohon segera lanjutkan pembayaran untuk menyelesaikan proses pengajuan Anda.</p>
            </div>
        </td>
    </tr>

    {{-- Detail Transaksi --}}
    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p><strong>Detail Transaksi:</strong></p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0"
                style="color:#000;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border-collapse:collapse;">
                
                <tr style="border-bottom:1px solid #fbbf24;">
                    <td style="padding: 12px 15px; font-weight: bold; color: #92400e; background-color: #fffbeb; border-right: 1px solid #fbbf24;">Kode Transaksi</td>
                    <td style="padding: 12px 15px; background-color: #fffbeb;">{{ $transaction->code }}</td>
                </tr>
                
                <tr style="border-bottom:1px solid #fbbf24;">
                    <td style="padding: 12px 15px; font-weight: bold; color: #92400e; background-color: #fefcf3; border-right: 1px solid #fbbf24;">Kode Pengajuan</td>
                    <td style="padding: 12px 15px; background-color: #fefcf3;">{{ $transaction->submission->code }}</td>
                </tr>
                
                <tr style="border-bottom:1px solid #fbbf24;">
                    <td style="padding: 12px 15px; font-weight: bold; color: #92400e; background-color: #fffbeb; border-right: 1px solid #fbbf24;">Total Pembayaran</td>
                    <td style="padding: 12px 15px; background-color: #fffbeb; font-weight: bold; color: #f59e0b; font-size: 16px;">Rp {{ number_format($transaction->amount, 0, ',', '.') }}</td>
                </tr>
                
                <tr style="border-bottom:1px solid #fbbf24;">
                    <td style="padding: 12px 15px; font-weight: bold; color: #92400e; background-color: #fefcf3; border-right: 1px solid #fbbf24;">Batas Waktu Pembayaran</td>
                    <td style="padding: 12px 15px; background-color: #fefcf3; color: #dc2626; font-weight: 600;">{{ \Carbon\Carbon::parse($transaction->payment_deadline)->format('d M Y H:i') }} WIB</td>
                </tr>
                
                @if($transaction->payment_invoice_file)
                <tr style="border-bottom:1px solid #fbbf24;">
                    <td style="padding: 12px 15px; font-weight: bold; color: #92400e; background-color: #fffbeb; border-right: 1px solid #fbbf24;">Invoice Pembayaran</td>
                    <td style="padding: 12px 15px; background-color: #fffbeb;">
                        <a href="{{ asset('storage/' . $transaction->payment_invoice_file) }}" 
                           style="color: #f59e0b; text-decoration: none; font-weight: 600; padding: 4px 8px; background-color: #fef3c7; border-radius: 4px; display: inline-block;"
                           target="_blank">
                            📄 Download Invoice
                        </a>
                    </td>
                </tr>
                @endif
                
                @if($transaction->note)
                <tr style="border-bottom:1px solid #fbbf24;">
                    <td style="padding: 12px 15px; font-weight: bold; color: #92400e; background-color: #fefcf3; border-right: 1px solid #fbbf24; vertical-align: top;">Catatan</td>
                    <td style="padding: 12px 15px; background-color: #fefcf3; color: #374151;">{{ $transaction->note }}</td>
                </tr>
                @endif
                
            </table>
        </td>
    </tr>

    {{-- Rincian Item Pengajuan --}}
    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p><strong>Rincian Pengajuan:</strong></p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0"
                style="color:#000;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border-collapse:collapse;">
                <tr style="background-color: #fffbeb; border-bottom:2px solid #f59e0b;">
                    <th style="padding: 12px 15px; text-align: left; font-weight: bold; color: #92400e; border-right: 1px solid #fbbf24;">Item</th>
                    <th style="padding: 12px 15px; text-align: left; font-weight: bold; color: #92400e; border-right: 1px solid #fbbf24;">Jenis Pengujian</th>
                    <th style="padding: 12px 15px; text-align: left; font-weight: bold; color: #92400e; border-right: 1px solid #fbbf24;">Kuantitas</th>
                    <th style="padding: 12px 15px; text-align: right; font-weight: bold; color: #92400e;">Harga</th>
                </tr>
                @foreach ($transaction->submission->tests as $item)
                    <tr style="border-bottom:1px solid #fbbf24;">
                        <td style="padding: 12px 15px; border-right: 1px solid #fbbf24;">{{$item->name}}</td>
                        <td style="padding: 12px 15px; border-right: 1px solid #fbbf24;">Satuan</td>
                        <td style="padding: 12px 15px; border-right: 1px solid #fbbf24;">{{$item->pivot->quantity}}</td>
                        <td style="padding: 12px 15px; text-align: right;">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    </tr>
                @endforeach

                @foreach ($transaction->submission->packages as $item)
                    <tr style="border-bottom:1px solid #fbbf24;">
                        <td style="padding: 12px 15px; border-right: 1px solid #fbbf24;">{{$item->name}}</td>
                        <td style="padding: 12px 15px; border-right: 1px solid #fbbf24;">Paket</td>
                        <td style="padding: 12px 15px; border-right: 1px solid #fbbf24;">1</td>
                        <td style="padding: 12px 15px; text-align: right;">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    </tr>
                @endforeach

                {{-- <tr style="background-color: #fef3c7; border-top: 2px solid #f59e0b;">
                    <td style="padding: 15px; font-weight: bold; color: #f59e0b;">TOTAL PEMBAYARAN</td>
                    <td style="padding: 15px;"></td>
                    <td style="padding: 15px;"></td>
                    <td style="padding: 15px; font-weight: bold; text-align: right; color: #f59e0b; font-size: 16px;">Rp {{ number_format($transaction->amount, 0, ',', '.') }}</td>
                </tr> --}}
            </table>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p><strong>Langkah selanjutnya:</strong></p>
                <ol style="margin: 8px 0; padding-left: 20px; color: #374151;">
                    <li>Klik tombol "Bayar Sekarang" di bawah</li>
                    <li>Pilih metode pembayaran yang tersedia</li>
                    <li>Upload bukti pembayaran</li>
                    <li>Tunggu konfirmasi dari tim kami</li>
                </ol>
            </div>
        </td>
    </tr>

    <tr>
        <td align="center" style="font-size:0px;padding:20px 25px;word-break:break-word">
            <table border="0" style="border-collapse:separate;line-height:100%;">
                <tr>
                    <td align="center" bgcolor="#f59e0b" role="presentation"
                        style="border:none;border-radius:6px;cursor:auto;mso-padding-alt:15px 30px;background:#f59e0b;"
                        valign="middle">
                        <a href="{{ route('history-transactions-detail', $transaction->code) }}"
                            style="display:inline-block;background:#f59e0b;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:15px 30px;mso-padding-alt:0px;border-radius:6px;">
                            Bayar Sekarang
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

@endsection