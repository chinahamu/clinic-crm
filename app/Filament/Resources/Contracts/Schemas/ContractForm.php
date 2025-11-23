<?php

namespace App\Filament\Resources\Contracts\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ContractForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('menu_id')
                    ->relationship('menu', 'name')
                    ->required(),
                Select::make('clinic_id')
                    ->relationship('clinic', 'name'),
                DatePicker::make('contract_date')
                    ->required(),
                TextInput::make('total_count')
                    ->required()
                    ->numeric(),
                TextInput::make('remaining_count')
                    ->required()
                    ->numeric(),
                TextInput::make('total_price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                DatePicker::make('expiration_date'),
                TextInput::make('status')
                    ->required()
                    ->default('active'),
            ]);
    }
}
