<?php

namespace App\Filament\Editor\Resources\LaboratoryResource\Pages;

use App\Filament\Editor\Resources\LaboratoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditLaboratory extends EditRecord
{
    protected static string $resource = LaboratoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
