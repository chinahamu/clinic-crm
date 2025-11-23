<?php

namespace App\Filament\Resources\SignedDocuments\Pages;

use App\Filament\Resources\SignedDocuments\SignedDocumentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSignedDocument extends EditRecord
{
    protected static string $resource = SignedDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
