<?php

namespace App\Filament\Resources\ContractUsages\Pages;

use App\Filament\Resources\ContractUsages\ContractUsageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditContractUsage extends EditRecord
{
    protected static string $resource = ContractUsageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
