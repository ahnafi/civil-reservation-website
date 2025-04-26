<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AdminResource\Pages;
use App\Filament\Resources\AdminResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class AdminResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-user';
    protected static ?string $modelLabel = 'Admin';
    protected static ?string $navigationGroup = 'Manajemen Admin';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where("role", "admin")
            ->orWhere("role", "superadmin");
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
                Forms\Components\DateTimePicker::make('email_verified_at')
                    ->label('Tanggal verifikasi Email'),
                ToggleButtons::make('role')
                    ->inline()
                    ->required()
                    ->options([
                        "admin" => "Admin",
                        "external" => "External",
                        "internal" => "Internal",
                    ])
                    ->colors([
                        "admin" => "danger",
                        "external" => "success",
                        "internal" => "primary"
                    ])->default("admin")->hidden(),
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
            ->recordUrl(null)
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Nama Lengkap')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Nomor Telepon')
                    ->searchable(),
                Tables\Columns\TextColumn::make('role')
                    ->label("Role")
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'external' => 'info',
                        'internal' => 'success',
                        'admin' => 'warning',
                        'superadmin' => 'danger',
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
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make()
                    ->visible(fn($record): bool => $record->role == "admin" || (Auth::user()->role == "superadmin" && $record->role == "superadmin")),
                Tables\Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->visible(fn($record): bool => Auth::user()->role == "superadmin" && $record->role == "admin"),
            ]);
//            ->bulkActions([
//                Tables\Actions\BulkActionGroup::make([
//                    Tables\Actions\DeleteBulkAction::make(),
//                ])->visible(fn(): bool => Auth::user()->role == "superadmin"),
//            ]);
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
            'index' => Pages\ListAdmins::route('/'),
            'create' => Pages\CreateAdmin::route('/create'),
            'edit' => Pages\EditAdmin::route('/{record}/edit'),
        ];
    }
}
