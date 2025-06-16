@extends('emails.layouts.main')

@section('title', 'Pengajuan Peminjaman Disetujui')

@section("content")

    <tr>
        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            <div
                style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                <p>Halo Bapak/Ibu {{$submission->user->name}}</p>
                <p>Kami dengan senang hati memberitahukan bahwa pengajuan Anda dengan nomor
                    <span
                        style="padding: 2px 4px; background-color:#edf2f7; border-radius: 4px; font-weight: bold; display: inline-block;">{{ $submission->code }}</span>
                    telah disetujui.
                </p>
                <p>Berikut detail pengujianya :</p>
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
                        <a href="{{ route('history-submission-detail', $submission->code) }}"
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