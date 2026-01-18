import { useState } from 'react';
import { Coins, Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function ForgotPassword({ onBack, onSuccess }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="w-full max-w-md">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl mb-4 shadow-lg">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent">
            Восстановление пароля
          </h1>
          <p className="text-gray-600">
            Введите email для получения ссылки восстановления
          </p>
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

            {/* Информация */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800">
                На указанный email будет отправлена ссылка для восстановления пароля. 
                Проверьте папку спам, если письмо не приходит.
              </p>
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
            >
              Отправить ссылку для восстановления
            </button>
          </form>

          {/* Назад */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к входу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
