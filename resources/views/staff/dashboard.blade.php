<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>スタッフダッシュボード - Clinic CRM</title>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="bg-gray-100">
    <nav class="bg-white shadow mb-8 border-b-4 border-green-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <span class="font-bold text-xl text-green-600">Clinic CRM Staff</span>
                    </div>
                </div>
                <div class="flex items-center">
                    <span class="text-gray-700 mr-4">{{ Auth::guard('staff')->user()->name }} (スタッフ)</span>
                    <form method="POST" action="{{ route('staff.logout') }}">
                        @csrf
                        <button type="submit" class="text-red-600 hover:text-red-800">ログアウト</button>
                    </form>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6 bg-white border-b border-gray-200">
                スタッフ専用管理画面へようこそ。
            </div>
        </div>
    </div>
</body>
</html>
