<?php

namespace App\Filament\Editor\Resources;

use App\Filament\Editor\Resources\ResearchResource\Pages;
use App\Filament\Editor\Resources\ResearchResource\RelationManagers;
use App\Models\Research;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ResearchResource extends Resource
{
    protected static ?string $model = Research::class;

    protected static ?string $navigationIcon = 'heroicon-s-document-magnifying-glass';
    protected static ?string $navigationLabel = "Penelitian";
    protected static ?string $title = 'Penelitian';
    protected static ?string $label = 'Penelitian';
    protected static ?string $pluralLabel = 'Penelitian';
    protected static ?string $navigationGroup = 'Manajemen Penelitian';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->label('Judul')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TagsInput::make('author')
                    ->placeholder('Tambah penulis')
                    ->helperText('Tekan Tab atau Enter untuk menambahkan penulis')
                    ->splitKeys(['Tab'])
                    ->label('Penulis')
                    ->required(),

                Forms\Components\TextInput::make('year')
                    ->label('Tahun')
                    ->required()
                    ->numeric()
                    ->minValue(1900)
                    ->maxValue(date('Y'))
                    ->maxLength(4),

                Forms\Components\TextInput::make('publication')
                    ->label('Publikasi')
                    ->maxLength(255),
                Forms\Components\TagsInput::make('keywords')
                    ->required()
                    ->placeholder('Kata Kunci')
                    ->helperText('Tekan Tab atau Enter untuk menambahkan kata kunci')
                    ->splitKeys(['Tab'])
                    ->label('Kata Kunci'),
                Forms\Components\TextInput::make('link')
                    ->url()
                    ->label('Tautan')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('abstract')
                    ->required()
                    ->label('Abstrak')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->searchable(),
                Tables\Columns\TextColumn::make('author')
                    ->label('Penulis')
                    ->searchable(),
                Tables\Columns\TextColumn::make('year')
                    ->label('Tahun'),
                Tables\Columns\TextColumn::make('publication')
                    ->label('Publikasi')
                    ->searchable(),
                Tables\Columns\TagsColumn::make('keywords')
                    ->label('Kata Kunci')
                    ->searchable(),
                Tables\Columns\TextColumn::make('link')
                    ->label('Tautan')
                    ->url(fn($record) => $record->link)
                    ->openUrlInNewTab()
                    ->searchable(),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->label('Dihapus Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Diperbarui Pada')
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
            'index' => Pages\ListResearch::route('/'),
            'create' => Pages\CreateResearch::route('/create'),
            'edit' => Pages\EditResearch::route('/{record}/edit'),
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
