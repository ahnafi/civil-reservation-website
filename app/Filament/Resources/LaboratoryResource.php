<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LaboratoryResource\Pages;
use App\Filament\Resources\LaboratoryResource\RelationManagers;
use App\Models\Laboratory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LaboratoryResource extends Resource
{
    protected static ?string $model = Laboratory::class;

    protected static ?string $modelLabel = 'Lab';
    protected static ?string $navigationIcon = 'heroicon-o-home-modern';
    protected static ?string $navigationGroup = 'Pengujian';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make([
                    Forms\Components\TextInput::make('code')
                        ->label('Kode laboratorium')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\TextInput::make('name')
                        ->label('Nama laboratorium')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\TextInput::make('room')
                        ->label('Kode ruangan laboratorium')
                        ->required()
                        ->maxLength(255),
                ])->columns(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode laboratorium')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama laboratorium')
                    ->searchable(),
                Tables\Columns\TextColumn::make('room')
                    ->label('Kode ruangan laboratorium')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label("Tanggal Ditambahkan")
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
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
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
            'index' => Pages\ListLaboratories::route('/'),
            'create' => Pages\CreateLaboratory::route('/create'),
            'edit' => Pages\EditLaboratory::route('/{record}/edit'),
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
