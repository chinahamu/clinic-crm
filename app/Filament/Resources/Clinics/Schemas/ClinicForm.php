<?php

namespace App\Filament\Resources\Clinics\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ClinicForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->extraInputAttributes(['class' => 'py-3']),
                TextInput::make('name')
                    ->required()
                    ->extraInputAttributes(['class' => 'py-3']),
                TextInput::make('address'),
                TextInput::make('phone')
                    ->tel(),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
