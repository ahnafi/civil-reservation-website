<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TransactionResource\Pages;
use App\Filament\Resources\TransactionResource\RelationManagers;
use App\Models\Transaction;
use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;

class TransactionResource extends Resource
{
    protected static ?string $model = Transaction::class;
    protected static ?string $navigationIcon = 'heroicon-s-banknotes';
    protected static ?string $modelLabel = 'Transaksi';
    protected static ?string $navigationGroup = 'Manajemen Peminjaman';
    protected static ?string $navigationBadgeTooltip = 'Banyak transaksi yang diajukan';
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where("status", "pending")->count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Select::make('submission')
                    ->relationship("submission", "code")
                    ->searchable()
                    ->label('Kode Pengajuan'),

                Forms\Components\TextInput::make('code')
                    ->label('Kode Unik Transaksi')
                    ->required()
                    ->unique(ignoreRecord: true)
//                    ->default(function () {
//                        $submission = $this->getOwnerRecord();
//                        $submissionId = $submission?->id ?? '000';
//                        $userId = $submission?->user_id ?? '000';
//                        $transactionCount = $submission ? $submission->transactions()->withTrashed()->count() + 1 : 1;
//
//                        return 'CVL-' . now()->format('Ymd') . $submissionId . $userId . $transactionCount;
//                    })
                    ->disabled(),

                Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->required()
                    ->label('Total Pembayaran')
//                    ->default(fn() => $this->getOwnerRecord()->total_cost ?? 0)
                    ->prefix("Rp"),

                ToggleButtons::make('payment_method')
                    ->hiddenOn("create")
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
                    ->default("pending")
                    ->hiddenOn("create")
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
                    ->hiddenOn("create")
                    ->label('Bukti Pembayaran')
                    ->image()
                    ->directory('payment_receipts'),

                Forms\Components\DateTimePicker::make('payment_date')
                    ->hiddenOn("create")
                    ->label('Tanggal Pembayaran')
                    ->nullable(),
                Forms\Components\Textarea::make('note')
                    ->label('Catatan')
                    ->nullable()
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode Transaksi')
                    ->searchable(),
                Tables\Columns\TextColumn::make('submission.code')
                    ->label('Kode Pengajuan')
                    ->numeric(),
                Tables\Columns\TextColumn::make('amount')
                    ->label('Total Pembayaran')
                    ->numeric()
                    ->prefix("Rp "),
                Tables\Columns\TextColumn::make('status')
                    ->label("Status")
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        "pending" => "info",
                        "success" => "success",
                        "failed" => "danger",
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'pending' => 'Diajukan',
                        'success' => 'Diterima',
                        'failed' => 'Ditolak',
                        default => ucfirst($state),
                    }),
                Tables\Columns\TextColumn::make('payment_deadline')
                    ->label('Batas Waktu Pembayaran')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_date')
                    ->label('Tanggal Pembayaran')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
//            ->bulkActions([
//                Tables\Actions\BulkActionGroup::make([
//                    Tables\Actions\DeleteBulkAction::make(),
//                    Tables\Actions\ForceDeleteBulkAction::make(),
//                    Tables\Actions\RestoreBulkAction::make(),
//                ]),
//            ]);
    }

//    public static function getRelations(): array
//    {
//        return [
//            //
//        ];
//    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTransactions::route('/'),
            'create' => Pages\CreateTransaction::route('/create'),
            'edit' => Pages\EditTransaction::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
