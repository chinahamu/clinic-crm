<?php

namespace App\Filament\Resources\SignedDocuments;

use App\Filament\Resources\SignedDocuments\Pages\CreateSignedDocument;
use App\Filament\Resources\SignedDocuments\Pages\EditSignedDocument;
use App\Filament\Resources\SignedDocuments\Pages\ListSignedDocuments;
use App\Filament\Resources\SignedDocuments\Schemas\SignedDocumentForm;
use App\Filament\Resources\SignedDocuments\Tables\SignedDocumentsTable;
use App\Models\SignedDocument;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SignedDocumentResource extends Resource
{
    protected static ?string $model = SignedDocument::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function getModelLabel(): string
    {
        return '署名済み書類';
    }

    public static function getPluralModelLabel(): string
    {
        return '署名済み書類';
    }

    public static function getNavigationLabel(): string
    {
        return '署名済み書類';
    }

    public static function form(Schema $schema): Schema
    {
        return SignedDocumentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SignedDocumentsTable::configure($table);
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
            'index' => ListSignedDocuments::route('/'),
            'create' => CreateSignedDocument::route('/create'),
            'edit' => EditSignedDocument::route('/{record}/edit'),
        ];
    }
}
