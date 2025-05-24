<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Auth;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->requiresConfirmation()
                ->visible(fn($record): bool => $record->role != "superadmin" && (Auth::user()->role == "superadmin" || Auth::user()->role == "admin"))
                ->hidden(fn($record): bool => $record->id == Auth::user()->id),
        ];
    }
}
