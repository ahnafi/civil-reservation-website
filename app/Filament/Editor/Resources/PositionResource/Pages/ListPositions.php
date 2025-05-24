<?php

namespace App\Filament\Editor\Resources\PositionResource\Pages;

use App\Filament\Editor\Resources\PositionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPositions extends ListRecords
{
    protected static string $resource = PositionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
