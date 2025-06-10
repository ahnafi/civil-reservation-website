<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use App\Services\FileNaming;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\ToggleButtons;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use function PHPUnit\Framework\isNull;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $modelLabel = 'Pengguna';
    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationGroup = 'Manajemen Pengguna';
    protected static ?string $navigationBadgeTooltip = 'Pengguna yang terdaftar';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where("role", "internal")
            ->orWhere("role", "external")->count();
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
                    ->maxLength(255)
                    ->visible(fn($record) => is_null($record) || ($record && $record->role !== "superadmin") || Auth::user()->role == "superadmin"),
                Forms\Components\TextInput::make('phone')
                    ->label('Nomor Telepon')
                    ->tel()
                    ->telRegex('/^(\\+62|0)[0-9]{9,12}$/')
                    ->validationMessages([
                        'telRegex' => 'Format nomor telepon tidak valid. Gunakan format +62 atau 0 diikuti dengan 9-12 digit angka.',
                    ]),
                Forms\Components\TextInput::make('identity')
                    ->label('Nomor Identitas(NIK/NIM/NIP)')
                    ->maxLength(255)
                    ->visible(fn($record) => is_null($record) || $record->identity == "internal" || $record->identity == "external"),
                Forms\Components\DateTimePicker::make('email_verified_at')
                    ->label('Tanggal verifikasi Email'),
                ToggleButtons::make('role')
                    ->inline()
                    ->required()
                    ->options(function ($record) {

                        if (is_null($record)) {
                            return [
                                'external' => 'External',
                                'internal' => 'Internal',
                                'admin' => 'Admin',
                            ];
                        }

                        if ($record->role === 'admin') {
                            return [
                                'admin' => 'Admin',
                            ];
                        }

                        if ($record->role === 'internal' || $record->role === 'external') {
                            return [
                                'external' => 'External',
                                'internal' => 'Internal',
                            ];
                        }

                        return [
                            "external" => "External",
                            "internal" => "Internal",
                            "admin" => "Admin"
                        ];
                    })
                    ->colors([
                        "external" => "success",
                        "internal" => "primary",
                        "admin" => "warning",
                    ])->visible(fn($record) => is_null($record) || ($record && $record->role != "superadmin"))
                    ->hidden(fn($record) => ($record && $record->id == Auth::user()->id)),
                FileUpload::make('photo')
                    ->label('Foto Profil')
                    ->image()
                    ->imageEditor()
                    ->previewable(true)
                    ->avatar()
                    ->directory('user_profile')
                    ->imagePreviewHeight('150')
                    ->visibility('public')
                    ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file, $component) {
                        $extension = $file->getClientOriginalExtension();

                        $record = $component->getLivewire()->getRecord();
                        $id = $record?->id ?? -1;

                        return FileNaming::generateUserProfileName($id, $extension);
                    })
                    ->default('default-user_profile.jpg')
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordUrl(null)
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
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make()
                    ->hidden(fn($record): bool => Auth::user()->role != "superadmin" && $record->role == "superadmin"),
                Tables\Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->visible(fn($record): bool => $record->role != "superadmin" && (Auth::user()->role == "superadmin" || Auth::user()->role == "admin"))
                    ->hidden(fn($record): bool => $record->id == Auth::user()->id),
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
