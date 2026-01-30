<?php

namespace App\Filament\Resources\MailScenarios\Schemas;

use Filament\Schemas\Schema;

class MailScenarioForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\Section::make('基本設定')
                    ->schema([
                        \Filament\Forms\Components\TextInput::make('name')
                            ->required()
                            ->label('シナリオ名'),
                        \Filament\Forms\Components\Toggle::make('is_active')
                            ->label('有効')
                            ->default(true),
                        \Filament\Forms\Components\TextInput::make('sender_name')
                            ->label('送信者名')
                            ->placeholder('未設定時はシステムデフォルト'),
                    ])->columns(2),

                \Filament\Forms\Components\Section::make('配信タイミング')
                    ->schema([
                        \Filament\Forms\Components\Select::make('trigger_type')
                            ->label('トリガー')
                            ->options([
                                'after_visit' => '来院後',
                            ])
                            ->required(),
                        \Filament\Forms\Components\TextInput::make('days_offset')
                            ->label('経過日数')
                            ->numeric()
                            ->suffix('日後')
                            ->required(),
                    ])->columns(2),

                \Filament\Forms\Components\Section::make('メール内容')
                    ->schema([
                        \Filament\Forms\Components\TextInput::make('subject')
                            ->label('件名')
                            ->required()
                            ->columnSpanFull(),
                        \Filament\Forms\Components\Textarea::make('body')
                            ->label('本文')
                            ->rows(10)
                            ->required()
                            ->helperText('変数が使えます: {name}, {date}, {clinic_name}')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
