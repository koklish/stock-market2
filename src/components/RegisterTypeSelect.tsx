import { Users, Building2, Coins, ArrowLeft } from 'lucide-react';

interface RegisterTypeSelectProps {
  onSelectParticipant: () => void;
  onSelectAuctionHouse: () => void;
  onBackToLogin: () => void;
}

export function RegisterTypeSelect({
  onSelectParticipant,
  onSelectAuctionHouse,
  onBackToLogin
}: RegisterTypeSelectProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="w-full max-w-4xl">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl mb-4 shadow-lg">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent">
            Регистрация
          </h1>
          <p className="text-gray-600">Выберите тип регистрации</p>
        </div>

        {/* Карточки выбора */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Участник */}
          <button
            onClick={onSelectParticipant}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 text-left group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h2 className="mb-3 text-gray-800">Я покупатель / продавец</h2>
            <p className="text-gray-600 mb-4">
              Регистрация как участник аукционов. Вы сможете покупать и продавать монеты на площадке.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Участие в торгах</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Продажа монет</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Доступ к форуму</span>
              </li>
            </ul>
          </button>

          {/* Аукционный дом */}
          <button
            onClick={onSelectAuctionHouse}
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 text-left group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h2 className="mb-3 text-gray-800">Я аукционный дом</h2>
            <p className="text-gray-600 mb-4">
              Регистрация для организаторов аукционов. Управление торгами и каталогами.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Создание аукционов</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Управление лотами</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">✓</span>
                <span>Бухгалтерская отчетность</span>
              </li>
            </ul>
          </button>
        </div>

        {/* Назад к логину */}
        <div className="text-center">
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center text-gray-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Уже зарегистрированы? Войти
          </button>
        </div>
      </div>
    </div>
  );
}
