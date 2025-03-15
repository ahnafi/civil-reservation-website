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
use Illuminate\Support\Str;

class TransactionsRelationManager extends RelationManager
{
    protected static string $relationship = 'transactions';
    protected static ?string $modelLabel = 'Transaksi';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('code')
                    ->label('Kode Unik Transaksi')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->default(function () {
                        $submission = $this->getOwnerRecord();
                        $submissionId = $submission?->id ?? '000';
                        $userId = $submission?->user_id ?? '000';
                        $transactionCount = $submission ? $submission->transactions()->count() + 1 : 1;

                        return 'CVL-' . now()->format('Ymd') . $submissionId . $userId . $transactionCount;
                    })
                    ->disabled(),

                Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->required()
                    ->label('Total Pembayaran')
                    ->default(fn() => $this->getOwnerRecord()->total_cost ?? 0)
                    ->prefix("Rp"),

                ToggleButtons::make('payment_method')
                    ->label("Metode Pembayaran")
                    ->inline()
                    ->options([
                        "BANK JATENG" => "BANK JATENG",
                        "BANK MANDIRI" => "BANK MANDIRI",
                        "BANK BNI" => "BANK BNI",
                        "BANK BRI" => "BANK BRI",
                        "BANK BSI" => "BANK BSI",
                        "BANK BTN" => "BANK BTN"
                    ])
                    ->colors([
                        'BANK JATENG' => 'success',
                        'BANK MANDIRI' => 'success',
                        'BANK BNI' => 'success',
                        'BANK BRI' => 'success',
                        'BANK BSI' => 'success',
                        'BANK BTN' => 'success',
                    ]),

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

                Forms\Components\FileUpload::make('payment_invoice_file')
                    ->label('Invoice Pembayaran')
                    ->acceptedFileTypes([
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ])
                    ->directory('payment_invoice'),

                Forms\Components\FileUpload::make('payment_receipt_image')
                    ->label('Bukti Pembayaran')
                    ->image()
                    ->directory('payment_receipts'),

                Forms\Components\DateTimePicker::make('payment_date')
                    ->label('Tanggal Pembayaran')
                    ->nullable(),
                Forms\Components\Textarea::make('note')
                    ->label('Catatan')
                    ->nullable()
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')->label('Kode')->sortable(),
                Tables\Columns\TextColumn::make('amount')->label('Total')->sortable(),
                Tables\Columns\TextColumn::make('payment_method')->label('Metode Pembayaran')->sortable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->sortable()->badge()
                    ->color(fn(string $state): string => match ($state) {
                        "pending" => "info",
                        "success" => "success",
                        "failed" => "danger"
                    }),
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
