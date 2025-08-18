<?php

namespace App\Filament\Editor\Resources\StandardResource\Pages;

use App\Filament\Editor\Resources\StandardResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListStandards extends ListRecords
{
    protected static string $resource = StandardResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
