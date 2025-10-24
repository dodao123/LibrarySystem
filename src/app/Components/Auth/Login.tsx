import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

interface LoginProps {
  onFlip: () => void;
}

export default function Login({ onFlip }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext to store user data
        login(data.user);
        
        // Redirect based on user role
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/Library');
        }
      } else {
        setError(data.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Lỗi kết nối, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        

        <div className="bg-black/60 backdrop-blur-md rounded-lg p-8 border border-white/10 w-full">
          <h2 className="text-center text-2xl font-light tracking-wide text-white mb-8">LOGIN HERE</h2>

          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="text-center text-sm py-2 rounded text-red-400 bg-red-500/10">
                {error}
              </div>
            )}

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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-2 border-green-500 bg-transparent cursor-pointer accent-green-500"
                />
                <span className="text-gray-300 text-sm">Remember me</span>
              </label>
              <a href="#" className="text-gray-300 text-sm hover:text-white transition">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition duration-300 mt-8 tracking-wide"
            >
              {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'LOGIN'}
            </button>
            {/* Login with Google */}
            <button
            onClick={() => console.log('Login with Google')}
            className="w-full flex items-center justify-center gap-2 mt-4 bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded transition duration-300 tracking-wide"
            >
            <Image 
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                alt="Google" 
                width={20}
                height={20}
                className="w-5 h-5"
            />
            LOGIN WITH GOOGLE
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-8 text-sm">
            <span className="text-gray-400">To Register New Account → </span>
            <button 
              onClick={onFlip}
              className="text-white border border-white px-3 py-1 hover:bg-white hover:text-black transition"
            >
              Click Here
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs mt-8">
          © 2017 Existing Login Form. All Rights Reserved | Design by W3layouts
        </div>
    </div>
  );
}