<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            [
                'name' => '白玉点滴(グルタチオン600mg)',
                'description' => '美白・美肌効果が期待できる点滴です。',
                'price' => 6600,
                'duration_minutes' => 30,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'スーパー白⽟点滴(グルタチオン2,000mg)',
                'description' => '高濃度のグルタチオンでより高い美白効果が期待できます。',
                'price' => 11000,
                'duration_minutes' => 45,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => '白⽟点滴ビタミンCウルトラ',
                'description' => 'グルタチオン2,000mg＋高濃度ビタミンC25gのスペシャル点滴。',
                'price' => 16500,
                'duration_minutes' => 60,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'プラセンタ注射',
                'description' => '疲労回復、美肌、更年期障害の改善などに。',
                'price' => 1650,
                'duration_minutes' => 15,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'ニンニク注射',
                'description' => '疲労回復、活力増進に即効性があります。',
                'price' => 2200,
                'duration_minutes' => 15,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'マイヤーズカクテル点滴',
                'description' => 'ビタミンやミネラルをバランスよく配合し、自然治癒力を高めます。',
                'price' => 8800,
                'duration_minutes' => 45,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'ダイエット点滴',
                'description' => 'αリポ酸200mg＋L-カルニチンで代謝を促進し、脂肪燃焼をサポート。',
                'price' => 8800,
                'duration_minutes' => 45,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'スーパー抗酸化点滴',
                'description' => '強力な抗酸化作用で老化防止や病気予防に。',
                'price' => 13200,
                'duration_minutes' => 45,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => '高濃度ビタミンC点滴 25g',
                'description' => '美白、免疫力向上、疲労回復など多岐にわたる効果。',
                'price' => 11000,
                'duration_minutes' => 60,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'ベビーサイトカイン点滴',
                'description' => '幹細胞培養上清液を使用し、細胞レベルでの若返りを目指します。',
                'price' => 55000,
                'duration_minutes' => 60,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'NMN点滴療法',
                'description' => '次世代のアンチエイジング療法。若々しさを取り戻したい方に。',
                'price' => 44000,
                'duration_minutes' => 60,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'エクソソーム点滴療法',
                'description' => '細胞間の情報伝達物質エクソソームを投与し、全身の再生を促します。',
                'price' => 88000,
                'duration_minutes' => 60,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            // 美容皮膚科メニュー
            [
                'name' => '糸リフト（スレッドリフト）',
                'description' => 'メスを使わずに顔の側面から糸を入れて引き上げる施術です。',
                'price' => 300000,
                'duration_minutes' => 60,
                'required_role' => 'doctor',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'HIFU：ニューダブロ',
                'description' => '切らないリフトアップ治療。SMAS層に働きかけます。',
                'price' => 50000,
                'duration_minutes' => 45,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => \App\Models\Machine::where('type', 'hifu')->first()?->id,
            ],
            [
                'name' => 'ピコレーザー',
                'description' => '肌への負担を軽減しつつ、しみやしわを改善します。',
                'price' => 20000,
                'duration_minutes' => 30,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => \App\Models\Machine::where('type', 'laser')->first()?->id,
            ],
            [
                'name' => 'ハイドラフェイシャル',
                'description' => 'ピーリング・吸引・美容液導入の機能を兼ね備えたトリートメント。',
                'price' => 15000,
                'duration_minutes' => 30,
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'ボトックス注射',
                'description' => '筋肉をリラックスさせ、しわを軽減する治療です。',
                'price' => 20000,
                'duration_minutes' => 15,
                'required_role' => 'doctor',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
            [
                'name' => 'ヒアルロン酸注射',
                'description' => '内側からしわや溝を目立たなくさせ、ボリュームを補います。',
                'price' => 50000,
                'duration_minutes' => 30,
                'required_role' => 'doctor',
                'required_room_type' => 'treatment',
                'required_machine_id' => null,
            ],
        ];

        foreach ($menus as $menuData) {
            Menu::create($menuData);
        }
    }
}
