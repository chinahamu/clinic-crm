<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LineBindTokenService
{
    /**
     * 受付スタッフが患者に LINE バインド用 6桁トークンを発行する。
     * 既存の未使用トークンは削除してから新規発行する。
     *
     * @param int $userId 発行対象の患者 ID
     * @return string 6桁のトークン
     */
    public function issue(int $userId): string
    {
        DB::table('line_bind_tokens')
            ->where('user_id', $userId)
            ->delete();

        $token = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        DB::table('line_bind_tokens')->insert([
            'user_id'    => $userId,
            'token'      => $token,
            'expires_at' => now()->addMinutes(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Log::info("LINE bind token issued", ['user_id' => $userId]);

        return $token;
    }

    /**
     * LINEユーザー ID とトークンを照合し、User.line_id を更新する。
     *
     * ※ line_id は LINE Login（Socialite）と Messaging API で共通の UID。
     *    既に LINE Login 済みのユーザーはこのバインド不要。
     *
     * @param string $lineUserId LINE UID (U　1234...)
     * @param string $token      6桁のトークン
     * @return bool 紐付け成功/失敗
     */
    public function bind(string $lineUserId, string $token): bool
    {
        $record = DB::table('line_bind_tokens')
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            Log::warning("LINE bind token not found or expired", ['token' => $token]);
            return false;
        }

        // 既に別のユーザーが同じ line_id を持っていないか安全確認
        $conflict = User::where('line_id', $lineUserId)
            ->where('id', '!=', $record->user_id)
            ->exists();

        if ($conflict) {
            Log::warning("LINE bind conflict: line_id already bound to another user", [
                'line_id' => $lineUserId,
                'target_user_id' => $record->user_id,
            ]);
            return false;
        }

        User::where('id', $record->user_id)
            ->update(['line_id' => $lineUserId]);

        DB::table('line_bind_tokens')->where('token', $token)->delete();

        Log::info("LINE UID bound successfully", [
            'user_id' => $record->user_id,
            'line_id' => $lineUserId,
        ]);

        return true;
    }
}
