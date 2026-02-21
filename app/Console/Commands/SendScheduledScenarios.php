<?php

namespace App\Console\Commands;

use App\Jobs\SendLineScenarioJob;
use App\Models\StepMailLog;
use Illuminate\Console\Command;

class SendScheduledScenarios extends Command
{
    protected $signature   = 'scenarios:send-scheduled
                              {--dry-run : 実際には送信せず対象件数だけ表示する}';

    protected $description = '送信予定時刻を過ぎた StepMailLog を LINE 配信キューに追加する';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');

        $logs = StepMailLog::due()
            ->with('user')
            ->get();

        $this->info("送信対象: {$logs->count()} 件" . ($dryRun ? ' [dry-run]' : ''));

        if ($dryRun) {
            return self::SUCCESS;
        }

        $dispatched = 0;
        $skipped    = 0;

        foreach ($logs as $log) {
            // line_id 未設定の場合は此時点で skipped
            if (empty($log->user?->line_id)) {
                $log->update(['status' => 'skipped']);
                $skipped++;
                continue;
            }

            SendLineScenarioJob::dispatch($log->id)->onQueue('default');
            $dispatched++;
        }

        $this->info("キュー追加: {$dispatched} 件 / スキップ(line_id未設定): {$skipped} 件");

        return self::SUCCESS;
    }
}
