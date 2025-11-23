<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Faker\Factory as FakerFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // 日本語ロケールの Faker を明示して使用
        $ja = FakerFactory::create('ja_JP');

        $phonePrefix = $ja->randomElement(['090', '080', '070']);
        $phone = $phonePrefix.'-'.$ja->numerify('####').'-'.$ja->numerify('####');

        $cautionFlag = $ja->boolean(10); // 10% の確率で注意フラグ
        return [
            'name' => $ja->name(),
            'email' => $ja->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),

            // 追加の日本語向けユーザーデータ
            'phone' => $phone,
            'birthday' => $ja->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            'gender' => $ja->randomElement(['男性', '女性', 'その他']),
            'address' => $ja->address(),
            'referral_source' => $ja->randomElement(['紹介', '広告', 'ウェブ検索', 'SNS', 'その他']),
            'consent_status' => $ja->boolean(80), // 同意している割合を高めに設定
            'caution_flag' => $cautionFlag,
            'caution_details' => $cautionFlag ? $ja->sentence() : null,
            'last_visit_at' => $ja->dateTimeBetween('-2 years', 'now')->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
