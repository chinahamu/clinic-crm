<?php

namespace App\Filament\Resources\ContractUsages;

use App\Filament\Resources\ContractUsages\Pages\CreateContractUsage;
use App\Filament\Resources\ContractUsages\Pages\EditContractUsage;
use App\Filament\Resources\ContractUsages\Pages\ListContractUsages;
use App\Filament\Resources\ContractUsages\Schemas\ContractUsageForm;
use App\Filament\Resources\ContractUsages\Tables\ContractUsagesTable;
use App\Models\ContractUsage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ContractUsageResource extends Resource
{
    protected static ?string $model = ContractUsage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ContractUsageForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ContractUsagesTable::configure($table);
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
            'index' => ListContractUsages::route('/'),
            'create' => CreateContractUsage::route('/create'),
            'edit' => EditContractUsage::route('/{record}/edit'),
        ];
    }
}
