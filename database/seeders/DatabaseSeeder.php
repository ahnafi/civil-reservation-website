<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            LaboratorySeeder::class,
            TestSeeder::class,
            PackagesSeeder::class,
            PackageTestSeeder::class,
            SubmissionSeeder::class,
            TransactionSeeder::class,
            TestingSeeder::class,
        ]);
    }
}
