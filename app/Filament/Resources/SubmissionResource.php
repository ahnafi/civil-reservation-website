<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubmissionResource\Pages;
use App\Filament\Resources\SubmissionResource\RelationManagers;
use App\Models\Package;
use App\Models\Submission;
use App\Models\Test;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Forms\Get;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;

class SubmissionResource extends Resource
{
    protected static ?string $model = Submission::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Split::make([
                    Forms\Components\Section::make()
                        ->schema([
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
                                ->maxLength(255)
                                ->required(fn(Get $get) => $get("user_role") === "external"),
                            TextInput::make('project_name')
                                ->required()
                                ->maxLength(255),
                            TextInput::make('project_address')
                                ->required()
                                ->maxLength(255),
                            TextInput::make('total_cost')
                                ->numeric()
                                ->prefix("Rp")
                                ->default(0)
                                ->reactive(),
                            Forms\Components\FileUpload::make('document')
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
                                ->columnSpanFull(),

//                            paket

                            Repeater::make("submissionPackages")
                                ->relationship()
                                ->schema([
                                    Select::make('package_id')
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
                                ->relationship()
                                ->schema([
                                    Select::make('test_id')
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
                                        ->numeric()
                                        ->required()
                                        ->minValue(fn(Get $get) => $get("min_unit") ?? 1)
                                        ->reactive()
                                        ->live()
                                        ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                            self::updateTotalCost($get, $set);
                                        }),

                                    TextInput::make('unit_price')
                                        ->numeric()
                                        ->reactive()
                                        ->dehydrated(false)
                                        ->disabled()
                                        ->default(fn(Get $get) => $get("unit_price") ?? 0)
                                        ->formatStateUsing(fn($state, Get $get) => $state ?: fn(Get $get) => $get("unit_price") ?? 0),
                                ])
                                ->columns(4)
                                ->columnSpanFull()
                                ->afterStateUpdated(function ($state, Get $get, Set $set) {
                                    self::updateTotalCost($get, $set);
                                })

                        ])->columns(),

//                    approval

                    Forms\Components\Section::make([
                        ToggleButtons::make('status')
                            ->inline()
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
                        Forms\Components\DateTimePicker::make('approval_date'),
                        Forms\Components\Placeholder::make('created_at')
                            ->content(fn(Submission $record): string => $record->created_at->toFormattedDateString())
                            ->visible(fn(?Submission $record): bool => $record !== null),
                        ])->grow(false)->columnSpan(1),
                ])->columnSpanFull()->from("md"),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('company_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('project_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('project_address')
                    ->searchable(),
                Tables\Columns\TextColumn::make('total_cost')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status'),
                Tables\Columns\TextColumn::make('approval_date')
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
            RelationManagers\TestingsRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubmissions::route('/'),
            'create' => Pages\CreateSubmission::route('/create'),
            'edit' => Pages\EditSubmission::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
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
