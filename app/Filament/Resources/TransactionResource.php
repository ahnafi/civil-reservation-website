<?php

namespace App\Filament\Resources;

use App\Filament\Exports\TransactionExporter;
use App\Filament\Resources\TransactionResource\Pages;
use App\Filament\Resources\TransactionResource\RelationManagers;
use App\Models\Submission;
use App\Models\Transaction;
use App\Services\FileNaming;
use App\Services\TransactionService;
use Filament\Actions\ExportAction;
use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class TransactionResource extends Resource
{
    protected static ?string $model = Transaction::class;
    protected static ?string $navigationIcon = 'heroicon-s-banknotes';
    protected static ?string $modelLabel = 'Transaksi';
    protected static ?string $navigationGroup = 'Manajemen Pengujian';
    protected static ?string $navigationBadgeTooltip = 'Banyak transaksi yang diajukan';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where("status", "pending")->count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Select::make('submission_id')
                    ->relationship("submission", "code")
                    ->relationship("submission", "code", fn($query) => $query->orderBy('created_at', 'desc'))
                    ->searchable()
                    ->columnSpanFull()
                    ->live()
                    ->required()
                    ->preload()
                    ->afterStateUpdated(function ($state, Set $set) {
                        $submission = Submission::find($state);
                        if ($submission) {
                            $set("submission_id", $submission->id);
                            $set("amount", $submission->total_cost);

                            $submissionId = $submission?->id ?? '000';
                            $userId = $submission?->user_id ?? '000';
                            $transactionCount = $submission ? $submission->transactions()->withTrashed()->count() + 1 : 1;

                            $set("code", 'CVL-' . now()->format('Ymd') . $submissionId . $userId . $transactionCount);
                        }
                    })
                    ->label('Kode Pengajuan'),

                Forms\Components\TextInput::make('code')
                    ->label('Kode Unik Transaksi')
                    ->columnSpanFull()
                    ->hiddenOn("create")
                    ->unique(ignoreRecord: true)
                    ->disabled(),

                Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->required()
                    ->columnSpanFull()
                    ->label('Total Pembayaran')
                    ->default(0)
                    ->prefix("Rp"),

                ToggleButtons::make('payment_method')
                    ->hiddenOn("create")
                    ->label("Metode Pembayaran")
                    ->inline()
                    ->columnSpanFull()
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
                    ->columnSpanFull()
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

                Forms\Components\FileUpload::make('payment_invoice_files')
                    ->label('Invoice Pembayaran')
                    ->columnSpanFull()
                    ->acceptedFileTypes([
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ])
                    ->visibility('public')
                    ->directory('payment_invoice_files')
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $get): string {
                        $extension = $file->getClientOriginalExtension();

                        $id = $get('id') ?? -1;

                        return FileNaming::generateInvoiceName($id, $extension);
                    }),


                Forms\Components\FileUpload::make('payment_receipt_images')
                    ->hiddenOn("create")
                    ->columnSpanFull()
                    ->label('Bukti Pembayaran')
                    ->image()
                    ->imageEditor()
                    ->previewable(true)
                    ->imagePreviewHeight('150')
                    ->visibility('public')
                    ->directory('payment_receipt_images')
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $get): string {
                        $extension = $file->getClientOriginalExtension();

                        $id = $get('id') ?? -1;

                        return FileNaming::generatePaymentReceiptName($id, $extension);
                    }),

                Forms\Components\DateTimePicker::make('payment_date')
                    ->hiddenOn("create")
                    ->label('Tanggal Pembayaran')
                    ->columnSpanFull()
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
            ->headerActions(
                [
                    Tables\Actions\ExportAction::make()
                        ->color("success")
                        ->exporter(TransactionExporter::class)
                ]
            )
            ->modifyQueryUsing(fn(Builder $query) => $query->latest())
            ->recordUrl(null)
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

                Tables\Columns\TextColumn::make('payment_deadline')
                    ->label('Batas Pembayaran')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('payment_date')
                    ->label('Tanggal Pembayaran')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
                Tables\Filters\SelectFilter::make("status")
                    ->label("Filter berdasarkan status")
                    ->options([
                        "pending" => "Diajukan",
                        "success" => "Dibayar",
                        "failed" => "Gagal"
                    ]),
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')
                            ->label('Tanggal Dibuat Dari'),
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Tanggal Dibuat Sampai'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\Action::make("Setujui")
                    ->icon("heroicon-o-check-circle")
                    ->requiresConfirmation()
                    ->color("success")
                    ->visible(fn($record) => $record->status === 'pending')
                    ->action(function (Model $record) {
                        $transactionService = app(TransactionService::class);
                        $transactionService->accept($record);
                    }),

                Tables\Actions\Action::make("Tolak")
                    ->icon("heroicon-o-x-circle")
                    ->requiresConfirmation()
                    ->form([
                        Forms\Components\Textarea::make('note')
                            ->required()
                            ->label("Perihal"),
                    ])
                    ->color("danger")
                    ->visible(fn($record) => $record->status === 'pending')
                    ->action(function (array $data, Model $record) {
                        $transactionService = app(TransactionService::class);
                        $transactionService->reject($data, $record);
                    }),

                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make(),
                    Tables\Actions\DeleteAction::make(),
                ]),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make()
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
