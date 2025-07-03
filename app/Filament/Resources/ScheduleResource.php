<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ScheduleResource\Pages;
use App\Models\Schedule;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ScheduleResource extends Resource
{
    protected static ?string $model = Schedule::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationLabel = 'Jadwal Pengujian Laboratorium';

    protected static ?string $modelLabel = 'Jadwal Pengujian Laboratorium';

    protected static ?string $pluralModelLabel = 'Jadwal Pengujian Laboratorium';
    protected static ?string $navigationGroup = 'Manajemen Pengujian';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Form tidak akan digunakan karena tidak ada create/update
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('date')
                    ->label('Tanggal')
                    ->date('d F Y')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('test.name')
                    ->label('Nama Test')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('test.laboratory.name')
                    ->label('Laboratorium')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('available_slots')
                    ->label('Slot Tersedia')
                    ->numeric()
                    ->sortable()
                    ->badge()
                    ->color(fn (string $state): string => match (true) {
                        $state > 10 => 'success',
                        $state > 5 => 'warning',
                        default => 'danger',
                    }),
                Tables\Columns\TextColumn::make('used_slots')
                    ->label('Slot Terpakai')
                    ->badge()
                    ->color('info'),
                Tables\Columns\TextColumn::make('remaining_slots')
                    ->label('Slot Tersisa')
                    ->badge()
                    ->color(fn (string $state): string => match (true) {
                        $state > 5 => 'success',
                        $state > 0 => 'warning',
                        default => 'danger',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d F Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Filter::make('date_range')
                    ->form([
                        Forms\Components\DatePicker::make('date_from')
                            ->label('Dari Tanggal')
                            ->placeholder('Pilih tanggal mulai'),
                        Forms\Components\DatePicker::make('date_to')
                            ->label('Sampai Tanggal')
                            ->placeholder('Pilih tanggal selesai'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['date_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('date', '>=', $date),
                            )
                            ->when(
                                $data['date_to'],
                                fn (Builder $query, $date): Builder => $query->whereDate('date', '<=', $date),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['date_from']) {
                            $indicators[] = 'Dari: ' . \Carbon\Carbon::parse($data['date_from'])->format('d F Y');
                        }
                        if ($data['date_to']) {
                            $indicators[] = 'Sampai: ' . \Carbon\Carbon::parse($data['date_to'])->format('d F Y');
                        }
                        return $indicators;
                    }),
                Tables\Filters\SelectFilter::make('test_id')
                    ->label('Test')
                    ->relationship('test', 'name')
                    ->searchable()
                    ->preload(),
                Tables\Filters\SelectFilter::make('laboratory')
                    ->label('Laboratorium')
                    ->relationship('test.laboratory', 'name')
                    ->searchable()
                    ->preload(),
                Filter::make('available_slots')
                    ->form([
                        Forms\Components\TextInput::make('min_slots')
                            ->label('Minimum Slot')
                            ->numeric()
                            ->placeholder('Masukkan jumlah minimum'),
                        Forms\Components\TextInput::make('max_slots')
                            ->label('Maximum Slot')
                            ->numeric()
                            ->placeholder('Masukkan jumlah maksimum'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['min_slots'],
                                fn (Builder $query, $minSlots): Builder => $query->where('available_slots', '>=', $minSlots),
                            )
                            ->when(
                                $data['max_slots'],
                                fn (Builder $query, $maxSlots): Builder => $query->where('available_slots', '<=', $maxSlots),
                            );
                    })
                    ->indicateUsing(function (array $data): array {
                        $indicators = [];
                        if ($data['min_slots']) {
                            $indicators[] = 'Min slot: ' . $data['min_slots'];
                        }
                        if ($data['max_slots']) {
                            $indicators[] = 'Max slot: ' . $data['max_slots'];
                        }
                        return $indicators;
                    }),
            ])
            ->actions([
                // Tables\Actions\ViewAction::make()
                //     ->label('Lihat Detail'),
            ])
            ->bulkActions([
                // Tidak ada bulk actions
            ])
            ->defaultSort('date', 'desc')
            ->emptyStateHeading('Tidak ada jadwal pengujian')
            ->emptyStateDescription('Belum ada jadwal pengujian laboratorium yang tersedia.')
            ->striped();
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
            'index' => Pages\ListSchedules::route('/'),
            // 'view' => Pages\ViewSchedule::route('/{record}'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }
}
