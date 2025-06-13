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
                        style="padding: 2px 4px; background-color:#edf2f7; border-radius: 4px; font-weight: bold; display: inline-block; color: #222;">{{ $transaction->code }}</span>
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
                <tr style="border-bottom:1px solid #ecedee;">
                    <td
                        style="padding: 12px 15px; font-weight: bold; color: #222; background-color: #f7fafc; border-right: 1px solid #ecedee;">
                        Kode Transaksi</td>
                    <td style="padding: 12px 15px; background-color: #f7fafc;">{{ $transaction->code }}</td>
                </tr>
                <tr style="border-bottom:1px solid #ecedee;">
                    <td
                        style="padding: 12px 15px; font-weight: bold; color: #222; background-color: #fff; border-right: 1px solid #ecedee;">
                        Kode Pengajuan</td>
                    <td style="padding: 12px 15px; background-color: #fff;">{{ $transaction->submission->code }}</td>
                </tr>
                <tr style="border-bottom:1px solid #ecedee;">
                    <td
                        style="padding: 12px 15px; font-weight: bold; color: #222; background-color: #f7fafc; border-right: 1px solid #ecedee;">
                        Total Pembayaran</td>
                    <td
                        style="padding: 12px 15px; background-color: #f7fafc; font-weight: bold; color: #222; font-size: 16px;">
                        Rp {{ number_format($transaction->amount, 0, ',', '.') }}</td>
                </tr>
                <tr style="border-bottom:1px solid #ecedee;">
                    <td
                        style="padding: 12px 15px; font-weight: bold; color: #222; background-color: #fff; border-right: 1px solid #ecedee;">
                        Batas Waktu Pembayaran</td>
                    <td style="padding: 12px 15px; background-color: #fff; color: #dc2626; font-weight: 600;">
                        {{ \Carbon\Carbon::parse($transaction->payment_deadline)->format('d M Y H:i') }} WIB
                    </td>
                </tr>
                @if($transaction->payment_invoice_file)
                    <tr style="border-bottom:1px solid #ecedee;">
                        <td
                            style="padding: 12px 15px; font-weight: bold; color: #222; background-color: #f7fafc; border-right: 1px solid #ecedee;">
                            Invoice Pembayaran</td>
                        <td style="padding: 12px 15px; background-color: #f7fafc;">
                            <a href="{{ asset('storage/' . $transaction->payment_invoice_file) }}"
                                style="color: #007bff; text-decoration: none; font-weight: 600; padding: 4px 8px; background-color: #e3e8ef; border-radius: 4px; display: inline-block;"
                                target="_blank">
                                📄 Download Invoice
                            </a>
                        </td>
                    </tr>
                @endif
            </table>
        </td>
    </tr>

    @if($transaction->note)
        <tr>
            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                <div
                    style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                    <p>Catatan :</p>
                    <p>{{ $transaction->note }}</p>
                </div>
            </td>
        </tr>
    @endif

    {{-- Rincian Item Pengajuan --}}
    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p><strong>Rincian Pengujian:</strong></p>
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
                @foreach ($transaction->submission->tests as $item)
                    <tr>
                        <td style="padding: 5px 15px 5px 0;">{{$item->name}}</td>
                        <td style="padding: 0 15px;">Satuan</td>
                        <td style="padding: 0 15px;">{{$item->pivot->quantity}}</td>
                        <td style="padding: 0 0 0 15px;" align="right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    </tr>
                @endforeach

                @foreach ($transaction->submission->packages as $item)
                    <tr>
                        <td style="padding: 0 15px 5px 0;">{{$item->name}}</td>
                        <td style="padding: 0 15px;">Paket</td>
                        <td style="padding: 0 15px;">1</td>
                        <td style="padding: 0 0 0 15px;" align="right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                    </tr>
                @endforeach

                {{-- <tr style="border-bottom:2px solid #ecedee;text-align:left;padding:15px 0;">
                    <td style="padding: 5px 15px 5px 0; font-weight:bold">TOTAL</td>
                    <td style="padding: 0 15px;"></td>
                    <td style="padding: 0 15px;"></td>
                    <td style="padding: 0 0 0 15px; font-weight:bold" align="right">Rp
                        {{ number_format($transaction->amount, 0, ',', '.') }}
                    </td>
                </tr> --}}
            </table>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Silakan klik tombol di bawah untuk melakukan pembayaran:</p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0" style="border-collapse:separate;line-height:100%;">
                <tr>
                    <td align="center" bgcolor="#007bff" role="presentation"
                        style="border:none;border-radius:6px;cursor:auto;mso-padding-alt:12px 24px;background:#007bff;"
                        valign="middle">
                        <a href="{{ route('history-submission-detail', $transaction->submission->code) }}"
                            style="display:inline-block;background:#007bff;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 24px;mso-padding-alt:0px;border-radius:6px;">
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
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:16px;text-align:left;color:#a2a2a2;">
                <p>Jika Anda mengalami kendala atau memiliki pertanyaan, silakan hubungi tim kami melalui halaman bantuan
                    di aplikasi.</p>
            </div>
        </td>
    </tr>

@endsection