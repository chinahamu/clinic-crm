<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\LineBindTokenService;
use Illuminate\Http\JsonResponse;

class LineBindTokenController extends Controller
{
    public function __construct(
        private readonly LineBindTokenService $tokenService
    ) {}

    /**
     * 患者に対して 6桁 LINE バインドトークンを発行する。
     *
     * POST /staff/patients/{patient}/issue-line-token
     *
     * レスポンス例:
     *   {
     *     "token": "048291",
     *     "message": "10分以内にLINEで「連携 048291」と送信してください。"
     *   }
     */
    public function issue(User $patient): JsonResponse
    {
        $token = $this->tokenService->issue($patient->id);

        return response()->json([
            'token'   => $token,
            'message' => "10分以内にLINEで「連携 {$token}」と送信してください。",
        ]);
    }
}
