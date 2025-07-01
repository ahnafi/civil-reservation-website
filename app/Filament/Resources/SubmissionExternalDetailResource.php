<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubmissionExternalDetailResource\Pages;
use App\Filament\Resources\SubmissionExternalDetailResource\RelationManagers;
use App\Models\Package;
use App\Models\SubmissionExternalDetail;
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

class SubmissionExternalDetailResource extends Resource
{
    protected static ?string $model = SubmissionExternalDetail::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office';

    protected static ?string $navigationLabel = 'Submission Eksternal';

    protected static ?string $modelLabel = 'Submission Eksternal';

    protected static ?string $pluralModelLabel = 'Submission Eksternal';

    protected static ?string $navigationGroup = 'Submissions';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Data Submission')
                    ->schema([
                        Select::make('user_id')
                            ->label("Pengguna")
                            ->relationship('submission.user', 'name', modifyQueryUsing: fn(Builder $query): Builder => $query->where('role', 'external'))
                            ->searchable(['name', "email"])
                            ->required()
                            ->preload(),

                        TextInput::make('submission_type')
                            ->default('external')
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

                Section::make('Detail Eksternal')
                    ->schema([
                        Forms\Components\TextInput::make('company_name')
                            ->label('Nama perusahaan')
                            ->maxLength(255)
                            ->default(null),
                        Forms\Components\TextInput::make('project_name')
                            ->label('Nama proyek')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('project_address')
                            ->label('Alamat proyek')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('total_cost')
                            ->label('Total biaya')
                            ->numeric()
                            ->prefix('Rp')
                            ->disabled()
                            ->dehydrated()
                            ->default(0)
                            ->helperText('Total akan dihitung otomatis dari paket dan pengujian yang dipilih'),
                    ]),

                Section::make('Paket & Pengujian')
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
                                    ->live()
                                    ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                        $package = Package::find($state);

                                        if ($package) {
                                            $set("package_price", $package->price);
                                        }
                                        
                                        // Update total cost setelah package dipilih
                                        self::updateTotalCost($get, $set);
                                    }),
                                TextInput::make('package_price')
                                    ->label('Harga paket')
                                    ->numeric()
                                    ->dehydrated(false)
                                    ->disabled()
                                    ->reactive()
                                    ->live()
                                    ->default(fn(Get $get) => Package::find($get("package_id"))?->price ?? 0)
                                    ->formatStateUsing(fn($state, Get $get) => $state ?: (Package::find($get("package_id"))?->price ?? 0)),
                            ])->columns(2)->columnSpanFull()
                            ->addActionLabel('Tambah Paket')
                            ->deleteAction(
                                fn($action) => $action->after(fn(Get $get, Set $set) => self::updateTotalCost($get, $set))
                            )
                            ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                self::updateTotalCost($get, $set);
                            }),

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
                                            $set("unit_price", $test->price);
                                            $set("quantity", $test->minimum_unit);
                                            $set("min_unit", $test->minimum_unit);
                                        }
                                        self::updateTotalCost($get, $set);
                                    }),

                                TextInput::make('quantity')
                                    ->label('Jumlah pengujian')
                                    ->numeric()
                                    ->required()
                                    ->minValue(fn(Get $get) => $get("min_unit") ?? 1)
                                    ->reactive()
                                    ->live()
                                    ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                        self::updateTotalCost($get, $set);
                                    }),

                                TextInput::make('unit_price')
                                    ->label('Harga satuan pengujian')
                                    ->numeric()
                                    ->reactive()
                                    ->dehydrated(false)
                                    ->disabled()
                                    ->default(fn(Get $get) => $get("unit_price") ?? 0)
                                    ->formatStateUsing(fn($state, Get $get) => $state ?: (Test::find($get("test_id"))?->price ?? 0)),

                                TextInput::make('min_unit')
                                    ->hidden()
                                    ->dehydrated(false)
                                    ->default(0),
                            ])
                            ->columns(4)
                            ->columnSpanFull()
                            ->addActionLabel('Tambah Pengujian')
                            ->deleteAction(
                                fn($action) => $action->after(fn(Get $get, Set $set) => self::updateTotalCost($get, $set))
                            )
                            ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                self::updateTotalCost($get, $set);
                            })
                    ])
            ]);
    }

    public static function table(Table $table): Table
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
                Tables\Columns\TextColumn::make('company_name')
                    ->label('Nama Perusahaan')
                    ->searchable(),
                Tables\Columns\TextColumn::make('project_name')
                    ->label('Nama Proyek')
                    ->searchable(),
                Tables\Columns\TextColumn::make('project_address')
                    ->label('Alamat Proyek')
                    ->searchable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('total_cost')
                    ->label('Total Biaya')
                    ->numeric()
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('submission.status')
                    ->label('Status')
                    ->colors([
                        'secondary' => 'submitted',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
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
            RelationManagers\TransactionsRelationManager::class,
            RelationManagers\TestingsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubmissionExternalDetails::route('/'),
            'create' => Pages\CreateSubmissionExternalDetail::route('/create'),
            'edit' => Pages\EditSubmissionExternalDetail::route('/{record}/edit'),
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

    public static function updateTotalCost(Get $get, Set $set): void
    {
        $totalCost = 0;

        // Hitung total dari submission packages
        $submissionPackages = $get('submissionPackages') ?? [];
        foreach ($submissionPackages as $packageData) {
            if (isset($packageData['package_id'])) {
                $package = Package::find($packageData['package_id']);
                if ($package) {
                    $totalCost += $package->price;
                }
            }
        }

        // Hitung total dari submission tests
        $submissionTests = $get('submissionTests') ?? [];
        foreach ($submissionTests as $testData) {
            if (isset($testData['test_id']) && isset($testData['quantity'])) {
                $test = Test::find($testData['test_id']);
                if ($test) {
                    $quantity = (int) $testData['quantity'];
                    $totalCost += $test->price * $quantity;
                }
            }
        }

        // Set total cost ke field external detail
        $set('total_cost', $totalCost);
    }
}
