<?php

namespace App\Filament\Resources\TestingResource\Pages;

use App\Filament\Resources\TestingResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateTesting extends CreateRecord
{
    protected static string $resource = TestingResource::class;
}
