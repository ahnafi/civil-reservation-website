<?php

namespace App\Filament\Resources;

use App\Filament\Exports\TestingExporter;
use App\Filament\Exports\TransactionExporter;
use App\Filament\Resources\TestingResource\Pages;
use App\Filament\Resources\TestingResource\RelationManagers;
use App\Models\Testing;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TestingResource extends Resource
{
    protected static ?string $model = Testing::class;
    protected static ?string $navigationIcon = 'heroicon-s-clipboard-document-list';
    protected static ?string $modelLabel = 'Pengujian';
    protected static ?string $navigationGroup = 'Manajemen Peminjaman';
    protected static ?int $navigationSort = 3;
    protected static ?string $navigationBadgeTooltip = 'Banyak pengujian sedang diuji';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where("status", "testing")->count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('code')
                    ->maxLength(255),
                Forms\Components\TextInput::make('status')
                    ->required(),
                Forms\Components\Textarea::make('note')
                    ->columnSpanFull(),
                Forms\Components\Textarea::make('documents')
                    ->columnSpanFull(),
                Forms\Components\DatePicker::make('test_date'),
                Forms\Components\DateTimePicker::make('completed_at'),
                Forms\Components\Select::make('submission_id')
                    ->relationship('submission', 'id')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->headerActions([
                    Tables\Actions\ExportAction::make()
                        ->exporter(TestingExporter::class)
                ]
            )
            ->columns([
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode pengujian')
                    ->searchable(),
                Tables\Columns\TextColumn::make('submission.code')
                    ->searchable()
                    ->label("Kode pengajuan"),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        "testing" => "warning",
                        "completed" => "success",
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        "testing" => "Sedang diuji",
                        "completed" => "Selesai",
                        default => ucfirst($state),
                    }),
                Tables\Columns\TextColumn::make('test_date')
                    ->label("Tanggal pengujian")
                    ->sortable(),
                Tables\Columns\TextColumn::make('completed_at')
                    ->label("Tnggal selesai")
                    ->date()
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
            'index' => Pages\ListTestings::route('/'),
            'create' => Pages\CreateTesting::route('/create'),
            'edit' => Pages\EditTesting::route('/{record}/edit'),
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
