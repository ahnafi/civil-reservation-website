<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubmissionResource\Pages;
use App\Filament\Resources\SubmissionResource\RelationManagers;
use App\Models\Package;
use App\Models\Submission;
use Filament\Forms;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Form;
use Filament\Forms\Set;
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
                Wizard::make([
                    Wizard\Step::make('Order')
                        ->schema([
                            Repeater::make("submissionPackages")
                                ->relationship()
                                ->schema([
                                    Forms\Components\Select::make('package_id')
                                        ->required()
                                        ->searchable()
                                        ->relationship("package", "name")
                                        ->reactive()
                                        ->afterStateUpdated(function ($state, Set $set, $get) {
                                            $package = Package::find($state);
                                            if ($package) {
                                                $set("package_price", $package->price);
                                            }
                                        }),
                                    TextInput::make('package_price')
                                        ->numeric()
                                        ->dehydrated(false)
                                        ->disabled()
                                        ->default(function ($get) {
                                            return $get("package_price");
                                        }),
                                ])->columns(),

                            Repeater::make("submissionTests")
                                ->relationship()
                                ->schema([
                                    Select::make('test_id')
                                        ->required()
                                        ->searchable()
                                        ->relationship('test', 'name')
                                        ->reactive()
                                        ->afterStateUpdated(function ($state, Forms\Set $set, $get) {
                                            $test = \App\Models\Test::find($state);
                                            if ($test) {
                                                $set('quantity', $test->minimum_unit);
                                                $set('quantity_min_value', $test->minimum_unit);
                                                $set('unit_price', $test->price);
                                            }
                                        })->columnSpan(2),

                                    TextInput::make('quantity')
                                        ->numeric()
                                        ->required()
                                        ->minValue(function ($get) {
                                            return $get('quantity_min_value') ?? 0;
                                        }),

                                    TextInput::make('unit_price')
                                        ->numeric()
                                        ->dehydrated(false)
                                        ->disabled(),

                                ])->columns(4),

                        ]),
                    Wizard\Step::make('Delivery')
                        ->schema([
                            Forms\Components\Select::make('user_id')
                                ->relationship('user', 'name')
                                ->searchable()
                                ->required(),
                            Forms\Components\TextInput::make('company_name')
                                ->maxLength(255),
                            Forms\Components\TextInput::make('project_name')
                                ->required()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('project_address')
                                ->required()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('total_cost')
                                ->numeric()
                                ->default(0),
                            Forms\Components\FileUpload::make('document')
                                ->preserveFilenames() // Mempertahankan nama file asli
                                ->acceptedFileTypes([
                                    'application/pdf',
                                    'application/msword',
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                ])
                                ->maxSize(2048)
                                ->directory("submission")
                                ->helperText('Format file yang diterima: PDF, DOC, DOCX. Maksimal ukuran file: 2MB.')
                                ->openable()
                                ->columns(),
                            ToggleButtons::make('status')
                                ->inline()
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
                            Forms\Components\Textarea::make('note')
                                ->columnSpanFull(),
                            Forms\Components\DateTimePicker::make('approval_date'),
                        ]),
                    Wizard\Step::make('Billing')
                        ->schema([
                            // ...
                        ]),
                    Wizard\Step::make('Testing')
                        ->schema([
                            // ...
                        ]),
                ])->columnSpanFull()
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
            //
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
}
