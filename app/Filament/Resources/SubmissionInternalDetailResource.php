<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubmissionInternalDetailResource\Pages;
use App\Filament\Resources\SubmissionInternalDetailResource\RelationManagers;
use App\Models\SubmissionInternalDetail;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SubmissionInternalDetailResource extends Resource
{
    protected static ?string $model = SubmissionInternalDetail::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('program_study')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('research_title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('personnel_count')
                    ->numeric()
                    ->default(null),
                Forms\Components\TextInput::make('supervisor')
                    ->maxLength(255)
                    ->default(null),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('program_study')
                    ->searchable(),
                Tables\Columns\TextColumn::make('research_title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('personnel_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('supervisor')
                    ->searchable(),
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
            'index' => Pages\ListSubmissionInternalDetails::route('/'),
            'create' => Pages\CreateSubmissionInternalDetail::route('/create'),
            'edit' => Pages\EditSubmissionInternalDetail::route('/{record}/edit'),
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
