<?php

namespace App\Filament\Resources\SubmissionInternalDetailResource\Pages;

use App\Filament\Resources\SubmissionInternalDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSubmissionInternalDetail extends EditRecord
{
    protected static string $resource = SubmissionInternalDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }
}
