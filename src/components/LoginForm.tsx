import { useState } from 'react';
import { Coins, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onLogin: (email: string) => void;
}

export function LoginForm({ onForgotPassword, onRegister, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl mb-4 shadow-lg">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent text-[16px]">
            МБ-МАРКЕТ
          </h1>
          <p className="text-gray-600">Войдите в свой аккаунт</p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-gray-700 mb-2">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Запомнить меня и забыли пароль */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                />
                <span className="ml-2 text-gray-700">Запомнить меня</span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-amber-600 hover:text-amber-700 transition-colors"
              >
                Забыли пароль?
              </button>
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
            >
              Войти
            </button>
          </form>

          {/* Регистрация */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">Нет аккаунта? </span>
            <button
              onClick={onRegister}
              className="text-amber-600 hover:text-amber-700 transition-colors"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}