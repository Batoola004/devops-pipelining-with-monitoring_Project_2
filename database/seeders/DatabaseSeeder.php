<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@fiberroad.com',
            'password' => bcrypt('password'),
        ]);

        $this->command->info('👤 Admin user created (admin@fiberroad.com / password)');

        $this->command->info('🎉 Database seeding complete!');
    }
}
