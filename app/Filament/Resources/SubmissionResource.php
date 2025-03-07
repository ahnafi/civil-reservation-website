<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubmissionResource\Pages;
use App\Filament\Resources\SubmissionResource\RelationManagers;
use App\Models\Submission;
use Filament\Forms;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

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
                                ])->columns(),

                            Repeater::make("submissionTests")
                                ->relationship()
                                ->schema([
                                    Forms\Components\Select::make('test_id')
                                        ->required()
                                        ->searchable()
                                        ->relationship("test", "name")
                                ])->columns(),

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
                            Forms\Components\TextInput::make('document')
                                ->maxLength(255),
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
                                ]),
                            Forms\Components\Textarea::make('note')
                                ->columnSpanFull(),
                            Forms\Components\DateTimePicker::make('approval_date')
                                ->required(),
                        ]),
                    Wizard\Step::make('Billing')
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
                Tables\Columns\TextColumn::make('document')
                    ->searchable(),
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
