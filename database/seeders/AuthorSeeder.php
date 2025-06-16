<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $authors = [
            [
            'name' => 'Ahmad',
            'email' => 'ahmad@example.com',
            'bio' => 'Ahmad adalah seorang jurnalis berpengalaman dengan lebih dari 10 tahun pengalaman di bidangnya.',
            'avatar' => 'author_avatars/ahmad.jpg',
            ],
            [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'bio' => 'Budi adalah seorang penulis yang bersemangat dan suka meliput berita lokal dan acara-acara.',
            'avatar' => 'author_avatars/budi.jpg',
            ],
            [
            'name' => 'Diana',
            'email' => 'diana@example.com',
            'bio' => 'Diana adalah seorang jurnalis investigatif yang dikenal karena peliputan mendalam tentang isu-isu sosial.',
            'avatar' => 'author_avatars/diana.jpg',
            ],
            [
            'name' => 'Rudi',
            'email' => 'rudi@example.com',
            'bio' => 'Rudi adalah seorang penulis muda yang fokus pada teknologi dan inovasi.',
            'avatar' => 'author_avatars/rudi.jpg',
            ],
            [
            'name' => 'Siti',
            'email' => 'siti@example.com',
            'bio' => 'Siti adalah seorang wartawan yang berspesialisasi dalam berita ekonomi dan bisnis.',
            'avatar' => 'author_avatars/siti.jpg',
            ],
        ];

        foreach ($authors as $author) {
            Author::create($author);
        }
    }
}
