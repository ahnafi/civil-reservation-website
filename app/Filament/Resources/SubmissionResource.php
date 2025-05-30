<?php

namespace App\Filament\Resources;

use App\Filament\Exports\SubmissionExporter;
use App\Filament\Resources\SubmissionResource\Pages;
use App\Filament\Resources\SubmissionResource\RelationManagers;
use App\Models\Package;
use App\Models\Submission;
use App\Models\Test;
use App\Models\User;
use Filament\Tables\Actions\ExportAction;
use Filament\Forms;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Forms\Get;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use \App\Services\BookingService;

class SubmissionResource extends Resource
{
    protected static ?string $model = Submission::class;

    protected static ?string $navigationIcon = 'heroicon-s-pencil-square';
    protected static ?string $modelLabel = 'Pengajuan Peminjaman';
    protected static ?string $navigationGroup = 'Manajemen Peminjaman';
    protected static ?string $navigationBadgeTooltip = 'Banyak pengajuan yang diajukan';
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where("status", "submitted")->count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Split::make([
                    Forms\Components\Section::make()
                        ->schema([
                            Forms\Components\TextInput::make('user_role')
                                ->hidden()
                                ->disabled()
                                ->dehydrated(false)
                                ->formatStateUsing(fn($state, Get $get) => $state ?: (User::find($get("user_id"))?->role ?? "external")),
                            Select::make('user_id')
                                ->relationship('user', 'name')
                                ->searchable()
                                ->required()
                                ->reactive()
                                ->live()
                                ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                    $user = User::find($state);
                                    if ($user) {
                                        $set("user_role", $user->role);

                                        if ($user->role !== "external") {
                                            $set("total_cost", 0);
                                        } else {
                                            $totalCost = 0;
                                            foreach ($get('submissionPackages') ?? [] as $package) {
                                                $totalCost += $package['package_price'] ?? 0;
                                            }

                                            foreach ($get('submissionTests') ?? [] as $test) {
                                                $totalCost += ($test['unit_price'] ?? 0) * ($test['quantity'] ?? 0);
                                            }
                                            $set("total_cost", $totalCost);
                                        }
                                    }
                                }),
                            TextInput::make('company_name')
                                ->label('Nama perusahaan')
                                ->helperText("Penguji internal tidak wajib mengisi")
                                ->maxLength(255)
                                ->required(fn(Get $get) => $get("user_role") === "external"),
                            TextInput::make('project_name')
                                ->label('Nama proyek')
                                ->required()
                                ->maxLength(255),
                            TextInput::make('project_address')
                                ->label('Alamat proyek')
                                ->required()
                                ->maxLength(255),
                            TextInput::make('total_cost')
                                ->label('Total biaya')
                                ->numeric()
                                ->prefix("Rp")
                                ->default(0)
                                ->reactive(),
                            Forms\Components\DateTimePicker::make('test_submission_date')
                                ->label('Tanggal pengujian')
                                ->required(),
                            Forms\Components\FileUpload::make('document')
                                ->label('Lampiran')
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
                                ->columnSpanFull(),
                            Forms\Components\Textarea::make('note')
                                ->label('Catatan')
                                ->columnSpanFull(),

                            //                            paket

                            Repeater::make("submissionPackages")
                                ->label('Paket pengujian')
                                ->relationship()
                                ->schema([
                                    Select::make('package_id')
                                        ->label('Pilih paket pengujian')
                                        ->required()
                                        ->searchable()
                                        ->relationship("package", "name")
                                        ->reactive()
                                        ->live()
                                        ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                            $package = Package::find($state);

                                            if ($package) {
                                                $set("package_price", $package->price);

                                                if ($get("../../user_role") === "external") {
                                                    $totalCost = $get("../../total_cost") ?? 0;
                                                    $totalCost += $package->price;
                                                    $set("../../total_cost", $totalCost);
                                                }
                                            }
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
                                ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                    self::updateTotalCost($get, $set);
                                })
                            ,

                            //                            test

                            Repeater::make("submissionTests")
                                ->label('Pengujian satuan')
                                ->relationship()
                                ->schema([
                                    Select::make('test_id')
                                        ->label('Pilih pengujian satuan')
                                        ->required()
                                        ->searchable()
                                        ->columnSpan(2)
                                        ->relationship('test', 'name')
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
                                ])
                                ->columns(4)
                                ->columnSpanFull()
                                ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                    self::updateTotalCost($get, $set);
                                })

                        ])->columns()->grow(false),

                    //                    approval

                    Forms\Components\Section::make([
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
                        Forms\Components\Placeholder::make('created_at')
                            ->label('Tanggal dibuat')
                            ->content(fn(Submission $record): string => $record->created_at->toFormattedDateString())
                            ->visible(fn(?Submission $record): bool => $record !== null),
                    ])->grow(false)->visibleOn("view"),
                ])->columnSpanFull()->from("md"),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordUrl(
                fn(Submission $record): string => SubmissionResource::getUrl('view', ['record' => $record]),
            )
            ->headerActions([
                ExportAction::make()
                    ->exporter(SubmissionExporter::class)
                    ->color("success")
                    ->label("Ekspor data ke Excel")
            ])
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->searchable()
                    ->label('Kode Pengajuan'),
                Tables\Columns\TextColumn::make('user.email')
                    ->label("Email pengguna")
                    ->searchable(),
                Tables\Columns\TextColumn::make('project_name')
                    ->label("Nama proyek")
                    ->searchable(),
                Tables\Columns\TextColumn::make('total_cost')
                    ->label("Total harga")
                    ->money("IDR")
                    ->prefix("Rp ")
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'submitted' => 'info',
                        'approved' => 'success',
                        'rejected' => 'danger',
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'submitted' => 'Diajukan',
                        'approved' => 'Diterima',
                        'rejected' => 'Ditolak',
                        default => ucfirst($state),
                    }),

                Tables\Columns\TextColumn::make('approval_date')
                    ->label("Tanggal diterima")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label("Tanggal Dibuat")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label("Tanggal Update")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->label("Tanggal Dihapus")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        "submitted" => "Diajukan",
                        "approved" => "Diterima",
                        "rejected" => "Ditolak"
                    ])
                    ->multiple()
            ])
            ->actions([
                Tables\Actions\Action::make("Terima")
                    ->action(function (Model $record) {
                        if ($record->user && $record->user->email) {
                            $record->status = 'approved';
                            $record->approval_date = Carbon::now()->format('Y-m-d\TH:i:s');
                            $record->save();

                            Mail::raw('Pengajuan Anda telah disetujui.', function ($message) use ($record) {
                                $message->to($record->user->email)
                                    ->subject('Pengajuan Disetujui');
                            });

                            Notification::make()
                                ->title('Pengajuan berhasil disetujui')
                                ->body("Pengajuan oleh {$record->user->name} telah disetujui.")
                                ->success()
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Gagal mengubah pengajuan ')
                                ->body("Pengajuan oleh {$record->user->name} gagal diubah.")
                                ->danger()
                                ->send();
                        }

                    })
                    ->color("success")
                    ->requiresConfirmation()
                    ->icon("heroicon-o-check-circle")
                    ->visible(fn($record) => $record->status === 'submitted'),

                Tables\Actions\Action::make("Tolak")
                    ->form([
                        Forms\Components\Textarea::make("reason")
                            ->required()
                            ->label("Perihal"),
                    ])
                    ->action(function (array $data, Model $record) {
                        if ($record->user && $record->user->email) {

                            $record->status = 'rejected';
                            $record->save();

                            Mail::raw("Pengajuan Anda ditolak." . $data["reason"], function ($message) use ($record) {
                                $message->to($record->user->email)
                                    ->subject('Pengajuan Ditolak');
                            });

                            Notification::make()
                                ->title('Pengajuan Ditolak')
                                ->body("Pengajuan oleh {$record->user->name} telah ditolak.")
                                ->success()
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Gagal mengubah pengajuan ')
                                ->body("Pengajuan oleh {$record->user->name} gagal diubah.")
                                ->danger()
                                ->send();
                        }

                    })
                    ->color("danger")
                    ->requiresConfirmation()
                    ->icon("heroicon-o-x-circle")
                    ->visible(fn($record) => $record->status === 'submitted'),

                Tables\Actions\Action::make("Transaksi")
                    ->icon("heroicon-o-credit-card")
                    ->color("warning")
                    ->url(fn(Submission $record): string => route("filament.admin.resources.submissions.edit", [$record, "activeRelationManager" => 0]))
                    ->visible(fn($record) => $record->status === 'approved'),

                Tables\Actions\Action::make("Pengujian")
                    ->icon("heroicon-o-beaker")
                    ->color("info")
                    ->url(fn(Submission $record): string => route("filament.admin.resources.submissions.edit", [$record, "activeRelationManager" => 1]))
                    ->visible(fn($record) => $record->status === 'approved'),

                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make(),
                    Tables\Actions\Action::make("Pengajuan ulang")
                        ->action(function (Model $record) {
                            $bookingService = app(BookingService::class);
                            $bookingService->recreateSubmission($record);
                        })
                        ->icon("heroicon-s-arrow-path")
                        ->visible(fn($record) => $record->status === "approved"),
                    Tables\Actions\ViewAction::make(),
                    Tables\Actions\DeleteAction::make(),
                    Tables\Actions\RestoreAction::make(),
                ])->tooltip("Aksi"),
            ], position: Tables\Enums\ActionsPosition::AfterColumns)
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
            RelationManagers\TestingsRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubmissions::route('/'),
            'create' => Pages\CreateSubmission::route('/create'),
            'edit' => Pages\EditSubmission::route('/{record}/edit'),
            'view' => Pages\ViewSubmission::route('/{record}'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with("user")
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function updateTotalCost(Get $get, Set $set): void
    {
        $totalCost = 0;

        $userRole = $get("user_role");

        if ($userRole === "external") {
            foreach ($get("submissionPackages") ?? [] as $package) {
                $totalCost += $package['package_price'] ?? 0;
            }

            foreach ($get("submissionTests") ?? [] as $test) {
                $unitPrice = $test['unit_price'] ?? 0;
                $quantity = $test['quantity'] ?? 0;
                $totalCost += ($unitPrice * $quantity);
            }
        }

        $set("total_cost", $totalCost);
    }

}
