import { useState } from 'react';
import { Coins, Mail, Lock, Building2, Phone, MapPin, Globe, CreditCard, Eye, EyeOff, ArrowLeft, Upload, Clock } from 'lucide-react';

interface AuctionHouseRegisterProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export function AuctionHouseRegister({ onSuccess, onBackToLogin }: AuctionHouseRegisterProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    shortName: '',
    legalAddress: '',
    inn: '',
    physicalAddress: '',
    workingHours: '',
    phone: '',
    website: '',
    routeMap: '',
    bankName: '',
    accountNumber: '',
    correspondentAccount: '',
    bik: '',
    recipient: '',
    logo: null as File | null,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      <div className="max-w-3xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl mb-4 shadow-lg">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent">
            Регистрация аукционного дома
          </h1>
          <p className="text-gray-600">Заполните данные организации</p>
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
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="info@auction-house.ru"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Пароль *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                  <div>
                    <label className="block text-gray-700 mb-2">Подтверждение пароля *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
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
                </div>
              </div>
            </div>

            {/* Блок 2: Данные организации */}
            <div>
              <h3 className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Данные организации
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Полное наименование *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder='ООО "Московский аукционный дом нумизматики"'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Краткое название *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.shortName}
                      onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="МАД Нумизматика"
                      required
                    />
                  </div>
                  <p className="text-gray-500 mt-1">Это название будет отображаться в интерфейсе</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">ИНН</label>
                    <input
                      type="text"
                      value={formData.inn}
                      onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Юридический адрес</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.legalAddress}
                        onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                        placeholder="г. Москва, ул. Ленина, д. 1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Блок 3: Контактные данные */}
            <div>
              <h3 className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Контактные данные
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Фактический адрес *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.physicalAddress}
                      onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="г. Москва, ул. Ленина, д. 1, оф. 101"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Время работы</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.workingHours}
                        onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                        placeholder="Пн-Пт: 9:00-18:00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Телефон *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                        placeholder="+7 (499) 123-45-67"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Веб-сайт</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="https://auction-house.ru"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Карта проезда</label>
                  <textarea
                    value={formData.routeMap}
                    onChange={(e) => setFormData({ ...formData, routeMap: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                    rows={3}
                    placeholder="Описание или ссылка на карту проезда"
                  />
                </div>
              </div>
            </div>

            {/* Блок 4: Платёжные реквизиты */}
            <div>
              <h3 className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Платёжные реквизиты
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Наименование банка</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="ПАО Сбербанк"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Расчётный счёт (Р/с)</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="40702810000000000000"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Корреспондентский счёт (К/с)</label>
                    <input
                      type="text"
                      value={formData.correspondentAccount}
                      onChange={(e) => setFormData({ ...formData, correspondentAccount: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="30101810000000000000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">БИК</label>
                    <input
                      type="text"
                      value={formData.bik}
                      onChange={(e) => setFormData({ ...formData, bik: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder="044525225"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Получатель</label>
                    <input
                      type="text"
                      value={formData.recipient}
                      onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                      placeholder='ООО "Название"'
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Блок 5: Логотип */}
            <div>
              <h3 className="text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Логотип
              </h3>
              <div>
                <label className="block text-gray-700 mb-2">Загрузить логотип</label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-20 h-20 rounded-lg border-2 border-gray-300 overflow-hidden flex-shrink-0">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-amber-500 transition-colors text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        {formData.logo ? formData.logo.name : 'Нажмите для выбора файла'}
                      </p>
                      <p className="text-gray-400">PNG, JPG до 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Блок 6: Согласия */}
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
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer mt-1"
                    required
                  />
                  <span className="ml-2 text-gray-700">
                    Я согласен с{' '}
                    <a href="#" className="text-amber-600 hover:text-amber-700">
                      правилами площадки
                    </a>{' '}
                    и{' '}
                    <a href="#" className="text-amber-600 hover:text-amber-700">
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
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer mt-1"
                    required
                  />
                  <span className="ml-2 text-gray-700">
                    Я согласен на{' '}
                    <a href="#" className="text-amber-600 hover:text-amber-700">
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
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
              >
                Зарегистрировать аукционный дом
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full flex items-center justify-center text-gray-600 hover:text-amber-600 transition-colors py-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Уже есть аккаунт? Войти
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
