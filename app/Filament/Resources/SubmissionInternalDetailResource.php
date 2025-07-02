<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubmissionInternalDetailResource\Pages;
use App\Filament\Resources\SubmissionInternalDetailResource\RelationManagers;
use App\Models\Package;
use App\Models\SubmissionInternalDetail;
use App\Models\Test;
use App\Services\FileNaming;
use Filament\Forms;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class SubmissionInternalDetailResource extends Resource
{
    protected static ?string $model = SubmissionInternalDetail::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';

    protected static ?string $navigationLabel = 'Submission Internal';

    protected static ?string $modelLabel = 'Submission Internal';

    protected static ?string $pluralModelLabel = 'Submission Internal';

    protected static ?string $navigationGroup = 'Submissions';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form
            ->schema([
                Section::make('Data Submission')
                    ->schema([
                        Select::make('user_id')
                            ->label("Pengguna")
                            ->options(\App\Models\User::where('role', 'internal')->pluck('name', 'id'))
                            ->searchable()
                            ->required()
                            ->preload(),

                        TextInput::make('submission_type')
                            ->default('internal')
                            ->hidden(),

                        ToggleButtons::make('status')
                            ->label('Status pengajuan')
                            ->required()
                            ->options([
                                "submitted" => "Diajukan",
                                "approved" => "Diterima",
                                "rejected" => "Ditolak"
                            ])
                            ->colors([
                                "submitted" => "info",
                                "approved" => "success",
                                "rejected" => "danger"
                            ])
                            ->default("submitted")
                            ->icons([
                                'submitted' => 'heroicon-o-pencil',
                                'rejected' => 'heroicon-o-x-circle',
                                'approved' => 'heroicon-o-check-circle',
                            ])
                            ->reactive()
                            ->afterStateUpdated(function ($state, Set $set) {
                                if ($state === "approved") {
                                    $set('approval_date', Carbon::now()->format('Y-m-d\TH:i:s'));
                                } else {
                                    $set('approval_date', null);
                                }
                            }),

                        Forms\Components\DateTimePicker::make('approval_date')
                            ->label('Tanggal diterima'),

                        Forms\Components\DateTimePicker::make('test_submission_date')
                            ->label('Tanggal pengujian')
                            ->required(),

                        Forms\Components\FileUpload::make('documents')
                            ->label('Lampiran')
                            ->multiple()
                            ->preserveFilenames()
                            ->acceptedFileTypes([
                                'application/pdf',
                                'application/msword',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            ])
                            ->maxSize(2048)
                            ->directory("submission")
                            ->helperText('Format file yang diterima: PDF, DOC, DOCX. Maksimal ukuran file: 2MB.')
                            ->openable()
                            ->columnSpanFull()
                            ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $get): string {
                                $extension = $file->getClientOriginalExtension();

                                $id = $get('id') ?? -1;

                                return FileNaming::generateSubmissionName($id, $extension);
                            }),

                        Forms\Components\Textarea::make('user_note')
                            ->label('Catatan pengguna')
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('admin_note')
                            ->label('Catatan Admin')
                            ->columnSpanFull(),
                    ]),

                Section::make('Detail Internal')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama peneliti')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('program_study')
                            ->label('Program studi')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('research_title')
                            ->label('Judul penelitian')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('personnel_count')
                            ->label('Jumlah personel')
                            ->numeric()
                            ->default(1),
                        Forms\Components\TextInput::make('supervisor')
                            ->label('Pembimbing/Supervisor')
                            ->maxLength(255)
                            ->default(null),
                    ]),

                Section::make('Paket & Pengujian')
                    ->description('Pilih paket pengujian dan/atau pengujian satuan yang dibutuhkan')
                    ->schema([
                        Repeater::make("submissionPackages")
                            ->label('Paket pengujian')
                            ->schema([
                                Select::make('package_id')
                                    ->label('Pilih paket pengujian')
                                    ->required()
                                    ->searchable()
                                    ->options(Package::all()->pluck('name', 'id'))
                                    ->reactive()
                                    ->live(),
                                // TextInput::make('package_name')
                                //     ->label('Nama paket')
                                //     ->dehydrated(false)
                                //     ->disabled()
                                //     ->reactive()
                                //     ->live()
                                //     ->formatStateUsing(fn($state, Get $get) => Package::find($get("package_id"))?->name ?? ''),
                            ])->columns(2)->columnSpanFull()
                            ->addActionLabel('Tambah Paket')
                            ->defaultItems(0),

                        Repeater::make("submissionTests")
                            ->label('Pengujian satuan')
                            ->schema([
                                Select::make('test_id')
                                    ->label('Pilih pengujian satuan')
                                    ->required()
                                    ->searchable()
                                    ->columnSpan(2)
                                    ->options(Test::all()->pluck('name', 'id'))
                                    ->reactive()
                                    ->live()
                                    ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                        $test = Test::find($state);
                                        if ($test) {
                                            $set("quantity", $test->minimum_unit);
                                            $set("min_unit", $test->minimum_unit);
                                        }
                                    }),

                                TextInput::make('quantity')
                                    ->label('Jumlah pengujian')
                                    ->numeric()
                                    ->required()
                                    ->minValue(fn(Get $get) => $get("min_unit") ?? 1)
                                    ->reactive()
                                    ->live(),

                                // TextInput::make('test_name')
                                //     ->label('Nama pengujian')
                                //     ->dehydrated(false)
                                //     ->disabled()
                                //     ->reactive()
                                //     ->live()
                                //     ->formatStateUsing(fn($state, Get $get) => Test::find($get("test_id"))?->name ?? ''),

                                TextInput::make('min_unit')
                                    ->hidden()
                                    ->dehydrated(false)
                                    ->default(0),
                            ])
                            ->columns(4)
                            ->columnSpanFull()
                            ->addActionLabel('Tambah Pengujian')
                            ->defaultItems(0)
                    ])
            ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('submission.code')
                    ->label('Kode Submission')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('submission.user.name')
                    ->label('Pengguna')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Peneliti')
                    ->searchable(),
                Tables\Columns\TextColumn::make('program_study')
                    ->label('Program Studi')
                    ->searchable(),
                Tables\Columns\TextColumn::make('research_title')
                    ->label('Judul Penelitian')
                    ->searchable()
                    ->limit(40),
                Tables\Columns\TextColumn::make('personnel_count')
                    ->label('Jumlah Personel')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('supervisor')
                    ->label('Supervisor')
                    ->searchable(),
                Tables\Columns\BadgeColumn::make('submission.status')
                    ->label('Status')
                    ->colors([
                        'secondary' => 'submitted',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'submitted' => 'Diajukan',
                        'approved' => 'Diterima',
                        'rejected' => 'Ditolak',
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('submission.test_submission_date')
                    ->label('Tanggal Pengujian')
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
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\TestingsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubmissionInternalDetails::route('/'),
            'create' => Pages\CreateSubmissionInternalDetail::route('/create'),
            'edit' => Pages\EditSubmissionInternalDetail::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with(['submission', 'submission.user'])
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
