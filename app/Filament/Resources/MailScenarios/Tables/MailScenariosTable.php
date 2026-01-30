<?php

namespace App\Filament\Resources\MailScenarios\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;

class MailScenariosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('name')
                    ->label('シナリオ名')
                    ->searchable(),
                \Filament\Tables\Columns\TextColumn::make('trigger_type')
                    ->label('トリガー'),
                \Filament\Tables\Columns\TextColumn::make('days_offset')
                    ->label('日数オフセット')
                    ->numeric(),
                \Filament\Tables\Columns\ToggleColumn::make('is_active')
                    ->label('有効'),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
