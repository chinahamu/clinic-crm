<?php

namespace Database\Seeders;

use App\Models\DocumentTemplate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SignedDocumentSeeder extends Seeder
{
    /**
     * 各患者の初回予約日の 1 日前（カウンセリング当日想定）に同意書署名記録を作成する。
     *
     * 対象テーブル : signed_documents
     * 前提シーダー : DocumentTemplateSeeder, PatientSeeder, ReservationSeeder
     */
    public function run(): void
    {
        $template = DocumentTemplate::first();
        if (! $template) {
            $this->command->warn('SignedDocumentSeeder: ドキュメントテンプレートが存在しません。');

            return;
        }

        $patients = User::role('patient')
            ->with(['reservations' => fn ($q) => $q->orderBy('start_time')->limit(1)])
            ->get();

        if ($patients->isEmpty()) {
            $this->command->warn('SignedDocumentSeeder: 患者が存在しません。');

            return;
        }

        $now     = now();
        $inserts = [];

        foreach ($patients as $patient) {
            $firstReservation = $patient->reservations->first();
            if (! $firstReservation) {
                continue;
            }

            // 冕等性: 同患者・同テンプレートの署名済みの場合はスキップ
            $exists = DB::table('signed_documents')
                ->where('user_id', $patient->id)
                ->where('document_template_id', $template->id)
                ->exists();

            if ($exists) {
                continue;
            }

            // 初回予約日の 1 日前（初回カウンセリング当日）
            $signedAt = Carbon::parse($firstReservation->start_time)->subDay();

            $inserts[] = [
                'user_id'              => $patient->id,
                'document_template_id' => $template->id,
                'staff_id'             => $firstReservation->staff_id,
                'reservation_id'       => $firstReservation->id,
                'contract_id'          => null,
                'signed_content'       => '施術同意書の内容に同意します。施術に伴うリスクについて説明を受け、理解した上で施術を受けることに同意します。',
                'signature_image_path' => 'signatures/demo/' . $patient->id . '.png',
                'signed_at'            => $signedAt,
                'ip_address'           => '127.0.0.1',
                'user_agent'           => 'Mozilla/5.0 (Demo Seeder)',
                'file_hash'            => md5('demo_signature_' . $patient->id),
                'file_path'            => 'documents/signed/' . $patient->id . '_consent.pdf',
                'signed_data'          => json_encode(['method' => 'tablet', 'device' => 'iPad']),
                'created_at'           => $now,
                'updated_at'           => $now,
            ];
        }

        foreach (array_chunk($inserts, 200) as $chunk) {
            DB::table('signed_documents')->insert($chunk);
        }

        $this->command->info(
            sprintf('SignedDocumentSeeder: %d 件の同意書署名記録を登録しました。', count($inserts))
        );
    }
}
