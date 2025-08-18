<?php

namespace App\Filament\Editor\Resources;

use App\Filament\Editor\Resources\StandardResource\Pages;
use App\Models\Standard;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class StandardResource extends Resource
{
    protected static ?string $model = Standard::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = "Standard";
    protected static ?string $title = 'Standard';
    protected static ?string $label = 'Standard';
    protected static ?string $pluralLabel = 'Standard';
    protected static ?string $navigationGroup = 'Manajemen Standard';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('nama')
                    ->label('Nama Standard')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Textarea::make('deskripsi')
                    ->label('Deskripsi')
                    ->required()
                    ->columnSpanFull(),

                Forms\Components\FileUpload::make('foto')
                    ->label('Foto')
                    ->directory('standard_photos')
                    ->image()
                    ->imageEditor()
                    ->columnSpanFull()
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $get): string {
                        $extension = $file->getClientOriginalExtension();
                        $id = $get('id') ?? -1;
                        $name = $get('nama') ?? 'standard';
                        return "standard_photo_{$id}_{$name}.{$extension}";
                    }),

                Forms\Components\FileUpload::make('file')
                    ->label('File')
                    ->directory('standard_files')
                    ->acceptedFileTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                    ->columnSpanFull()
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $get): string {
                        $extension = $file->getClientOriginalExtension();
                        $id = $get('id') ?? -1;
                        $name = $get('nama') ?? 'standard';
                        return "standard_file_{$id}_{$name}.{$extension}";
                    }),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('nama')
                    ->label('Nama Standard')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('deskripsi')
                    ->label('Deskripsi')
                    ->limit(100)
                    ->searchable(),

                Tables\Columns\ImageColumn::make('foto')
                    ->label('Foto')
                    ->circular(),

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
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListStandards::route('/'),
            'create' => Pages\CreateStandard::route('/create'),
            'view' => Pages\ViewStandard::route('/{record}'),
            'edit' => Pages\EditStandard::route('/{record}/edit'),
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
