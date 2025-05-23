<?php

namespace App\Filament\Editor\Resources\NewsCategoryResource\Pages;

use App\Filament\Editor\Resources\NewsCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditNewsCategory extends EditRecord
{
    protected static string $resource = NewsCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }
}
