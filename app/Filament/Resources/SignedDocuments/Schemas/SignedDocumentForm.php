<?php

namespace App\Filament\Resources\SignedDocuments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class SignedDocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('document_template_id')
                    ->relationship('documentTemplate', 'title')
                    ->required(),
                Select::make('staff_id')
                    ->relationship('staff', 'name'),
                Select::make('reservation_id')
                    ->relationship('reservation', 'id'),
                Select::make('contract_id')
                    ->relationship('contract', 'id'),
                Textarea::make('signed_content')
                    ->required()
                    ->columnSpanFull(),
                FileUpload::make('signature_image_path')
                    ->image()
                    ->required(),
                DateTimePicker::make('signed_at')
                    ->required(),
                TextInput::make('ip_address'),
                TextInput::make('user_agent'),
            ]);
    }
}
