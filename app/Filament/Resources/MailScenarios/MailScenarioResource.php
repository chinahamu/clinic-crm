<?php

namespace App\Filament\Resources\MailScenarios;

use App\Filament\Resources\MailScenarios\Pages\CreateMailScenario;
use App\Filament\Resources\MailScenarios\Pages\EditMailScenario;
use App\Filament\Resources\MailScenarios\Pages\ListMailScenarios;
use App\Filament\Resources\MailScenarios\Schemas\MailScenarioForm;
use App\Filament\Resources\MailScenarios\Tables\MailScenariosTable;
use App\Models\MailScenario;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class MailScenarioResource extends Resource
{
    protected static ?string $model = MailScenario::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return MailScenarioForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return MailScenariosTable::configure($table);
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
            'index' => ListMailScenarios::route('/'),
            'create' => CreateMailScenario::route('/create'),
            'edit' => EditMailScenario::route('/{record}/edit'),
        ];
    }
}
