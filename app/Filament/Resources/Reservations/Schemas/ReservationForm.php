<?php

namespace App\Filament\Resources\Reservations\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ReservationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('menu_id')
                    ->required()
                    ->numeric(),
                TextInput::make('staff_id')
                    ->numeric(),
                TextInput::make('room_id')
                    ->numeric(),
                TextInput::make('machine_id')
                    ->numeric(),
                DateTimePicker::make('start_time')
                    ->required(),
                DateTimePicker::make('end_time')
                    ->required(),
                TextInput::make('reservation_type')
                    ->required()
                    ->default('new'),
                TextInput::make('status')
                    ->required()
                    ->default('confirmed'),
                TextInput::make('reception_status')
                    ->required()
                    ->default('pending'),
                Textarea::make('notes')
                    ->columnSpanFull(),
                TextInput::make('clinic_id')
                    ->numeric(),
            ]);
    }
}
