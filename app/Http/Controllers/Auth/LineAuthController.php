<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class LineAuthController extends Controller
{
    /**
     * Redirect the user to the LINE authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToProvider()
    {
        return Socialite::driver('line')->redirect();
    }

    /**
     * Obtain the user information from LINE.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleProviderCallback()
    {
        try {
            $lineUser = Socialite::driver('line')->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['line' => 'LINE Login failed or was cancelled.']);
        }

        $user = User::where('line_id', $lineUser->getId())->first();

        if ($user) {
            Auth::login($user);
            return redirect()->intended(route('home'));
        }

        // Check if user exists by email to link account
        if ($lineUser->getEmail()) {
            $user = User::where('email', $lineUser->getEmail())->first();
             if ($user) {
                $user->update([
                    'line_id' => $lineUser->getId(),
                    'avatar' => $lineUser->getAvatar(),
                ]);
                Auth::login($user);
                return redirect()->intended(route('home'));
            }
        }

        // Create new user
        $user = User::create([
            'name' => $lineUser->getName() ?? 'LINE User',
            'email' => $lineUser->getEmail() ?? 'line_' . $lineUser->getId() . '@example.com', // Fallback email
            'password' => Hash::make(Str::random(24)),
            'line_id' => $lineUser->getId(),
            'avatar' => $lineUser->getAvatar(),
        ]);

        Auth::login($user);

        return redirect()->intended(route('home'));
    }
}
