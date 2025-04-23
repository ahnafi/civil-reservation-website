<?php

namespace App\Filament\Resources\SubmissionResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Carbon;

class TestingsRelationManager extends RelationManager
{
    protected static string $relationship = 'testing';
    protected static ?string $modelLabel = 'Pengujian';
    protected static ?string $title = "Pengujian";

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                ToggleButtons::make('status')
                    ->label('Status Pengujian')
                    ->inline()
                    ->required()
                    ->options([
                        "testing" => "Sedang Berjalan",
                        "completed" => "Selesai",
                    ])
                    ->colors([
                        "testing" => "warning",
                        "completed" => "success",
                    ])
                    ->icons([
                        "testing" => "heroicon-o-clock",
                        "completed" => "heroicon-o-check-circle",
                    ])
                    ->required()
                    ->reactive()
                    ->afterStateUpdated(function ($state, Set $set) {
                        if ($state === "completed") {
                            $set('completed_at', Carbon::now()->format('Y-m-d\TH:i:s'));
                        } else {
                            $set('completed_at', null);
                            $set("test_date", Carbon::now()->format('Y-m-d\TH:i:s'));
                        }
                    }),

                Forms\Components\Textarea::make('note')
                    ->label('Catatan')
                    ->nullable(),

                Forms\Components\DateTimePicker::make('test_date')
                    ->label('Tanggal Testing')
                    ->nullable(),

                Forms\Components\DateTimePicker::make('completed_at')
                    ->label('Tanggal Selesai')
                    ->nullable(),

                Forms\Components\FileUpload::make('documents')
                    ->label('Lampiran')
                    ->multiple()
                    ->directory('testing_documents')
                    ->acceptedFileTypes([
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ])
                    ->openable()
                    ->helperText('Format file yang diterima: PDF, DOC, DOCX. Maksimal ukuran file: 2MB.')
                    ->columnSpanFull()
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('status')->label('Status')->sortable()
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        "testing" => "warning",
                        "completed" => "success",
                    }),
                Tables\Columns\TextColumn::make('test_date')->label('Tanggal Testing')->dateTime(),
                Tables\Columns\TextColumn::make('completed_at')->label('Selesai')->dateTime(),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make()
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\ForceDeleteAction::make(),
                Tables\Actions\RestoreAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ])
            ->modifyQueryUsing(fn(Builder $query) => $query->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]));
    }
}
