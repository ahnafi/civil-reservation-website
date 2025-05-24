<?php

namespace App\Filament\Editor\Resources\NewsCategoryResource\Pages;

use App\Filament\Editor\Resources\NewsCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateNewsCategory extends CreateRecord
{
    protected static string $resource = NewsCategoryResource::class;
}
