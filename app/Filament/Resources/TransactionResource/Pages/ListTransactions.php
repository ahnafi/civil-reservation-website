<?php

namespace App\Filament\Resources\TransactionResource\Pages;

use App\Filament\Resources\TransactionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Components\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListTransactions extends ListRecords
{
    protected static string $resource = TransactionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    // public function getTabs(): array
    // {
    //     return [
    //         "Semua" => Tab::make("Semua"),
    //         "pending" => Tab::make("Pending")->modifyQueryUsing(function (Builder $builder) {
    //             return $builder->where("status", "pending");
    //         }),
    //         "success" => Tab::make("Berhasil")->modifyQueryUsing(function (Builder $builder) {
    //             return $builder->where("status", "success"); }),
    //         "failed" => Tab::make("Gagal")->modifyQueryUsing(function (Builder $builder) {
    //             return $builder->where("status", "failed"); }),
    //     ];
    // }
}
