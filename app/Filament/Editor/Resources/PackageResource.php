<?php

namespace App\Filament\Editor\Resources;

use App\Filament\Resources\PackageResource\Pages;
use App\Filament\Resources\PackageResource\RelationManagers;
use App\Models\Package;
use App\Models\Test;
use App\Services\FileNaming;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use App\Models\Laboratory;

class PackageResource extends Resource
{
    protected static ?string $model = Package::class;
    protected static ?string $modelLabel = 'Paket Pengujian';
    protected static ?string $navigationIcon = 'heroicon-s-rectangle-group';
    protected static ?string $navigationGroup = 'Manajemen Laboratorium';
    protected static ?string $navigationLabel = 'Paket Pengujian';
    protected static ?string $title = 'Paket Pengujian';
    protected static ?string $label = 'Paket Pengujian';
    protected static ?string $pluralLabel = 'Paket Pengujian';
    //    public static function getNavigationBadge(): ?string
//    {
//        return static::getModel()::count();
//    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('images')
                    ->label("Foto Paket Pengujian")
                    ->helperText('Maksimal ukuran file: 2MB per gambar')
                    ->multiple()
                    ->reorderable()
                    ->image()
                    ->imageEditor()
                    ->previewable(true)
                    ->imagePreviewHeight('150')
                    ->visibility('public')
                    ->multiple()
                    ->maxSize(2048)
                    ->columnSpanFull()
                    ->directory("package_image")
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $get): string {
                        $extension = $file->getClientOriginalExtension();

                        $id   = $get('id') ?? -1;
                        $name = $get('name') ?? 'package';

                        return FileNaming::generatePackageName($id, $name, $extension);
                    }),
                Forms\Components\TextInput::make('name')
                    ->label('Nama Paket')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make("tests")
                    ->relationship("tests", "name")
                    ->label("Pilih Pengujian")
                    ->required()
                    ->multiple()
                    ->searchable()
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set) {
                        $selectedTests = Test::findMany($state);
                        $totalPrice = $selectedTests->sum('price');
                        $set('price', $totalPrice);
                    }),
                Forms\Components\Textarea::make('description')
                    ->label('Deskripsi Paket'),
                Forms\Components\TextInput::make('price')
                    ->label('Harga Paket')
                    ->helperText("Harga paket otomatis dijumlah dari total pengujian")
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->minValue(0)
                    ->prefix('Rp'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Paket')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->money("IDR")
                    ->label('Harga Paket')
                    ->sortable(),
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
            'index' => Pages\ListPackages::route('/'),
            'create' => Pages\CreatePackage::route('/create'),
            'edit' => Pages\EditPackage::route('/{record}/edit'),
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
