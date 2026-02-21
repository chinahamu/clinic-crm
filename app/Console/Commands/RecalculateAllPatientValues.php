<?php

namespace App\Console\Commands;

use App\Jobs\PatientValueCalculateJob;
use App\Models\User;
use Illuminate\Console\Command;

class RecalculateAllPatientValues extends Command
{
    /**
     * @var string
     */
    protected $signature = 'patients:recalculate-values
                            {--chunk=100 : 一度に処理する件数}';

    /**
     * @var string
     */
    protected $description = '全患者の PatientValue（LTV/来院回数/ステータス）をキューバッチで再計算';

    public function handle(): int
    {
        $chunkSize = (int) $this->option('chunk');
        $total     = User::count();

        $this->info("対象患者数: {$total}件 (チャンクサイズ: {$chunkSize})");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        User::select('id')->chunk($chunkSize, function ($users) use ($bar) {
            foreach ($users as $user) {
                PatientValueCalculateJob::dispatch($user->id);
                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine();
        $this->info("全ジョブをキューに追加しました。`php artisan queue:work` で処理してください。");

        return self::SUCCESS;
    }
}
