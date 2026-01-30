<?php

namespace App\Filament\Resources\MailScenarios\Pages;

use App\Filament\Resources\MailScenarios\MailScenarioResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMailScenarios extends ListRecords
{
    protected static string $resource = MailScenarioResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
