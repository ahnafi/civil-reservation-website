<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestResource\Pages;
use App\Filament\Resources\TestResource\RelationManagers;
use App\Filament\Resources\TestResource\Widgets\TestOverview;
use App\Models\Test;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TestResource extends Resource
{
    protected static ?string $model = Test::class;

    protected static ?string $modelLabel = 'Pengujian';
    protected static ?string $navigationIcon = 'heroicon-o-beaker';
    protected static ?string $navigationGroup = 'Pengujian';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Split::make([
                    Forms\Components\Section::make([
                        Forms\Components\FileUpload::make('image')
                            ->directory('test_images')
                            ->label('Foto pengujian')
                            ->image()
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('name')
                            ->label('Nama pegujian')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('price')
                            ->label('Harga')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->prefix('Rp'),

                        Forms\Components\Select::make('category_id')
                            ->label('Kategori satuan')
                            ->relationship('category', 'name')
                            ->required(),
                        Forms\Components\Select::make('laboratory_id')
                            ->label("Lab")
                            ->relationship('laboratory', 'name')
                            ->required(),
                        Forms\Components\Textarea::make('description')
                            ->label('Deskripsi pengujian')
                            ->columnSpanFull(),
                    ])->columns()
                        ->columnSpan(3),
                    Forms\Components\Section::make([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Status')
                            ->required(),
                        Forms\Components\TextInput::make('minimum_unit')
                            ->label('Minimum unit pengujian')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                        Forms\Components\TextInput::make('daily_slot')
                            ->label('Slot harian')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0),
                    ])->grow(false),
                ])->columnSpanFull(),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama pegujian')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Harga')
                    ->money("IDR")
                    ->sortable(),
                Tables\Columns\TextColumn::make('minimum_unit')
                    ->label('Min unit')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('daily_slot')
                    ->label('Slot harian')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Kategori')
                    ->badge(),
                Tables\Columns\TextColumn::make('laboratory.name')
                    ->label('Lab'),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Status')
                    ->boolean(),
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
                Tables\Filters\SelectFilter::make("is_active")
                    ->options([
                        true => "Aktif",
                        false => "Non Aktif",
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListTests::route('/'),
            'create' => Pages\CreateTest::route('/create'),
            'edit' => Pages\EditTest::route('/{record}/edit'),
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
