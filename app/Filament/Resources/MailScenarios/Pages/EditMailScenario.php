<?php

namespace App\Filament\Resources\MailScenarios\Pages;

use App\Filament\Resources\MailScenarios\MailScenarioResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMailScenario extends EditRecord
{
    protected static string $resource = MailScenarioResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
