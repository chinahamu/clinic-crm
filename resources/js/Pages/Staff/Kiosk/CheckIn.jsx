import React, { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function CheckIn() {
    const [scanResult, setScanResult] = useState(null); // null, 'success', 'error'
    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Ref to track processing state inside callback closure
    const isProcessingRef = useRef(false);

    useEffect(() => {
        isProcessingRef.current = isProcessing;
    }, [isProcessing]);

    const playSuccessSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
            oscillator.frequency.setValueAtTime(1760, audioCtx.currentTime + 0.1); // A6 (Ping-Pong)

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    const handleScan = async (decodedText) => {
        if (isProcessingRef.current) return;

        setIsProcessing(true);

        try {
            let data;
            try {
                data = JSON.parse(decodedText);
            } catch (e) {
                // Not JSON, ignore or error
                throw new Error('Invalid Format');
            }

            if (data.type !== 'checkin' || !data.user_id) {
                throw new Error('Invalid QR Data');
            }

            const response = await fetch(route('staff.kiosk.check-in.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                },
                body: JSON.stringify({ user_id: data.user_id })
            });

            const result = await response.json();

            if (response.ok) {
                // Success or "Already checked in" (which returns 200/JSON with success usually)
                // My controller returns 200 for "Already checked in" with success=true
                playSuccessSound();
                setScanResult('success');
                setUserName(result.user_name || 'ゲスト');
                setMessage(result.message || '受付いたしました');
            } else {
                // 404 or other errors
                setScanResult('error');
                setMessage(result.message || 'エラーが発生しました');
            }

        } catch (error) {
            console.error(error);
            setScanResult('error');
            setMessage('QRコードを読み取れませんでした');
        }

        // Reset after 3 seconds
        setTimeout(() => {
            setScanResult(null);
            setMessage('');
            setUserName('');
            setIsProcessing(false);
        }, 3000);
    };

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        scanner.render(handleScan, (errorMessage) => {
            // parse error, ignore
        });

        // Cleanup
        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <Head title="セルフチェックイン" />

            {/* Header / Brand */}
            <div className="absolute top-0 w-full bg-white shadow-sm p-4 z-10 text-center">
                <h1 className="text-xl font-bold text-gray-800">Clinic Check-in</h1>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden mt-16 relative">
                {/* Camera Area */}
                <div id="reader" className="w-full bg-black"></div>

                <div className="p-6 text-center">
                    <p className="text-gray-500 font-medium">QRコードをカメラにかざしてください</p>
                </div>

                {/* Overlay for Feedback */}
                {scanResult && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center z-20 transition-opacity duration-300 ${scanResult === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'} backdrop-blur-sm`}>
                        <div className="bg-white p-8 rounded-full shadow-lg mb-6 animate-bounce">
                            {scanResult === 'success' ? (
                                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>

                        {userName && (
                            <h2 className="text-3xl font-bold text-white mb-2">{userName} 様</h2>
                        )}
                        <p className="text-2xl text-white font-medium">{message}</p>
                    </div>
                )}
            </div>

            <div className="mt-8 text-gray-400 text-sm">
                &copy; Clinic CRM Self Check-in System
            </div>
        </div>
    );
}
