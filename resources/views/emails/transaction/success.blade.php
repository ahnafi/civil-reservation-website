@extends('emails.layouts.main')

@section('title', 'Pembayaran Berhasil Diverifikasi')

@section("content")
    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Halo Bapak/Ibu {{ $transaction->submission->user->name }},</p>
                <p>
                    Kami dengan senang hati menginformasikan bahwa pembayaran untuk pengujian Anda dengan nomor
                    <span
                        style="padding: 2px 4px; background-color:#d1fae5; border-radius: 4px; font-weight: bold; display: inline-block; color: #047857;">
                        {{ $transaction->code }}
                    </span>
                    dengan nomor pengujian
                    <span
                        style="padding: 2px 4px; background-color:#d1fae5; border-radius: 4px; font-weight: bold; display: inline-block; color: #047857;">
                        {{ $transaction->submission->code }}
                    </span>
                    telah berhasil diverifikasi dan disetujui oleh admin.
                </p>
                <p>
                    Saat ini, permohonan Anda telah masuk ke tahap persiapan pengujian.<br>
                    Kami akan segera mengirimkan notifikasi berikutnya setelah jadwal atau informasi teknis pengujian
                    tersedia.
                </p>
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
                        <a href="{{ route('history-transactions-detail', $transaction->code) }}"
                            style="display:inline-block;background:#007bff;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 24px;mso-padding-alt:0px;border-radius:6px;">
                            Lihat detail transaksi
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

@endsection