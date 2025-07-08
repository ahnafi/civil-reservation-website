<?php

namespace App\Filament\Resources\SubmissionExternalDetailResource\RelationManagers;

use App\Services\FileNaming;
use App\Services\TransactionService;
use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class TransactionsRelationManager extends RelationManager
{
    protected static string $relationship = 'transactions';

    protected static ?string $title = "Transaksi";
    protected static ?string $modelLabel = 'Transaksi';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('code')
                    ->label('Kode Unik Transaksi')
                    ->hiddenOn('create')
                    ->disabled()
                    ->helperText('Kode akan dibuat otomatis oleh sistem'),

                Forms\Components\TextInput::make('amount')
                    ->numeric()
                    ->required()
                    ->label('Total Pembayaran')
                    ->default(fn() => $this->getOwnerRecord()->total_cost ?? 0)
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
                        'pending' => 'Diajukan',
                        'success' => 'Diterima',
                        'failed' => 'Ditolak',
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

                Forms\Components\DateTimePicker::make('payment_date')
                    ->hiddenOn("create")
                    ->label('Tanggal Pembayaran')
                    ->nullable(),

                Forms\Components\FileUpload::make('payment_invoice_files')
                    ->label('Invoice Pembayaran')
                    ->columnSpanFull()
                    ->acceptedFileTypes([
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ])
                    ->maxSize(2048)
                    ->helperText('Upload file invoice pembayaran. Format yang didukung: PDF, DOC, DOCX. Maksimal ukuran file 2MB.')
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
                    ->maxSize(2048)
                    ->helperText('Upload bukti pembayaran berupa gambar. Format yang didukung: JPG, PNG, GIF. Maksimal ukuran file 2MB.')
                    ->visibility('public')
                    ->directory('payment_receipt_images')
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $get): string {
                        $extension = $file->getClientOriginalExtension();

                        $id = $get('id') ?? -1;

                        return FileNaming::generatePaymentReceiptName($id, $extension);
                    }),

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
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode Transaksi')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('amount')
                    ->label('Total Pembayaran')
                    ->numeric()
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'info' => 'pending',
                        'success' => 'success',
                        'danger' => 'failed',
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'pending' => 'Diajukan',
                        'success' => 'Diterima',
                        'failed' => 'Ditolak',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Metode Pembayaran'),
                Tables\Columns\TextColumn::make('payment_date')
                    ->label('Tanggal Pembayaran')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Diajukan',
                        'success' => 'Diterima',
                        'failed' => 'Ditolak',
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
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->mutateFormDataUsing(function (array $data) {
                        // Set submission_id - the Transaction model will auto-generate the code
                        $externalDetail = $this->getOwnerRecord();
                        $submission = $externalDetail->submission;
                        $data['submission_id'] = $submission?->id;

                        // Remove any manually set code as the model will generate it
                        unset($data['code']);

                        return $data;
                    })
                    ->using(function (array $data, string $model): Model {
                        return $model::create($data);
                    })
                    ->successNotificationTitle('Transaksi berhasil dibuat'),
            ])
            ->actions([
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
                    Tables\Actions\ViewAction::make(),
                    Tables\Actions\EditAction::make()
                        ->using(function (Model $record, array $data): Model {
                            $record->update($data);
                            return $record;
                        })
                        ->successNotificationTitle('Transaksi berhasil diperbarui'),
                    Tables\Actions\DeleteAction::make(),
                ]),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make()
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

    // protected function getTableQuery(): Builder
    // {
    //     $externalDetail = $this->getOwnerRecord();

    //     // Use the transactions relationship directly from the external detail
    //     return $externalDetail->transactions()->getQuery();
    // }
}
