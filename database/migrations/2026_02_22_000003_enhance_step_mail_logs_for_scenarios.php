<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('step_mail_logs', function (Blueprint $table) {
            // シナリオエンジン用カラムを追加
            // 既存の user_id / reservation_id / mail_type / sent_at はそのまま残存
            $table->foreignId('mail_scenario_id')
                  ->nullable()
                  ->constrained('mail_scenarios')
                  ->nullOnDelete()
                  ->after('reservation_id')
                  ->comment('実行元シナリオ');

            $table->timestamp('scheduled_at')
                  ->nullable()
                  ->after('mail_scenario_id')
                  ->comment('送信予定日時');

            $table->string('status', 20)
                  ->default('scheduled')
                  ->after('scheduled_at')
                  ->comment('scheduled / sent / failed / skipped');

            $table->text('rendered_message')
                  ->nullable()
                  ->after('status')
                  ->comment('差し込み変数展開済みの本文');

            // 送信待機ステータス索引（毎時コマンドが高適に検索できるように）
            $table->index(['status', 'scheduled_at'], 'idx_step_mail_logs_status_scheduled');
        });
    }

    public function down(): void
    {
        Schema::table('step_mail_logs', function (Blueprint $table) {
            $table->dropIndex('idx_step_mail_logs_status_scheduled');
            $table->dropConstrainedForeignId('mail_scenario_id');
            $table->dropColumn(['scheduled_at', 'status', 'rendered_message']);
        });
    }
};
