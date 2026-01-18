import { useState, useEffect } from 'react';
import {
  Gavel,
  UserCheck,
  Trophy,
  FileText,
  User,
  Bell,
  LogOut,
  Grid3x3,
  List,
  Search,
  Filter,
  Calendar,
  Package,
  Clock,
  Building2,
  TrendingUp,
  Check,
  X
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { AuctionDetail } from './AuctionDetail';
import { TradingScreen } from './TradingScreen';
import { ParticipationRequestForm } from './ParticipationRequestForm';
import { DeliverySelectionForm, DeliveryFormData } from './DeliverySelectionForm';
import { PaymentForm, PaymentFormData } from './PaymentForm';

type AuctionStatus = 'published' | 'planned' | 'active' | 'completed';

interface Auction {
  id: number;
  title: string;
  auctionHouse?: string;
  image: string;
  date: string;
  status: AuctionStatus;
  lotsCount: number;
  minBidStep?: number;
  commission?: number;
}

interface ParticipantDashboardProps {
  onLogout: () => void;
}

export function ParticipantDashboard({ onLogout }: ParticipantDashboardProps) {
  console.log('ParticipantDashboard rendering');
  const [activeSection, setActiveSection] = useState<'auctions' | 'participations' | 'won-lots' | 'documents' | 'profile' | 'notifications'>('auctions');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
  const [showTrading, setShowTrading] = useState(false);
  const [showParticipationForm, setShowParticipationForm] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [selectedLotForDelivery, setSelectedLotForDelivery] = useState<{ id: number; title: string; price: number } | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedLotForPayment, setSelectedLotForPayment] = useState<{ id: number; title: string; price: number } | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'delivery' | 'payment'>('delivery');
  const [participatingAuctions, setParticipatingAuctions] = useState<number[]>([]); // Пустой массив - никто пока не участвует

  // Тестовые данные участника
  const participantData = {
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    phone: '+7 (999) 123-45-67',
    company: 'ООО "АгрТорг"'
  };

  // Функция с тестовыми аукционами по умолчанию
  const getDefaultAuctions = (): Auction[] => {
    return [
      {
        id: 1,
        title: 'Редкие монеты Российской Империи',
        auctionHouse: 'Империал Аукцион',
        image: 'https://images.unsplash.com/photo-1619735142352-4a6d3e0c5a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        date: '2025-12-15 14:00',
        status: 'active',
        lotsCount: 156,
        minBidStep: 500
      },
      {
        id: 2,
        title: 'Коллекция орденов и медалей СССР',
        auctionHouse: 'Нумизматический Дом',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        date: '2025-12-20 16:00',
        status: 'published',
        lotsCount: 89,
        minBidStep: 1000
      },
      {
        id: 3,
        title: 'Антикварные украшения XIX века',
        auctionHouse: 'Империал Аукцион',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        date: '2025-12-22 15:00',
        status: 'planned',
        lotsCount: 67,
        minBidStep: 2000
      },
      {
        id: 4,
        title: 'Банкноты и бумажные деньги мира',
        auctionHouse: 'Нумизматический Дом',
        image: 'https://images.unsplash.com/photo-1633769573304-90d2d44eef0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        date: '2025-12-10 18:00',
        status: 'completed',
        lotsCount: 203,
        minBidStep: 300
      }
    ];
  };

  // Загружаем аукционы из localStorage
  const [auctions, setAuctions] = useState<Auction[]>(() => {
    const saved = localStorage.getItem('auctions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Преобразуем формат из аукционного дома (с commission) в формат участника (с minBidStep)
        return parsed.map((a: any) => ({
          id: a.id,
          title: a.title,
          auctionHouse: 'Империал Аукцион', // Можно получить из данных аукционного дома если нужно
          image: a.image,
          date: a.date,
          status: a.status,
          lotsCount: a.lotsCount,
          minBidStep: a.commission ? Math.round(a.commission * 100) : 500 // Примерное преобразование
        }));
      } catch {
        return getDefaultAuctions();
      }
    }
    return getDefaultAuctions();
  });

  // Синхронизируем с localStorage при изменении
  useEffect(() => {
    // Проверяем localStorage на новые аукционы
    const stored = localStorage.getItem('auctions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const converted = parsed.map((a: any) => ({
          id: a.id,
          title: a.title,
          auctionHouse: 'Империал Аукцион',
          image: a.image,
          date: a.date,
          status: a.status,
          lotsCount: a.lotsCount,
          minBidStep: a.commission ? Math.round(a.commission * 100) : 500
        }));
        setAuctions(converted);
      } catch (e) {
        console.error('Ошибка при загрузке аукционов:', e);
      }
    }
  }, []); // Загружаем только при монтировании

  const getStatusBadge = (status: any) => {
    const statusMap: Record<string, { label: string; variant: "info" | "planned" | "success" | "success-dark" | "neutral" | "warning" }> = {
      'published': { label: 'Опубликован', variant: 'info' },
      'planned': { label: 'Запланирован', variant: 'planned' },
      'active': { label: 'Торги', variant: 'success' },
      'completed': { label: 'Завершён', variant: 'success-dark' },
      'draft': { label: 'Черновик', variant: 'neutral' },
      'awaiting-payment': { label: 'Ожидает оплаты', variant: 'warning' },
      'cancelled': { label: 'Отменён', variant: 'warning' },
      'archived': { label: 'В архиве', variant: 'neutral' }
    };
    const config = statusMap[status] || { label: 'Неизвестно', variant: 'neutral' as const };
    return <Badge variant={config.variant} className="rounded-full px-3">{config.label}</Badge>;
  };

  // Функция для получения текста и стиля кнопки
  const getButtonConfig = (auction: Auction) => {
    const isParticipating = participatingAuctions.includes(auction.id);

    // Для первых двух аукционов показываем "Перейти к торгам"
    if (!isParticipating && (auction.id === 1 || auction.id === 2)) {
      return {
        text: 'Перейти к торгам',
        bgColor: 'bg-amber-500 hover:bg-amber-600',
        action: () => {
          setSelectedAuctionId(auction.id);
        }
      };
    }

    if (!isParticipating) {
      return {
        text: 'Подать заявку на участие',
        bgColor: 'bg-amber-500 hover:bg-amber-600',
        action: () => {
          setSelectedAuctionId(auction.id);
          setShowParticipationForm(true);
        }
      };
    }

    // Участвует - кнопка зависит от статуса
    if (auction.status === 'active') {
      return {
        text: 'Перейти к торгам',
        bgColor: 'bg-green-600 hover:bg-green-700',
        action: () => setSelectedAuctionId(auction.id)
      };
    }
    if (auction.status === 'published') {
      return {
        text: 'Открыть',
        bgColor: 'bg-blue-600 hover:bg-blue-700',
        action: () => setSelectedAuctionId(auction.id)
      };
    }
    if (auction.status === 'completed') {
      return {
        text: 'Результаты',
        bgColor: 'bg-gray-600 hover:bg-gray-700',
        action: () => setSelectedAuctionId(auction.id)
      };
    }
    // planned или любой другой
    return {
      text: 'Открыть',
      bgColor: 'bg-gray-600 hover:bg-gray-700',
      action: () => setSelectedAuctionId(auction.id)
    };
  };

  // Показываем экран торгов
  if (showTrading && selectedAuctionId) {
    return (
      <TradingScreen
        auctionId={selectedAuctionId}
        onBack={() => {
          setShowTrading(false);
          setSelectedAuctionId(null);
        }}
      />
    );
  }

  // Показываем форму подачи заявки
  if (showParticipationForm && selectedAuctionId) {
    const auction = auctions.find(a => a.id === selectedAuctionId);
    if (auction) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
          {/* Навигационная панель */}
          <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Логотип */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
                      МБ-маркет
                    </div>
                    <div className="text-xs text-gray-500">Личный кабинет участника</div>
                  </div>
                </div>

                {/* Меню */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowParticipationForm(false);
                      setSelectedAuctionId(null);
                      setActiveSection('auctions');
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Аукционы</span>
                  </button>
                </div>

                {/* Уведомления и выход */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выход</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Форма заявки */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ParticipationRequestForm
              auctionId={auction.id}
              auctionTitle={auction.title}
              auctionHouse={auction.auctionHouse}
              auctionStatus={auction.status}
              onBack={() => {
                setShowParticipationForm(false);
                setSelectedAuctionId(null);
              }}
              onSubmit={() => {
                setShowParticipationForm(false);
                setParticipatingAuctions(prev => [...prev, auction.id]);
                setSelectedAuctionId(null);
                setActiveSection('participations');
              }}
            />
          </div>
        </div>
      );
    }
  }

  // Показываем форму выбора доставки
  if (showDeliveryForm && selectedLotForDelivery) {
    return (
      <>
        {/* Основной контент с навигацией */}
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
          {/* Навигационная панель */}
          <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Логотип */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
                      МБ-маркет
                    </div>
                    <div className="text-xs text-gray-500">Личный кабинет участника</div>
                  </div>
                </div>

                {/* Меню */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowDeliveryForm(false);
                      setSelectedLotForDelivery(null);
                      setActiveSection('won-lots');
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Выигранные</span>
                  </button>
                </div>

                {/* Уведомления и выход */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedAuctionId(null);
                      setActiveSection('notifications');
                    }}
                    className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выход</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Заглушка контента */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Оформление доставки</h1>
          </div>
        </div>

        {/* Модальное окно доставки */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <DeliverySelectionForm
            lotTitle={selectedLotForDelivery.title}
            lotPrice={selectedLotForDelivery.price}
            onClose={() => {
              setShowDeliveryForm(false);
              setSelectedLotForDelivery(null);
            }}
            onSubmit={(deliveryData: DeliveryFormData) => {
              console.log('Данные доставки:', deliveryData);
              // Здесь можно добавить логику отправки данных на сервер
              setShowDeliveryForm(false);
              setSelectedLotForDelivery(null);
              // Показываем уведомление об успехе
              setNotificationType('delivery');
              setShowSuccessNotification(true);
              // Автоматически скрываем уведомление через 3 секунды
              setTimeout(() => {
                setShowSuccessNotification(false);
              }, 3000);
            }}
            onSuccess={() => {
              // Дополнительные действия после успешного оформления
              console.log('Заказ успешно оформлен');
            }}
          />
        </div>
      </>
    );
  }

  // Показываем форму оплаты
  if (showPaymentForm && selectedLotForPayment) {
    return (
      <>
        {/* Основной контент с навигацией */}
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
          {/* Навигационная панель */}
          <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Логотип */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
                      МБ-маркет
                    </div>
                    <div className="text-xs text-gray-500">Личный кабинет участника</div>
                  </div>
                </div>

                {/* Меню */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedLotForPayment(null);
                      setActiveSection('won-lots');
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Выигранные</span>
                  </button>
                </div>

                {/* Уведомления и выход */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedAuctionId(null);
                      setActiveSection('notifications');
                    }}
                    className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выход</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Заглушка контента */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Оплата лота</h1>
          </div>
        </div>

        {/* Модальное окно оплаты */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <PaymentForm
            lotTitle={selectedLotForPayment.title}
            lotPrice={selectedLotForPayment.price}
            onClose={() => {
              setShowPaymentForm(false);
              setSelectedLotForPayment(null);
            }}
            onSubmit={(paymentData: PaymentFormData) => {
              console.log('Данные оплаты:', paymentData);
              // Здесь можно добавить логику отправки данных на сервер
              setShowPaymentForm(false);
              setSelectedLotForPayment(null);
              // Показываем уведомление об успехе
              setNotificationType('payment');
              setShowSuccessNotification(true);
              // Автоматически скрываем уведомление через 3 секунды
              setTimeout(() => {
                setShowSuccessNotification(false);
              }, 3000);
            }}
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Уведомление об успехе - поверх всех окон */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-[100] bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in-right max-w-md">
          <Check className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold">
              {notificationType === 'delivery' ? 'Доставка успешно оформлена!' : 'Оплата успешно проведена!'}
            </div>
            <div className="text-sm opacity-90">
              {notificationType === 'delivery' ? 'Мы свяжемся с вами в ближайшее время' : 'Спасибо за покупку!'}
            </div>
          </div>
          <button
            onClick={() => setShowSuccessNotification(false)}
            className="p-1 hover:bg-green-600 rounded transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Навигационная панель */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent font-semibold">
                  МБ-маркет
                </div>
                <div className="text-xs text-gray-500">Личный кабинет участника</div>
              </div>
            </div>

            {/* Меню */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedAuctionId(null);
                  setActiveSection('auctions');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeSection === 'auctions' && !selectedAuctionId
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Gavel className="w-4 h-4" />
                <span>Аукционы</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAuctionId(null);
                  setActiveSection('participations');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeSection === 'participations' && !selectedAuctionId
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Мои участия</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAuctionId(null);
                  setActiveSection('won-lots');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeSection === 'won-lots' && !selectedAuctionId
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Выигранные</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAuctionId(null);
                  setActiveSection('documents');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeSection === 'documents' && !selectedAuctionId
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Документы</span>
              </button>
              <button
                onClick={() => {
                  setSelectedAuctionId(null);
                  setActiveSection('profile');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeSection === 'profile' && !selectedAuctionId
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Профиль</span>
              </button>
            </div>

            {/* Уведомления и выход */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedAuctionId(null);
                  setActiveSection('notifications');
                }}
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Выход</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Показываем детальную карточку аукциона */}
        {selectedAuctionId ? (
          <AuctionDetail
            auctionId={selectedAuctionId}
            onBack={() => setSelectedAuctionId(null)}
            onGoToTrading={() => setShowTrading(true)}
          />
        ) : (
          <>
            {activeSection === 'auctions' && (
              <>
                <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Аукционы</h1>

              {/* Фильтры */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as AuctionStatus | 'all')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">Все статусы</option>
                    <option value="published">Опубликован</option>
                    <option value="planned">Запланирован</option>
                    <option value="active">Торги</option>
                    <option value="completed">Завершён</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск аукциона..."
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm w-64"
                  />
                </div>

                <div className="flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 transition-colors ${
                      viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Отображение в виде строк */}
            {viewMode === 'list' && (
              <div className="space-y-3">
                {auctions
                  .filter((auction) => {
                    if (statusFilter === 'all') return true;
                    return auction.status === statusFilter;
                  })
                  .filter((auction) => auction.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((auction) => {
                    // Определяем конфиг кнопки для каждого аукциона
                    const isParticipating = participatingAuctions.includes(auction.id);
                    let buttonText = 'Подать заявку на участие';
                    let buttonBg = 'bg-amber-500 hover:bg-amber-600';

                    // Для первых двух аукционов показываем "Перейти к торгам"
                    if (!isParticipating && (auction.id === 1 || auction.id === 2)) {
                      buttonText = 'Перейти к торгам';
                    }

                    if (isParticipating) {
                      if (auction.status === 'active') {
                        buttonText = 'Перейти к торгам';
                        buttonBg = 'bg-green-600 hover:bg-green-700';
                      } else if (auction.status === 'published') {
                        buttonText = 'Открыть';
                        buttonBg = 'bg-blue-600 hover:bg-blue-700';
                      } else if (auction.status === 'completed') {
                        buttonText = 'Результаты';
                        buttonBg = 'bg-gray-600 hover:bg-gray-700';
                      } else {
                        buttonText = 'Открыть';
                        buttonBg = 'bg-gray-600 hover:bg-gray-700';
                      }
                    }

                    return (
                      <div
                        key={auction.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                      >
                        <div className="flex items-center gap-4 p-4">
                          {/* Миниатюра */}
                          <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={auction.image}
                              alt={auction.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Основная информация */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-500 mb-1">
                                  {auction.auctionHouse}
                                </div>
                                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{auction.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    {getStatusBadge(auction.status)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{auction.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Package className="w-4 h-4" />
                                    <span>{auction.lotsCount} лотов</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>Шаг: {auction.minBidStep} ₽</span>
                                  </div>
                                </div>
                              </div>

                              {/* Кнопка действия - ВСЕГДА отображается */}
                              <button
                                onClick={() => {
                                  if (isParticipating || auction.id === 1 || auction.id === 2) {
                                    setSelectedAuctionId(auction.id);
                                  } else {
                                    setSelectedAuctionId(auction.id);
                                    setShowParticipationForm(true);
                                  }
                                }}
                                className={`px-4 py-2 rounded-lg transition-colors text-sm text-white whitespace-nowrap ${buttonBg}`}
                              >
                                {buttonText}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Отображение в виде плиток */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions
                  .filter((auction) => {
                    if (statusFilter === 'all') return true;
                    return auction.status === statusFilter;
                  })
                  .filter((auction) => auction.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((auction) => (
                    <div
                      key={auction.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Изображение */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img
                          src={auction.image}
                          alt={auction.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Информация */}
                      <div className="p-5">
                        <div className="text-sm text-gray-500 mb-2">
                          {auction.auctionHouse}
                        </div>
                        <h3 className="text-lg font-semibold mb-3 line-clamp-2">{auction.title}</h3>

                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(auction.status)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{auction.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>Лотов: {auction.lotsCount}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Шаг ставки: {auction.minBidStep} ₽</span>
                          </div>
                        </div>

                        {(() => {
                          const config = getButtonConfig(auction);
                          return (
                            <button
                              onClick={config.action}
                              className={`w-full px-4 py-2 rounded-lg transition-colors text-sm text-white ${config.bgColor}`}
                            >
                              {config.text}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {activeSection === 'participations' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Мои участия</h1>

            {/* Тестовые данные участий */}
            <div className="space-y-4">
              {auctions.slice(0, 2).map((auction) => {
                // Определяем статус лидерства ставки (для примера)
                const isLeading = auction.id === 1;
                const hasBid = true;

                return (
                  <div
                    key={auction.id}
                    onClick={() => setSelectedAuctionId(auction.id)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Миниатюра */}
                      <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={auction.image}
                          alt={auction.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Основная информация */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-500 mb-1">
                              {auction.auctionHouse}
                            </div>
                            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{auction.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                {getStatusBadge(auction.status)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{auction.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                <span>{auction.lotsCount} лотов</span>
                              </div>
                            </div>
                          </div>

                          {/* Статус ставки */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {hasBid && (
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                isLeading
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                <TrendingUp className="w-4 h-4" />
                                <span>{isLeading ? 'Лидирую' : 'Перебили'}</span>
                              </div>
                            )}
                            {auction.status === 'active' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAuctionId(auction.id);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                              >
                                Перейти к торгам
                              </button>
                            )}
                            {auction.status === 'published' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAuctionId(auction.id);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                Открыть
                              </button>
                            )}
                            {auction.status === 'completed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAuctionId(auction.id);
                                }}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                              >
                                Результаты
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'won-lots' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Выигранные лоты</h1>

            {/* Тестовые данные выигранных лотов */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  {/* Миниатюра */}
                  <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1619735142352-4a6d3e0c5a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Лот"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Основная информация */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-500 mb-1">Банкноты и бумажные деньги мира</div>
                    <h3 className="text-lg font-semibold mb-2">Редкая банкнота 1917 года</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="font-semibold text-green-600">Финальная цена: 45 000 ₽</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Оплачено</span>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Документы
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLotForDelivery({
                          id: 1,
                          title: 'Редкая банкнота 1917 года',
                          price: 45000
                        });
                        setShowDeliveryForm(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Оформить доставку
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  {/* Миниатюра */}
                  <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Лот"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Основная информация */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-500 mb-1">Банкноты и бумажные деньги мира</div>
                    <h3 className="text-lg font-semibold mb-2">Коллекция купюр СССР</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="font-semibold text-green-600">Финальная цена: 28 000 ₽</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Ожидает оплаты</span>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Документы
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLotForPayment({
                          id: 2,
                          title: 'Коллекция купюр СССР',
                          price: 28000
                        });
                        setShowPaymentForm(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Оплатить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'documents' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Документы</h1>

            {/* Тестовые данные документов */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип документа</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Лот/Аукцион</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Счёт на оплату</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Редкая банкнота 1917 года</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10.12.2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Подписан</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Скачать</button>
                      <button className="text-gray-600 hover:text-gray-800">Посмотреть</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Акт приёма-передачи</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Редкая банкнота 1917 года</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12.12.2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Отправлен</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Скачать</button>
                      <button className="text-gray-600 hover:text-gray-800">Посмотреть</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">УПД</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Коллекция купюр СССР</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10.12.2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Сформирован</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Скачать</button>
                      <button className="text-gray-600 hover:text-gray-800">Посмотреть</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Счёт на оплату</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Коллекция купюр СССР</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10.12.2025</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Сформирован</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Скачать</button>
                      <button className="text-gray-600 hover:text-gray-800">Посмотреть</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Профиль участника</h1>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Аватар */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-3">Аватар</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center text-4xl text-white">
                    {participantData.name.charAt(0)}
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Изменить аватар
                  </button>
                </div>
              </div>

              {/* Основные данные */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">ФИО</label>
                  <input
                    type="text"
                    defaultValue={participantData.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={participantData.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Телефон</label>
                  <input
                    type="tel"
                    defaultValue={participantData.phone}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Компания</label>
                  <input
                    type="text"
                    defaultValue={participantData.company}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Настройки уведомлений */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Настройки уведомлений</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Уведомления о ставках</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Старт и завершение аукционов</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Документы</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">Доставка</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-amber-500 rounded" />
                  </label>
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all">
                  Сохранить изменения
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Уведомления</h1>

            {/* Тестовые данные уведомлений */}
            <div className="space-y-3">
              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gavel className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Аукцион стартовал</div>
                    <p className="text-sm text-gray-600 mb-2">Аукцион "Редкие монеты Российской Империи" начался</p>
                    <div className="text-xs text-gray-400">15.12.2025 14:00</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Ставку перебили</div>
                    <p className="text-sm text-gray-600 mb-2">Вашу ставку на лот "Серебряный рубль 1896 года" перебили</p>
                    <div className="text-xs text-gray-400">15.12.2025 14:24</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Вы стали лидером</div>
                    <p className="text-sm text-gray-600 mb-2">Вы лидируете в торгах за лот "Золотой червонец 1718 года"</p>
                    <div className="text-xs text-gray-400">15.12.2025 14:25</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Аукцион завершён</div>
                    <p className="text-sm text-gray-600 mb-2">Аукцион "Банкноты и бумажные деньги мира" завершён</p>
                    <div className="text-xs text-gray-400">10.12.2025 18:00</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Вы выиграли лот</div>
                    <p className="text-sm text-gray-600 mb-2">Поздравляем! Вы выиграли лот "Редкая банкнота 1917 года"</p>
                    <div className="text-xs text-gray-400">10.12.2025 17:45</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Сформирован документ</div>
                    <p className="text-sm text-gray-600 mb-2">Для лота "Редкая банкнота 1917 года" сформирован счёт на оплату</p>
                    <div className="text-xs text-gray-400">10.12.2025 17:50</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Обновился статус доставки</div>
                    <p className="text-sm text-gray-600 mb-2">Ваш заказ "Редкая банкнота 1917 года" отправлен</p>
                    <div className="text-xs text-gray-400">12.12.2025 10:30</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
