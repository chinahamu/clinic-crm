<?php

namespace App\Filament\Resources\ContractUsages\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ContractUsageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('contract_id')
                    ->relationship('contract', 'id')
                    ->required(),
                Select::make('reservation_id')
                    ->relationship('reservation', 'id'),
                TextInput::make('used_count')
                    ->required()
                    ->numeric()
                    ->default(1),
                DatePicker::make('used_date')
                    ->required(),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
