<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubmissionResource\Pages;
use App\Filament\Resources\SubmissionResource\RelationManagers;
use App\Models\Submission;
use App\Models\TestPackage;
use App\Models\TestType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\DatePicker;

class SubmissionResource extends Resource
{
    protected static ?string $model = Submission::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([

                Wizard::make([
                    Wizard\Step::make('Pilih Pengujian')
                        ->schema([

                            Repeater::make('Paket pengujian')
                                ->relationship("submissionItems")
                                ->addActionLabel("Tambah paket pengujian")
                                ->schema([
                                    Select::make('test_package_id')
                                        ->relationship("testPackage", "name")
                                        ->required(),
                                ]),

                            Repeater::make("pengujian satuan")
                                ->relationship("submissionItems")
                                ->schema([
                                    Select::make("test_type_id")
                                        ->relationship("testType", "name")
                                        ->required()
                                ])
                                
                        ]),
                    Wizard\Step::make('Delivery')
                        ->schema([
                            Forms\Components\TextInput::make('company_name')
                                ->required()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('project_name')
                                ->required()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('project_address')
                                ->required()
                                ->maxLength(255),
                            Forms\Components\TextInput::make('unit_qty')
                                ->required()
                                ->numeric()
                                ->default(0),
                            Forms\Components\TextInput::make('status')
                                ->required(),
                            Forms\Components\TextInput::make('total_cost')
                                ->numeric()
                                ->default(0),
                            Forms\Components\Textarea::make('note')
                                ->columnSpanFull(),
                            Forms\Components\DateTimePicker::make('approval_date'),
                            Forms\Components\Select::make('user_id')
                                ->relationship('user', 'name')
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
                Tables\Columns\TextColumn::make('company_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('project_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('project_address')
                    ->searchable(),
                Tables\Columns\TextColumn::make('unit_qty')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status'),
                Tables\Columns\TextColumn::make('total_cost')
                    ->numeric()
                    ->sortable(),
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
                Tables\Columns\TextColumn::make('user.name')
                    ->numeric()
                    ->sortable(),
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
