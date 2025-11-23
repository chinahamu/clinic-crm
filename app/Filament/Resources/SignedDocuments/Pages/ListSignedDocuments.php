<?php

namespace App\Filament\Resources\SignedDocuments\Pages;

use App\Filament\Resources\SignedDocuments\SignedDocumentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSignedDocuments extends ListRecords
{
    protected static string $resource = SignedDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
