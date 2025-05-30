<?php

namespace App\Filament\Editor\Resources\AuthorResource\Pages;

use App\Filament\Editor\Resources\AuthorResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateAuthor extends CreateRecord
{
    protected static string $resource = AuthorResource::class;
}
