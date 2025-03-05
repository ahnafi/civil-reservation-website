<?php

namespace App\Filament\Resources\TestTypeResource\Pages;

use App\Filament\Resources\TestTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTestTypes extends ListRecords
{
    protected static string $resource = TestTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
