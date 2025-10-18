import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

interface RegisterProps {
  onFlip: () => void;
}

export default function Register({ onFlip }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage('Mật khẩu không khớp');
      return;
    }
    
    if (password.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setMessage('Đăng ký thành công!');
    console.log('Register attempt:', { email, password });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        

        <div className="bg-black/60 backdrop-blur-md rounded-lg p-8 border border-white/10 w-full">
          <h2 className="text-center text-2xl font-light tracking-wide text-white mb-8">REGISTER HERE</h2>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-green-500 text-white placeholder-gray-400 pb-3 focus:outline-none focus:border-green-400 transition text-sm tracking-wide"
              />
              <Mail className="absolute right-0 bottom-3 text-green-500" size={20} />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-green-500 text-white placeholder-gray-400 pb-3 focus:outline-none focus:border-green-400 transition text-sm tracking-wide"
              />
              <Lock className="absolute right-0 bottom-3 text-green-500" size={20} />
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="CONFIRM PASSWORD"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-green-500 text-white placeholder-gray-400 pb-3 focus:outline-none focus:border-green-400 transition text-sm tracking-wide"
              />
              <Lock className="absolute right-0 bottom-3 text-green-500" size={20} />
            </div>

            {/* Message */}
            {message && (
              <div className={`text-center text-sm py-2 rounded ${
                message.includes('thành công') 
                  ? 'text-green-400 bg-green-500/10' 
                  : 'text-red-400 bg-red-500/10'
              }`}>
                {message}
              </div>
            )}

            {/* Register Button */}
            <button
              onClick={handleRegister}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded transition duration-300 mt-8 tracking-wide"
            >
              REGISTER
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-8 text-sm">
            <span className="text-gray-400">Already have account? → </span>
            <button 
              onClick={onFlip}
              className="text-white border border-white px-3 py-1 hover:bg-white hover:text-black transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs mt-8">
          © 2017 Registration Form. All Rights Reserved | Design by W3layouts
        </div>
    </div>
  );
}