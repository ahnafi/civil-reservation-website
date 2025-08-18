<?php

namespace App\Filament\Editor\Resources\StandardResource\Pages;

use App\Filament\Editor\Resources\StandardResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditStandard extends EditRecord
{
    protected static string $resource = StandardResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
