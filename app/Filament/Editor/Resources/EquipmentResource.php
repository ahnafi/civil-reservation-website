<?php

namespace App\Filament\Editor\Resources;

use App\Filament\Editor\Resources\EquipmentResource\Pages;
use App\Models\Equipment;
use App\Services\FileNaming;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class EquipmentResource extends Resource
{
    protected static ?string $model = Equipment::class;
    protected static ?string $navigationIcon = 'heroicon-s-wrench-screwdriver';
    protected static ?string $navigationLabel = "Peralatan";
    protected static ?string $title = 'Peralatan';
    protected static ?string $label = 'Peralatan';
    protected static ?string $pluralLabel = 'Peralatan';
    protected static ?string $navigationGroup = 'Manajemen Laboratorium';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('image')
                    ->label('Gambar Peralatan')
                    ->image()
                    ->preserveFilenames()
                    ->enableOpen()
                    ->enableDownload()
                    ->directory('equipment')
                    ->maxSize(2048)
                    ->columnSpanFull()
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $component) {
                        $extension = $file->getClientOriginalExtension();

                        $record = $component->getLivewire()->getRecord();
                        $id = $record?->id ?? -1;
                        $name = $record?->name ?? 'equipment';

                        return FileNaming::generateEquipmentName($id, $name, $extension);
                    }),
                Forms\Components\TextInput::make('name')
                    ->label('Nama Peralatan')
                    ->required()
                    ->maxLength(255),
                Forms\Components\BelongsToManyMultiSelect::make('laboratories')
                    ->relationship('laboratories', 'name')
                    ->label('Laboratorium')
                    ->preload()
                    ->searchable()
                    ->required()
                    ->placeholder('Pilih Laboratorium')
                    ->reactive()
                    ->afterStateUpdated(function ($state, callable $set) {
                        $set('laboratories', $state);
                    }),
                Forms\Components\Textarea::make('description')
                    ->label('Deskripsi'),


            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Peralatan')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TagsColumn::make('laboratories.name')
                    ->label('Laboratorium')
                    ->separator(', '),
                Tables\Columns\TextColumn::make('description')
                    ->label('Deskripsi')
                    ->limit(50),
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
            'index' => Pages\ListEquipment::route('/'),
            'create' => Pages\CreateEquipment::route('/create'),
            'edit' => Pages\EditEquipment::route('/{record}/edit'),
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
