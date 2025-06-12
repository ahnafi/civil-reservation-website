<?php

namespace App\Filament\Editor\Resources;

use App\Filament\Editor\Resources\NewsResource\Pages;
use App\Filament\Editor\Resources\NewsResource\RelationManagers;
use App\Models\News;
use App\Services\FileNaming;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class NewsResource extends Resource
{
    protected static ?string $model = News::class;

    protected static ?string $navigationIcon = 'heroicon-s-newspaper';
    protected static ?string $navigationLabel = "Berita";
    protected static ?string $title = 'Berita';
    protected static ?string $label = 'Berita';
    protected static ?string $pluralLabel = 'Berita';
    protected static ?string $navigationGroup = 'Manajemen Berita';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('thumbnail')
                    ->label('Thumbnail')
                    ->directory('news_thumbnails')
                    ->imageEditor()
                    ->required()
                    ->columnSpanFull()
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $component) {
                        $extension = $file->getClientOriginalExtension();

                        $record = $component->getLivewire()->getRecord();
                        $id = $record?->id ?? -1;
                        $name = $record?->title ?? 'news';

                        return FileNaming::generateNewsName($id, $name, $extension);
                    }),

                Forms\Components\TextInput::make('title')
                    ->label('Judul')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Select::make('author_id')
                    ->createOptionForm([
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
                            ->avatar()
                            ->directory('authors-avatars')
                            ->imageEditor()
                            ->image()
                            ->label('Avatar'),
                    ])
                    ->label('Penulis')
                    ->relationship('author', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),

                Forms\Components\Select::make('news_category_id')
                    ->createOptionForm([
                        Forms\Components\TextInput::make('name')
                            ->label('Nama Kategori')
                            ->required()
                            ->maxLength(255),
                    ])
                    ->label('Kategori')
                    ->relationship('newsCategory', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),

                // Forms\Components\Toggle::make('is_featured')
                // ->columnSpanFull()
                //     ->label('Berita Unggulan'),

                Forms\Components\RichEditor::make('content')
                    ->label('Konten')
                    ->fileAttachmentsDirectory('news_content_attachments')
                    ->required()
                    ->columnSpanFull()
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $component) {
                        $extension = $file->getClientOriginalExtension();

                        $record = $component->getLivewire()->getRecord();
                        $id = $record?->id ?? -1;
                        $name = $record?->title ?? 'news';

                        return FileNaming::generateNewsContentAttachmentName($id, $name, $extension);
                    })
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Judul')
                    ->searchable(),
                Tables\Columns\TextColumn::make('author.name')
                    ->label('Penulis')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('newsCategory.name')
                    ->label('Kategori')
                    ->numeric()
                    ->sortable(),
                // Tables\Columns\ToggleColumn::make('is_featured')
                //     ->label('Berita Unggulan'),
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
            'index' => Pages\ListNews::route('/'),
            'create' => Pages\CreateNews::route('/create'),
            'edit' => Pages\EditNews::route('/{record}/edit'),
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
