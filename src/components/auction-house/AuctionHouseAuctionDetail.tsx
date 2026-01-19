import { useState } from 'react';
import { ArrowLeft, Calendar, Package, Clock, Building2, FileText, History, Edit, Plus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';

type AuctionStatus = 'draft' | 'awaiting-payment' | 'published' | 'planned' | 'active' | 'completed' | 'cancelled' | 'archived';

interface Lot {
  id: number;
  title: string;
  description: string;
  image: string;
  startPrice: number;
  currentPrice: number;
  bidsCount: number;
}

interface AuctionHouseAuctionDetailProps {
  auctionId: number;
  auctionData?: {
    title: string;
    date: string;
    lotsCount: number;
    commission: number;
  };
  onBack: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToAuctions: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export function AuctionHouseAuctionDetail({
  auctionId,
  auctionData,
  onBack,
}: AuctionHouseAuctionDetailProps) {
  const [activeTab, setActiveTab] = useState<'lots' | 'conditions' | 'participants' | 'history'>('lots');

  // Тестовые лоты
  const lots: Lot[] = [
    {
      id: 1,
      title: 'Золотой червонец 1718 года',
      description: 'Отличная сохранность, редкий пробный штемпель',
      image: 'https://images.unsplash.com/photo-1619735142352-4a6d3e0c5a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      startPrice: 150000,
      currentPrice: 185000,
      bidsCount: 12
    },
    {
      id: 2,
      title: 'Серебряный рубль 1896 года',
      description: 'Коронационный рубль Николая II',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      startPrice: 50000,
      currentPrice: 62500,
      bidsCount: 8
    },
    {
      id: 3,
      title: 'Платиновая монета 1828 года',
      description: 'Первая платиновая монета России',
      image: 'https://images.unsplash.com/photo-1633769573304-90d2d44eef0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      startPrice: 300000,
      currentPrice: 300000,
      bidsCount: 0
    }
  ];

  // Тестовые данные аукциона
  const auction = {
    id: auctionId,
    title: auctionData?.title || 'Редкие монеты Российской Империи',
    status: 'active' as AuctionStatus,
    startDate: auctionData?.date || '2025-12-15 14:00',
    endDate: '2025-12-15 18:00',
    bidStep: 500,
    currency: '₽',
    lotsCount: auctionData?.lotsCount || lots.length,
    commission: auctionData?.commission || 10,
    participantsCount: 24,
    description: 'Уникальная коллекция редких монет Российской Империи XVIII-XIX веков. В аукционе представлены золотые и серебряные монеты, отчеканенные на Санкт-Петербургском, Московском и других монетных дворах.'
  };

  // Тестовые участники
  const participants = [
    { id: 1, name: 'Иван Петров', email: 'ivan@example.com', status: 'approved', bidsCount: 5 },
    { id: 2, name: 'Мария Сидорова', email: 'maria@example.com', status: 'approved', bidsCount: 3 },
    { id: 3, name: 'Алексей Козлов', email: 'alexey@example.com', status: 'pending', bidsCount: 0 },
    { id: 4, name: 'Елена Новикова', email: 'elena@example.com', status: 'approved', bidsCount: 8 },
  ];

  const getStatusBadge = (status: AuctionStatus) => {
    const statusMap: Record<AuctionStatus, { label: string; variant: "default" | "info" | "planned" | "success" | "success-dark" | "warning" | "destructive" }> = {
      'draft': { label: 'Черновик', variant: 'default' },
      'awaiting-payment': { label: 'Ожидает оплаты', variant: 'warning' },
      'published': { label: 'Опубликован', variant: 'info' },
      'planned': { label: 'Запланирован', variant: 'planned' },
      'active': { label: 'Торги', variant: 'success' },
      'completed': { label: 'Завершён', variant: 'success-dark' },
      'cancelled': { label: 'Отменён', variant: 'destructive' },
      'archived': { label: 'В архиве', variant: 'default' }
    };
    const { label, variant } = statusMap[status];
    return <Badge variant={variant} className="rounded-full px-3">{label}</Badge>;
  };

  const getParticipantStatusBadge = (status: string) => {
    if (status === 'approved') {
      return <Badge variant="success" className="rounded-full px-2">Одобрен</Badge>;
    }
    return <Badge variant="warning" className="rounded-full px-2">На рассмотрении</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
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
                <span>Назад к списку аукционов</span>
              </button>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl font-bold">{auction.title}</h2>
                {getStatusBadge(auction.status)}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-5 h-5" />
                <span className="text-lg">Аукцион #{auction.id}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4" />
                <span>Редактировать</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-sm text-gray-500">Участников</div>
                <div className="font-semibold">{auction.participantsCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Основные параметры</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Шаг ставки:</span>
                <span className="ml-2 font-semibold">{auction.bidStep} {auction.currency}</span>
              </div>
              <div>
                <span className="text-gray-500">Валюта:</span>
                <span className="ml-2 font-semibold">{auction.currency}</span>
              </div>
              <div>
                <span className="text-gray-500">Комиссия:</span>
                <span className="ml-2 font-semibold">{auction.commission}%</span>
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
                <span>Лоты ({lots.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('participants')}
                className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                  activeTab === 'participants'
                    ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>Участники ({participants.length})</span>
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
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Лоты аукциона</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Добавить лот</span>
                  </button>
                </div>
                {/* Список лотов */}
                <div className="space-y-4">
                  {lots.map((lot) => (
                    <div
                      key={lot.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all border-gray-200 hover:border-amber-400"
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
                            <span className="text-gray-500">Ставок:</span>
                            <span className="ml-1 font-semibold">{lot.bidsCount}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'participants' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Участники аукциона</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Участник</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Статус</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Ставок</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant) => (
                        <tr key={participant.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{participant.name}</td>
                          <td className="py-3 px-4 text-gray-600">{participant.email}</td>
                          <td className="py-3 px-4">{getParticipantStatusBadge(participant.status)}</td>
                          <td className="py-3 px-4">{participant.bidsCount}</td>
                          <td className="py-3 px-4">
                            {participant.status === 'pending' && (
                              <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                                  Одобрить
                                </button>
                                <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                                  Отклонить
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
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
