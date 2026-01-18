import { useState } from 'react';
import { Coins, Mail, Lock, User, Phone, MapPin, Globe, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface ParticipantRegisterProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export function ParticipantRegister({ onSuccess, onBackToLogin }: ParticipantRegisterProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    entityType: 'individual' as 'individual' | 'legal',
    name: '',
    country: '',
    city: '',
    phone: '',
    contactEmail: true,
    contactPhone: false,
    contactInternal: true,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert('Необходимо принять все соглашения');
      return;
    }
    onSuccess();
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Регистрация участника
          </h1>
          <p className="text-gray-600">Заполните данные для регистрации</p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Блок 1: Данные учётной записи */}
            <div>
              <h3 className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Данные учётной записи
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Пароль *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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

                <div>
                  <label className="block text-gray-700 mb-2">Подтверждение пароля *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Ник (отображаемое имя) *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Ваш ник для отображения"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Блок 2: Личные данные */}
            <div>
              <h3 className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Личные данные
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Тип лица *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="entityType"
                        checked={formData.entityType === 'individual'}
                        onChange={() => setFormData({ ...formData, entityType: 'individual' })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700">Физическое лицо</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="entityType"
                        checked={formData.entityType === 'legal'}
                        onChange={() => setFormData({ ...formData, entityType: 'legal' })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700">Юридическое лицо</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    {formData.entityType === 'individual' ? 'Имя' : 'Название организации'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder={formData.entityType === 'individual' ? 'Иван Иванов' : 'ООО "Название"'}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Страна</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Россия"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Город</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Москва"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Блок 3: Контакты */}
            <div>
              <h3 className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Контакты
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Телефон</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Способ связи</label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700">Телефон</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.contactInternal}
                        onChange={(e) => setFormData({ ...formData, contactInternal: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="ml-2 text-gray-700">Внутренняя переписка</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Блок 4: Согласия */}
            <div>
              <h3 className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Согласия
              </h3>
              <div className="space-y-3">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer mt-1"
                    required
                  />
                  <span className="ml-2 text-gray-700">
                    Я согласен с{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      правилами торгов
                    </a>{' '}
                    и{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      договором оферты
                    </a>{' '}
                    *
                  </span>
                </label>

                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer mt-1"
                    required
                  />
                  <span className="ml-2 text-gray-700">
                    Я согласен на{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      обработку персональных данных
                    </a>{' '}
                    *
                  </span>
                </label>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Зарегистрироваться
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Уже зарегистрированы? Войти
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
