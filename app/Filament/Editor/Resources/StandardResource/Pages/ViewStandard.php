<?php

namespace App\Filament\Editor\Resources\StandardResource\Pages;

use App\Filament\Editor\Resources\StandardResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewStandard extends ViewRecord
{
    protected static string $resource = StandardResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
