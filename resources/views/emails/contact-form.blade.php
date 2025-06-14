{{-- filepath: c:\laragon\www\civil-reservation-website\resources\views\emails\contact-form.blade.php --}}
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pesan Kontak</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
        }

        .info-row {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f1f3f4;
        }

        .label {
            font-weight: bold;
            color: #495057;
        }

        .message-content {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            white-space: pre-wrap;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>Pesan Kontak Baru</h2>
        <p>Anda menerima pesan baru dari website Civil Reservation Lab</p>
    </div>

    <div class="content">
        <div class="info-row">
            <span class="label">Nama Lengkap:</span><br>
            {{ $name }}
        </div>

        <div class="info-row">
            <span class="label">Email:</span><br>
            {{ $email }}
        </div>

        <div class="info-row">
            <span class="label">Subjek:</span><br>
            {{ $subject }}
        </div>

        <div class="info-row">
            <span class="label">Pesan:</span>
            <div class="message-content">{{ $content }}</div>
        </div>
    </div>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9ecef;">

    <p style="color: #6c757d; font-size: 14px; text-align: center;">
        Email ini dikirim otomatis dari sistem Civil Reservation Lab<br>
        Untuk membalas, silakan gunakan email: {{ $email }}
    </p>
</body>

</html>
