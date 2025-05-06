<?php

namespace App\Filament\Resources;

use App\Filament\Exports\TestingExporter;
use App\Filament\Resources\TestingResource\Pages;
use App\Filament\Resources\TestingResource\RelationManagers;
use App\Models\Testing;
use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class TestingResource extends Resource
{
    protected static ?string $model = Testing::class;
    protected static ?string $navigationIcon = 'heroicon-s-clipboard-document-list';
    protected static ?string $modelLabel = 'Pengujian';
    protected static ?string $navigationGroup = 'Manajemen Peminjaman';
    protected static ?int $navigationSort = 3;
    protected static ?string $navigationBadgeTooltip = 'Banyak pengujian sedang diuji';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where("status", "testing")->count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Forms\Components\Select::make('submission_id')
                    ->label('Kode Pengajuan')
                    ->relationship('submission', 'code')
                    ->searchable()
                    ->required(),

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

                Forms\Components\DateTimePicker::make('test_date')
                    ->label('Tanggal Pengujian')
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
                    ])
                    ->openable()
                    ->helperText('Format file yang diterima: PDF, DOC, DOCX.')
                    ->columnSpanFull()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->headerActions([
                    Tables\Actions\ExportAction::make()
                        ->exporter(TestingExporter::class)
                ]
            )
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode pengujian')
                    ->searchable(),
                Tables\Columns\TextColumn::make('submission.code')
                    ->searchable()
                    ->label("Kode pengajuan"),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        "testing" => "warning",
                        "completed" => "success",
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        "testing" => "Sedang diuji",
                        "completed" => "Selesai",
                        default => ucfirst($state),
                    }),
                Tables\Columns\TextColumn::make('test_date')
                    ->label("Tanggal pengujian")
                    ->sortable(),
                Tables\Columns\TextColumn::make('completed_at')
                    ->label("Tnggal selesai")
                    ->date()
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

                Tables\Actions\Action::make("Selesaikan")
                    ->form([

                        Forms\Components\FileUpload::make('documents')
                            ->label('Lampiran')
                            ->multiple()
                            ->directory('testing_documents')
                            ->acceptedFileTypes([
                                'application/pdf',
                                'application/msword',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            ])
                            ->required()
                            ->openable()
                            ->helperText('Format file yang diterima: PDF, DOC, DOCX.')
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('note')
                            ->columnSpanFull()
                            ->label('Catatan')
                            ->nullable(),

                    ])
                    ->action(function (array $data, Model $record) {

                        $user = $record->submission->user;
                        if ($user && $user->email) {

                            $record->status = "completed";
                            $record->completed_at = Carbon::now()->format('Y-m-d\TH:i:s');
                            $record->documents = $data['documents'];
                            $record->note = $data['note'] ?? null;
                            $record->save();

                            Mail::raw("Pengujian selesai.", function ($message) use ($user) {
                                $message->to($user->email)
                                    ->subject('Pengujian selesai');
                            });

                            Notification::make()
                                ->title('Pengujian selesai')
                                ->body("Pengajuan oleh {$user->name} dengan kode pengajuan {$record->submission->code} telah selesai.")
                                ->success()
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Gagal mengubah pengujian ')
                                ->body("Pengujian dengan kode {$record->code} gagal diubah.")
                                ->danger()
                                ->send();
                        }
                    })
                    ->requiresConfirmation()
                    ->color("success")
                    ->icon("heroicon-o-check-circle")
                    ->visible(fn($record) => $record->status === 'testing'),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make(),
                    Tables\Actions\DeleteAction::make(),
                ])
            ]);
//            ->bulkActions([
//                Tables\Actions\BulkActionGroup::make([
//                    Tables\Actions\DeleteBulkAction::make(),
//                    Tables\Actions\ForceDeleteBulkAction::make(),
//                    Tables\Actions\RestoreBulkAction::make(),
//                ]),
//            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTestings::route('/'),
            'create' => Pages\CreateTesting::route('/create'),
            'edit' => Pages\EditTesting::route('/{record}/edit'),
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
