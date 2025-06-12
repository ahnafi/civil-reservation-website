<?php

namespace App\Filament\Editor\Resources;

use App\Filament\Editor\Resources\LaboratoryResource\Pages;
use App\Filament\Editor\Resources\LaboratoryResource\RelationManagers;
use App\Models\Laboratory;
use App\Services\FileNaming;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class LaboratoryResource extends Resource
{
    protected static ?string $model = Laboratory::class;
    protected static ?string $modelLabel = 'Lab';
    protected static ?string $navigationIcon = 'heroicon-s-home-modern';
    protected static ?string $navigationGroup = 'Manajemen Laboratorium';
    protected static ?string $navigationLabel = 'Laboratorium';
    protected static ?string $title = 'Laboratorium';
    protected static ?string $label = 'Laboratorium';


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
                    Forms\Components\Textarea::make('description')
                        ->label('Deskripsi laboratorium')
                        ->required()
                        ->maxLength(65535),
                    Forms\Components\FileUpload::make('images')
                        ->label('Gambar laboratorium')
                        ->image()
                        ->reorderable()
                        ->required()
                        ->imageEditor()
                        ->previewable(true)
                        ->imagePreviewHeight('150')
                        ->visibility('public')
                        ->multiple()
                        ->maxSize(2048)
                        ->directory('laboratory_images')
                        ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $component) {
                            $extension = $file->getClientOriginalExtension();

                            $record = $component->getLivewire()->getRecord();
                            $id = $record?->id ?? -1;
                            $name = $record?->name ?? 'laboratory';

                            return FileNaming::generateLaboratoryName($id, $name, $extension);
                        }),
                    Forms\Components\BelongsToManyMultiSelect::make('equipments')
                        ->relationship('equipments', 'name')
                        ->label('Peralatan')
                        ->preload()
                        ->searchable()
                        ->required()
                        ->placeholder('Pilih Peralatan')
                        ->reactive()
                        ->afterStateUpdated(function ($state, callable $set) {
                            $set('equipments', $state);
                        }),
                ])->columns(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Laboratorium')
                    ->searchable(),
                Tables\Columns\TextColumn::make('room')
                    ->label('Ruangan')
                    ->searchable(),
                Tables\Columns\ImageColumn::make('image')
                    ->label('Gambar'),
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
                Tables\Columns\TextColumn::make('deleted_at')
                    ->label('Dihapus Pada')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
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
}
