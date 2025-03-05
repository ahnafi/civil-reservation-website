<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestPackageResource\Pages;
use App\Filament\Resources\TestPackageResource\RelationManagers;
use App\Models\TestPackage;
use App\Models\TestType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\HtmlString;
use function Laravel\Prompts\textarea;

class TestPackageResource extends Resource
{
    protected static ?string $model = TestPackage::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('image')
                    ->label('Foto')
                    ->image()
                    ->columnSpanFull()
                    ->directory('test_packages')
                    ->disk("public"),

                Forms\Components\TextInput::make('name')
                    ->label('Nama Paket')
                    ->required()
                    ->maxLength(255),

                Forms\Components\TextInput::make('price')
                    ->label('Total Harga')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('Rp'),

                Forms\Components\Textarea::make('description')
                    ->label('Deskripsi')
                    ->columns(),

                Forms\Components\Select::make("testTypes")
                    ->label("Jenis pengujian")
                    ->multiple()
                    ->required()
                    ->columns()
                    ->relationship("testTypes", "name")
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                        // Ambil data test_type yang dipilih
                        $selectedTests = $state ?? [];

                        // Hitung total harga
                        $totalPrice = 0;
                        foreach ($selectedTests as $testTypeId) {
                            $testType = TestType::find($testTypeId);
                            if ($testType) {
                                $totalPrice += $testType->price * $testType->minimum_unit;
                            }
                        }

                        // Update nilai total harga
                        $set('price', $totalPrice);
                    }),

            ]);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                ->disk("public"),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->label("total harga")
                    ->money("IDR")
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
            'index' => Pages\ListTestPackages::route('/'),
            'create' => Pages\CreateTestPackage::route('/create'),
            'edit' => Pages\EditTestPackage::route('/{record}/edit'),
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
