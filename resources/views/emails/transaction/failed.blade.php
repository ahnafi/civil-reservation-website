@extends('emails.layouts.main')

@section('title', 'Pembayaran Tidak Dapat Diterima')

@section("content")
    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Halo Bapak/Ibu {{$transaction->submission->user->name}},</p>
                <p>Kami ingin menginformasikan bahwa pembayaran dengan nomor
                    <span
                        style="padding: 2px 4px; background-color:#fee2e2; border-radius: 4px; font-weight: bold; display: inline-block; color: #dc2626;">{{ $transaction->code }}</span>
                    untuk pengujian Anda dengan nomor
                    <span
                        style="padding: 2px 4px; background-color:#edf2f7; border-radius: 4px; font-weight: bold; display: inline-block;">{{ $transaction->submission->code }}</span>
                    tidak dapat kami terima.
                </p>

                @if($transaction->note)
                    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 15px 0;">
                        <p style="margin: 0; font-weight: 600; color: #dc2626;">Alasan penolakan:</p>
                        <p style="margin: 8px 0 0 0; color: #7f1d1d;">{{ $transaction->note ?? "Tidak ada alasan penolakan" }}
                        </p>
                    </div>
                @endif
            </div>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Untuk itu, kami mohon Anda:</p>
                <ol style="margin: 8px 0; padding-left: 20px; color: #374151;">
                    <li>Memastikan kembali bahwa pembayaran telah dilakukan sesuai dengan jumlah total tagihan dan ke
                        rekening yang benar, serta</li>
                    <li>Mengunggah ulang bukti pembayaran yang valid dan jelas melalui halaman aplikasi.</li>
                </ol>
            </div>
        </td>
    </tr>

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p style="font-weight: 600;">🔁 Ajukan Ulang Pembayaran:</p>
            </div>
        </td>
    </tr>

    <tr>
        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word">
            <table border="0" style="border-collapse:separate;line-height:100%;">
                <tr>
                    <td align="center" bgcolor="#dc2626" role="presentation"
                        style="border:none;border-radius:6px;cursor:auto;mso-padding-alt:12px 24px;background:#dc2626;"
                        valign="middle">
                        <a href="{{ route('history-transactions') }}"
                            style="display:inline-block;background:#dc2626;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 24px;mso-padding-alt:0px;border-radius:6px;">
                            Unggah Ulang Bukti Pembayaran
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

@endsection