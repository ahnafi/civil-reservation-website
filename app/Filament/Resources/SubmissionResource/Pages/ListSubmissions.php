<?php

namespace App\Filament\Resources\SubmissionResource\Pages;

use App\Filament\Resources\SubmissionResource;
use Filament\Actions;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;
use Filament\Resources\Pages\ListRecords;

class ListSubmissions extends ListRecords
{
    protected static string $resource = SubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'Semua' => Tab::make()
                ->modifyQueryUsing(fn(Builder $query) => $query->latest()),
            'Diajukan' => Tab::make()
                ->modifyQueryUsing(fn(Builder $query) => $query->where('status', "submitted")->latest()),
            'Diterima' => Tab::make()
                ->modifyQueryUsing(fn(Builder $query) => $query->where('status', "approved")->latest()),
            'Ditolak' => Tab::make()
                ->modifyQueryUsing(fn(Builder $query) => $query->where('status', "rejected")->latest()),
        ];
    }
}
