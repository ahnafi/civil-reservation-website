<?php

namespace App\Filament\Resources\SubmissionResource\RelationManagers;

use App\Models\Submission;
use App\Models\Transaction;
use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;

class TransactionsRelationManager extends RelationManager
{
    protected static string $relationship = 'transactions';
    protected static ?string $modelLabel = 'Transaksi';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->required()
                    ->label('Total Pembayaran')
                    ->prefix("Rp"),

                Forms\Components\TextInput::make('payment_method')
                    ->label("Metode Pembayaran")
                    ->required(),

                ToggleButtons::make('status')
                    ->inline()
                    ->required()
                    ->options([
                        "pending" => "Pending",
                        "success" => "Berhasil",
                        "failed" => "Gagal"
                    ])
                    ->colors([
                        "pending" => "info",
                        "success" => "success",
                        "failed" => "danger"
                    ])
                    ->icons([
                        'pending' => 'heroicon-o-clock',
                        'success' => 'heroicon-o-check-circle',
                        'failed' => 'heroicon-o-x-circle',
                    ])
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function ($state, Set $set) {
                        if ($state === "success") {
                            $set('payment_date', Carbon::now()->format('Y-m-d\TH:i:s'));
                        } else {
                            $set('payment_date', null);
                        }
                    }),

                Forms\Components\FileUpload::make('image')
                    ->label('Bukti Pembayaran')
                    ->image()
                    ->directory('payment_receipts'),

                Forms\Components\DateTimePicker::make('payment_date')
                    ->label('Tanggal Pembayaran')
                    ->nullable(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('amount')->label('Total')->sortable(),
                Tables\Columns\TextColumn::make('payment_method')->label('Metode Pembayaran')->sortable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->sortable()->badge(),
                Tables\Columns\TextColumn::make('payment_date')->label('Tanggal Pembayaran')->dateTime(),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        "pending" => "Pending",
                        "success" => "Berhasil",
                        "failed" => "Gagal"
                    ]),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ])
            ->modifyQueryUsing(fn(Builder $query) => $query->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]));
    }
}
