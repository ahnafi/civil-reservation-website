<?php

namespace App\Filament\Editor\Resources;

use App\Filament\Editor\Resources\AuthorResource\Pages;
use App\Filament\Editor\Resources\AuthorResource\RelationManagers;
use App\Models\Author;
use App\Services\FileNaming;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class AuthorResource extends Resource
{
    protected static ?string $model = Author::class;

    protected static ?string $navigationIcon = 'heroicon-s-pencil-square';
    protected static ?string $navigationGroup = 'Manajemen Berita';
    protected static ?string $navigationLabel = 'Penulis';
    protected static ?string $title = 'Penulis';
    protected static ?string $label = 'Penulis';
    protected static ?string $pluralLabel = 'Penulis';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nama')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->maxLength(255),
                Forms\Components\Textarea::make('bio')
                    ->label('Biografi')
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('avatar')
                    ->label('Avatar')
                    ->avatar()
                    ->directory('authors-avatars')
                    ->imageEditor()
                    ->image()
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $component) {
                        $extension = $file->getClientOriginalExtension();

                        $record = $component->getLivewire()->getRecord();
                        $id = $record?->id ?? -1;
                        $name = $record?->name ?? 'author';

                        return FileNaming::generateAuthorName($id, $name, $extension);
                    })

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('avatar')
                    ->label('Avatar')
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
            'index' => Pages\ListAuthors::route('/'),
            'create' => Pages\CreateAuthor::route('/create'),
            'edit' => Pages\EditAuthor::route('/{record}/edit'),
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
