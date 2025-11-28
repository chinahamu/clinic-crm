<?php

namespace App\Http\Controllers;

use App\Mail\InquiryReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // Send email to admin
        Mail::to('info@meta-alchemist.co.jp')->send(new InquiryReceived($validated));

        return back()->with('success', 'お問い合わせを受け付けました。担当者よりご連絡いたします。');
    }
}
