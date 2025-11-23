<?php

namespace App\Filament\Resources\ContractUsages\Pages;

use App\Filament\Resources\ContractUsages\ContractUsageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListContractUsages extends ListRecords
{
    protected static string $resource = ContractUsageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
