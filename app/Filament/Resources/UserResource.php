<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $modelLabel = 'Pengguna';
    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationGroup = 'Manajemen Peminjaman';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where("role", "internal")
            ->orWhere("role", "external")->count();
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where("role", "internal")
            ->orWhere("role", "external");
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nama lengkap')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('password')
                    ->password()
                    ->required(fn($record) => is_null($record))
                    ->revealable()
                    ->minLength(8)
                    ->dehydrated(fn($state) => filled($state))
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->label('Nomor Telepon')
                    ->tel()
                    ->telRegex('/^(\\+62|0)[0-9]{9,12}$/')
                    ->validationMessages([
                        'telRegex' => 'Format nomor telepon tidak valid. Gunakan format +62 atau 0 diikuti dengan 9-12 digit angka.',
                    ]),
                Forms\Components\TextInput::make('identity')
                    ->label('Nomor Identitas(NIK/NIM/NIP)')
                    ->maxLength(255),
                Forms\Components\DateTimePicker::make('email_verified_at')
                    ->label('Tanggal verifikasi Email'),
                ToggleButtons::make('role')
                    ->inline()
                    ->required()
                    ->options([
                        "external" => "External",
                        "internal" => "Internal",
                    ])
                    ->colors([
                        "external" => "success",
                        "internal" => "primary"
                    ]),
                Forms\Components\FileUpload::make('photo')
                    ->image()
                    ->directory('photo_profiles')
                    ->avatar()
                    ->imageEditor()
                    ->openable(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
//                Tables\Columns\ImageColumn::make('photo')
//                    ->label('Foto profil')
//                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Lengkap')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Nomor Telepon')
                    ->searchable(),
                Tables\Columns\TextColumn::make('identity')
                    ->label("Nomor Identitas")
                    ->searchable(),
                Tables\Columns\TextColumn::make('role')
                    ->label("Role")
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'external' => 'info',
                        'internal' => 'success',
                    }),
                Tables\Columns\TextColumn::make("email_verified_at")
                    ->label("Tanggal verifikasi Email")
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label("Tanggal Registrasi")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label("Tanggal Update")
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')
                    ->options([
                        "external" => "External",
                        "internal" => "Internal",
                    ])
                    ->multiple()
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
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
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
