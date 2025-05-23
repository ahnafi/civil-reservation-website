<?php

namespace App\Filament\Editor\Resources\DownloadResource\Pages;

use App\Filament\Editor\Resources\DownloadResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListDownloads extends ListRecords
{
    protected static string $resource = DownloadResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
