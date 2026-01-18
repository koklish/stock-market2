import { useState } from 'react';
import { ArrowLeft, Calendar, Package, Clock, Building2, FileText, History } from 'lucide-react';
import { Badge } from '../ui/badge';
import { LotTradePanel } from './LotTradePanel';

type AuctionStatus = 'published' | 'planned' | 'active' | 'completed';

interface Lot {
  id: number;
  title: string;
  description: string;
  image: string;
  startPrice: number;
  currentPrice: number;
  leader: string;
}

interface AuctionDetailProps {
  auctionId: number;
  onBack: () => void;
  onGoToTrading: () => void;
}

export function AuctionDetail({ auctionId, onBack, onGoToTrading }: AuctionDetailProps) {
  const [activeTab, setActiveTab] = useState<'lots' | 'conditions' | 'history'>('lots');
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);

  // Тестовые лоты
  const lots: Lot[] = [
    {
      id: 1,
      title: 'Золотой червонец 1718 года',
      description: 'Отличная сохранность, редкий пробный штемпель',
      image: 'https://images.unsplash.com/photo-1619735142352-4a6d3e0c5a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      startPrice: 150000,
      currentPrice: 185000,
      leader: 'Вы'
    },
    {
      id: 2,
      title: 'Серебряный рубль 1896 года',
      description: 'Коронационный рубль Николая II',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      startPrice: 50000,
      currentPrice: 62500,
      leader: 'Участник #2'
    },
    {
      id: 3,
      title: 'Платиновая монета 1828 года',
      description: 'Первая платиновая монета России',
      image: 'https://images.unsplash.com/photo-1633769573304-90d2d44eef0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      startPrice: 300000,
      currentPrice: 300000,
      leader: '-'
    }
  ];

  // Тестовые данные аукциона
  const auction = {
    id: auctionId,
    title: 'Редкие монеты Российской Империи',
    auctionHouse: 'Империал Аукцион',
    status: 'active' as AuctionStatus,
    startDate: '2025-12-15 14:00',
    endDate: '2025-12-15 18:00',
    bidStep: 500,
    currency: '₽',
    lotsCount: lots.length,
    description: 'Уникальная коллекция редких монет Российской Империи XVIII-XIX веков. В аукционе представлены золотые и серебряные монеты, отчеканенные на Санкт-Петербургском, Московском и других монетных дворах.'
  };

  // Функция для получения данных лота для модалки
  const getLotTradeView = (lotId: number) => {
    const lot = lots.find(l => l.id === lotId);
    if (!lot) return null;

    // Генерируем тестовые ставки
    const now = new Date();
    const bidStep = auction.bidStep;
    const bids = [
      {
        id: 1,
        time: new Date(now.getTime() - 5 * 60000).toISOString(),
        userLabel: 'Вы',
        amount: lot.currentPrice,
        isCurrentUser: true
      },
      {
        id: 2,
        time: new Date(now.getTime() - 10 * 60000).toISOString(),
        userLabel: 'Участник #2',
        amount: lot.currentPrice - bidStep,
        isCurrentUser: false
      },
      {
        id: 3,
        time: new Date(now.getTime() - 15 * 60000).toISOString(),
        userLabel: 'Участник #3',
        amount: lot.currentPrice - bidStep * 2,
        isCurrentUser: false
      }
    ];

    return {
      lotId: lot.id,
      lotTitle: lot.title,
      lotImage: lot.image,
      startPrice: lot.startPrice,
      currentPrice: lot.currentPrice,
      step: auction.bidStep,
      bidsCount: bids.length,
      leaderUserId: lot.leader === 'Вы' ? 'current-user' : lot.leader === '-' ? null : 'other',
      myLastBid: lot.leader === 'Вы' ? bids[0] : undefined,
      auctionStatus: auction.status,
      isUserApproved: true, // Для демо считаем, что пользователь допущен
      auctionTitle: auction.title,
      bids: bids,
      description: lot.description,
      characteristics: [
        { key: 'Материал', value: 'Золото 999 пробы' },
        { key: 'Год чеканки', value: '1718' },
        { key: 'Монетный двор', value: 'Санкт-Петербургский' },
        { key: 'Сохранность', value: 'Отличная' },
        { key: 'Вес', value: '3.47 г' },
        { key: 'Диаметр', value: '21 мм' }
      ],
      documents: [
        { name: 'Экспертное заключение.pdf', url: '#' },
        { name: 'Сертификат подлинности.pdf', url: '#' }
      ]
    };
  };

  const getStatusBadge = (status: AuctionStatus) => {
    const statusMap: Record<AuctionStatus, { label: string; variant: "info" | "planned" | "success" | "success-dark" }> = {
      'published': { label: 'Опубликован', variant: 'info' },
      'planned': { label: 'Запланирован', variant: 'planned' },
      'active': { label: 'Торги', variant: 'success' },
      'completed': { label: 'Завершён', variant: 'success-dark' }
    };
    const { label, variant } = statusMap[status];
    return <Badge variant={variant} className="rounded-full px-3">{label}</Badge>;
  };

  const getCTAButton = () => {
    switch (auction.status) {
      case 'published':
        return (
          <button className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            Подать заявку на участие
          </button>
        );
      case 'planned':
        return (
          <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            Участвовать
          </button>
        );
      case 'active':
        return (
          <button onClick={onGoToTrading} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Перейти к торгам
          </button>
        );
      case 'completed':
        return (
          <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Результаты
          </button>
        );
    }
  };

  return (
    <div>
      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Хедер аукциона */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Назад</span>
              </button>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl font-bold">{auction.title}</h2>
                {getStatusBadge(auction.status)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-5 h-5" />
                <span className="text-lg">{auction.auctionHouse}</span>
              </div>
            </div>
            {getCTAButton()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Начало</div>
                <div className="font-semibold">{auction.startDate}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">Окончание</div>
                <div className="font-semibold">{auction.endDate}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm text-gray-500">Лотов</div>
                <div className="font-semibold">{auction.lotsCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Основные правила</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Шаг ставки:</span>
                <span className="ml-2 font-semibold">{auction.bidStep} {auction.currency}</span>
              </div>
              <div>
                <span className="text-gray-500">Валюта:</span>
                <span className="ml-2 font-semibold">{auction.currency}</span>
              </div>
              <div>
                <span className="text-gray-500">Формат:</span>
                <span className="ml-2 font-semibold">Торги по лотам</span>
              </div>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Навигация по вкладкам */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('lots')}
                className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                  activeTab === 'lots'
                    ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Лоты</span>
              </button>
              <button
                onClick={() => setActiveTab('conditions')}
                className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                  activeTab === 'conditions'
                    ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Условия</span>
              </button>

              {(auction.status === 'active' || auction.status === 'completed') && (
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                    activeTab === 'history'
                      ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span>История торгов</span>
                </button>
              )}
            </div>
          </div>

          {/* Контент вкладок */}
          <div className="p-6">
            {activeTab === 'lots' && (
              <div className="flex gap-6">
                {/* Список лотов */}
                <div className={`space-y-4 ${selectedLotId ? 'flex-1' : 'w-full'}`}>
                  {lots.map((lot) => (
                    <div
                      key={lot.id}
                      onClick={() => setSelectedLotId(lot.id)}
                      className={`flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                        selectedLotId === lot.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={lot.image}
                          alt={lot.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1">{lot.title}</h4>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">{lot.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Старт:</span>
                            <span className="ml-1 font-semibold">{lot.startPrice.toLocaleString()} ₽</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Текущая:</span>
                            <span className="ml-1 font-semibold text-green-600">{lot.currentPrice.toLocaleString()} ₽</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Лидер:</span>
                            <span className={`ml-1 font-semibold ${lot.leader === 'Вы' ? 'text-blue-600' : 'text-gray-700'}`}>
                              {lot.leader}
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedLotId !== lot.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLotId(lot.id);
                          }}
                          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                        >
                          Выбрать
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Панель выбранного лота */}
                {selectedLotId && (() => {
                  const lotData = getLotTradeView(selectedLotId);
                  if (!lotData) return null;
                  return (
                    <div className="w-[400px] flex-shrink-0">
                      <LotTradePanel
                        lot={lotData}
                        onClose={() => setSelectedLotId(null)}
                        onBidSubmit={(amount) => {
                          console.log('Ставка:', amount);
                          // Здесь будет логика отправки ставки на сервер
                        }}
                      />
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === 'conditions' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Условия участия</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">{auction.description}</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Требования к участникам:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Верифицированный аккаунт</li>
                      <li>Депозит в размере 10% от планируемой суммы ставок</li>
                      <li>Согласие с правилами площадки</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}



            {activeTab === 'history' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">История торгов</h3>
                <div className="text-center text-gray-500 py-8">
                  <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>История торгов будет доступна после завершения аукциона</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
