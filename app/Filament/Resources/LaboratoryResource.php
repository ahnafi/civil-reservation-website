<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LaboratoryResource\Pages;
use App\Filament\Resources\LaboratoryResource\RelationManagers;
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
    protected static ?string $pluralLabel = 'Laboratorium';

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
                        ->helperText('Maksimal ukuran file: 2MB per gambar')
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
                        ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $get): string {
                            $extension = $file->getClientOriginalExtension();

                            $id   = $get('id') ?? -1;
                            $name = $get('name') ?? 'laboratory';

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
                    ->label('Kode Lab')
                    ->searchable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable(),
                Tables\Columns\TextColumn::make('room')
                    ->label('Kode Ruangan')
                    ->searchable(),
                Tables\Columns\TextColumn::make('description')
                    ->label('Deskripsi')
                    ->limit(50)
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
