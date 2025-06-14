<?php

namespace Database\Seeders;

use App\Models\NewsCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NewsCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $newsCategories = [
            ['name' => 'Berita Lokal'],
            ['name' => 'Berita Nasional'],
            ['name' => 'Berita Internasional'],
            ['name' => 'Olahraga'],
            ['name' => 'Hiburan'],
            ['name' => 'Teknologi'],
            ['name' => 'Kesehatan'],
            ['name' => 'Bisnis'],
        ];

        foreach ($newsCategories as $category) {
            NewsCategory::create($category);
        }
    }
}
