<?php

namespace App\Filament\Resources\SubmissionExternalDetailResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Services\TestingService;

class TestingsRelationManager extends RelationManager
{
    protected static string $relationship = 'testings';
    protected static ?string $modelLabel = 'Pengujian';
    protected static ?string $title = "Pengujian";

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                ToggleButtons::make('status')
                    ->visibleOn(["edit", "view"])
                    ->label('Status Pengujian')
                    ->inline()
                    ->required()
                    ->options([
                        "testing" => "Sedang Berjalan",
                        "completed" => "Selesai",
                    ])
                    ->colors([
                        "testing" => "warning",
                        "completed" => "success",
                    ])
                    ->icons([
                        "testing" => "heroicon-o-clock",
                        "completed" => "heroicon-o-check-circle",
                    ])
                    ->default("testing")
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function ($state, Set $set) {
                        if ($state === "completed") {
                            $set('completed_at', Carbon::now()->format('Y-m-d\TH:i:s'));
                        } else {
                            $set('completed_at', null);
                            $set("test_date", Carbon::now()->format('Y-m-d\TH:i:s'));
                        }
                    }),

                Forms\Components\DatePicker::make('test_date')
                    ->label('Tanggal Pengujian')
                    ->minDate(now())
                    ->rule(function () {
                        return function (string $attribute, $value, \Closure $fail) {
                            if ($value) {
                                $date = Carbon::parse($value);
                                // 6 = Sabtu, 0 = Minggu
                                if ($date->dayOfWeek === 6 || $date->dayOfWeek === 0) {
                                    $fail('Tanggal pengujian tidak dapat dilakukan pada hari Sabtu atau Minggu.');
                                }
                            }
                        };
                    })
                    ->helperText('Catatan: Pengujian tidak dapat dijadwalkan pada hari Sabtu dan Minggu.')
                    ->default(fn() => $this->getOwnerRecord()->submission->test_submission_date ?? now())
                    ->nullable(),

                Forms\Components\DateTimePicker::make('completed_at')
                    ->visibleOn(["edit", "view"])
                    ->label('Tanggal Selesai')
                    ->nullable(),

                Forms\Components\Textarea::make('note')
                    ->columnSpanFull()
                    ->visibleOn(["edit", "view"])
                    ->label('Catatan')
                    ->nullable(),

                Forms\Components\FileUpload::make('documents')
                    ->visibleOn(["edit", "view"])
                    ->label('Lampiran')
                    ->multiple()
                    ->directory('testing_documents')
                    ->acceptedFileTypes([
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/zip',
                        'application/x-zip-compressed',
                        'application/x-rar-compressed',
                        'application/x-7z-compressed',
                    ])
                    ->openable()
                    ->helperText('Format file yang diterima: PDF, DOC, DOCX, ZIP, RAR, 7Z.')
                    ->columnSpanFull()
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')->label('Kode'),
                Tables\Columns\TextColumn::make('status')->label('Status')->sortable(),
                Tables\Columns\TextColumn::make('test_date')->label('Tanggal Pengujian')->dateTime(),
                Tables\Columns\TextColumn::make('completed_at')->label('Selesai')->dateTime(),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\Filter::make('test_date')
                    ->form([
                        Forms\Components\DatePicker::make('test_date_from')
                            ->label('Tanggal Pengujian Dari'),
                        Forms\Components\DatePicker::make('test_date_until')
                            ->label('Tanggal Pengujian Sampai'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['test_date_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('test_date', '>=', $date),
                            )
                            ->when(
                                $data['test_date_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('test_date', '<=', $date),
                            );
                    }),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->mutateFormDataUsing(function (array $data) {
                        // Set submission_id - the Testing model will auto-generate the code
                        $externalDetail = $this->getOwnerRecord();
                        $submission = $externalDetail->submission;
                        $data['submission_id'] = $submission?->id;
                        
                        // Remove any manually set code as the model will generate it
                        unset($data['code']);

                        return $data;
                    })
                    ->successNotificationTitle('Pengujian berhasil dibuat'),
            ])
            ->actions([
                Tables\Actions\Action::make("Selesaikan")
                    ->form([
                        Forms\Components\FileUpload::make('documents')
                            ->label('Lampiran')
                            ->maxSize(51200)
                            ->multiple()
                            ->directory('testing_documents')
                            ->acceptedFileTypes([
                                'application/pdf',
                                'application/msword',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                'application/zip',
                                'application/x-zip-compressed',
                                'application/x-rar-compressed',
                                'application/x-7z-compressed',
                            ])
                            ->openable()
                            ->helperText('Format file yang diterima: PDF, DOC, DOCX, ZIP, RAR, 7Z.')
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('note')
                            ->columnSpanFull()
                            ->label('Catatan')
                            ->nullable(),
                    ])
                    ->action(function (array $data, Model $record) {
                        $testingService = app(TestingService::class);
                        $testingService->solved($data, $record);
                    })
                    ->requiresConfirmation()
                    ->color("success")
                    ->visible(fn($record) => $record->status === 'testing')
                    ->icon("heroicon-o-check-circle"),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make(),
                    Tables\Actions\DeleteAction::make(),
                ])
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

    //     // Use the testings relationship directly from the external detail
    //     return $externalDetail->testings()->getQuery();
    // }
}
