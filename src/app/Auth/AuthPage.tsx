"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Login from "../Components/Auth/Login";
import Register from "../Components/Auth/Register";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [isFlipped, setIsFlipped] = useState(false);
    const router = useRouter();

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{
                backgroundImage: 'url(https://wallpapercave.com/wp/wp2771912.jpg)'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Back Button fixed ở góc trái */}
            <button
                onClick={() => router.back()}
                className="fixed top-4 left-4 w-30 h-10 bg-white/20 hover:bg-white/40 text-white flex items-center justify-center rounded-lg shadow-lg transition z-50"
                title="Go Back"
            >
                <ArrowLeft size={20} />
            </button>

            {/* Flip Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="flip-container">
                    <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <Login onFlip={handleFlip} />
                            </div>
                            <div className="flip-card-back">
                                <Register onFlip={handleFlip} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
