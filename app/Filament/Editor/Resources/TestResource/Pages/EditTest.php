<?php

namespace App\Filament\Editor\Resources\TestResource\Pages;

use App\Filament\Editor\Resources\TestResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTest extends EditRecord
{
    protected static string $resource = TestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
