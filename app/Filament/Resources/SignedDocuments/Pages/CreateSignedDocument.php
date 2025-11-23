<?php

namespace App\Filament\Resources\SignedDocuments\Pages;

use App\Filament\Resources\SignedDocuments\SignedDocumentResource;
use Filament\Resources\Pages\CreateRecord;

class CreateSignedDocument extends CreateRecord
{
    protected static string $resource = SignedDocumentResource::class;
}
