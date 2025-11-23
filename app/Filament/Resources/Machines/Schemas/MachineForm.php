<?php

namespace App\Filament\Resources\Machines\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class MachineForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('type'),
                Toggle::make('is_active')
                    ->required(),
                TextInput::make('clinic_id')
                    ->numeric(),
            ]);
    }
}
