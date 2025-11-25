<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DocumentTemplate;

class DocumentTemplateSeeder extends Seeder
{
    public function run()
    {
        $templates = [
            [
                'title' => '医療脱毛施術同意書',
                'type' => 'consent',
                'content' => '<h1>医療脱毛施術同意書</h1>
<p>私、<strong>{{ patient_name }}</strong>（以下「甲」という）は、貴院（以下「乙」という）において医療脱毛施術を受けるにあたり、以下の事項について十分な説明を受け、その内容を理解し、同意いたしました。</p>

<h2>1. 施術の内容</h2>
<p>医療用レーザーを使用し、毛根のメラニン色素に熱を与え、発毛組織を破壊する施術です。</p>

<h2>2. 効果と回数</h2>
<p>毛周期に合わせて複数回の照射が必要です。個人差がありますが、通常5回〜10回程度の施術が必要です。</p>

<h2>3. 副作用・リスク</h2>
<ul>
    <li>赤み、腫れ、ヒリヒリ感が生じることがあります。</li>
    <li>稀に毛嚢炎、火傷、色素沈着が起こる可能性があります。</li>
    <li>硬毛化・増毛化が起こる可能性があります。</li>
</ul>

<h2>4. 施術後の注意点</h2>
<ul>
    <li>日焼けを避けてください。</li>
    <li>当日の入浴、激しい運動、飲酒は控えてください。</li>
    <li>保湿を十分に行ってください。</li>
</ul>

<p>以上の説明を受け、疑問点は解消されましたので、施術を受けることに同意します。</p>

<p>日付: {{ current_date }}</p>
<p>署名者: {{ patient_name }}</p>',
                'is_active' => true,
            ],
            [
                'title' => 'フェイシャル施術同意書',
                'type' => 'consent',
                'content' => '<h1>フェイシャル施術同意書</h1>
<p>私、<strong>{{ patient_name }}</strong>は、フェイシャル施術を受けるにあたり、以下の内容に同意します。</p>

<h2>施術内容</h2>
<p>ケミカルピーリングおよびイオン導入による肌質改善治療。</p>

<h2>注意事項</h2>
<ul>
    <li>施術中にピリピリとした刺激を感じることがあります。</li>
    <li>施術後は肌が乾燥しやすくなるため、十分な保湿が必要です。</li>
    <li>施術後1週間は、スクラブ洗顔や顔剃りを控えてください。</li>
</ul>

<p>日付: {{ current_date }}</p>
<p>署名者: {{ patient_name }}</p>',
                'is_active' => true,
            ],
            [
                'title' => '美容医療サービス契約書',
                'type' => 'contract',
                'content' => '<h1>美容医療サービス契約書</h1>
<p>本契約書は、<strong>{{ clinic_name }}</strong>（以下「甲」）と<strong>{{ patient_name }}</strong>（以下「乙」）との間で締結される美容医療サービスに関する契約である。</p>

<h2>第1条（目的）</h2>
<p>甲は乙に対し、所定の美容医療サービスを提供し、乙はこれに対し対価を支払う。</p>

<h2>第2条（契約期間）</h2>
<p>本契約の有効期間は、契約締結日より1年間とする。</p>

<h2>第3条（中途解約）</h2>
<p>乙は、クーリング・オフ期間経過後であっても、法令の定めに従い、将来に向かって本契約を解除することができる。</p>

<p>日付: {{ current_date }}</p>
<p>甲: {{ clinic_name }} 代表者</p>
<p>乙: {{ patient_name }}</p>',
                'is_active' => true,
            ],
            [
                'title' => '施術前確認事項（説明書）',
                'type' => 'explanation',
                'content' => '<h1>施術前確認事項</h1>
<p>本日の施術を受けるにあたり、以下の項目をご確認ください。</p>

<ol>
    <li>現在、妊娠中または授乳中ではありませんか？</li>
    <li>直近2週間以内に過度な日焼けをしていませんか？</li>
    <li>施術部位に傷や皮膚炎はありませんか？</li>
    <li>光線過敏症の既往はありませんか？</li>
</ol>

<p>上記項目に該当する場合、施術をお断りすることがあります。</p>
<p>担当スタッフ: {{ staff_name }}</p>',
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            DocumentTemplate::create($template);
        }
    }
}
