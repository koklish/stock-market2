import { useState, useEffect } from 'react';
import {
  Coins,
  LayoutDashboard,
  Gavel,
  Archive,
  FileText,
  Building2,
  CreditCard,
  MessageSquare,
  LogOut,
  Plus,
  Star,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  Edit,
  Grid3x3,
  List,
  Search,
  Filter
} from 'lucide-react';
import auctionImage1 from 'figma:asset/64bcb5cc669d449b824d80cfe93929ce73d86651.png';
import auctionImage2 from 'figma:asset/be75704d05a20d3fa5f3da5edc75293db3f3a622.png';
import auctionImage3 from 'figma:asset/cbcfeb4b5664568aa11be253c2883d9cfd0d3c56.png';
import { CreateAuction } from './CreateAuction';
import { AuctionHouseAuctionDetail } from './AuctionHouseAuctionDetail';

import { Badge } from '../ui/badge';

type AuctionStatus =
  | 'draft'
  | 'awaiting-payment'
  | 'published'
  | 'planned'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'archived';

export interface Auction {
  id: number;
  title: string;
  number: number;
  image: string;
  date: string;
  status: AuctionStatus;
  lotsCount: number;
  commission: number;
}

interface AuctionHouseDashboardProps {
  onLogout: () => void;
}

export function AuctionHouseDashboard({ onLogout }: AuctionHouseDashboardProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'profile' | 'auctions' | 'create-auction'>('dashboard');
  const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<AuctionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFromFilter, setDateFromFilter] = useState<string>('');
  const [dateToFilter, setDateToFilter] = useState<string>('');
  const [lotsCountFilter, setLotsCountFilter] = useState<string>('all');
  const [commissionFilter, setCommissionFilter] = useState<string>('all');

  // Тестовые данные аукционного дома
  const auctionHouseData = {
    name: 'Империал Аукцион',
    rating: 4.8,
    completedAuctions: 127,
    activeAuctions: 3,
    logo: '🏛️'
  };

  // Начальные тестовые аукционы
  const defaultAuctions: Auction[] = [
    {
      id: 1,
      title: 'Редкие монеты Российской Империи',
      number: 128,
      image: auctionImage1,
      date: '2025-12-15 14:00',
      status: 'active',
      lotsCount: 156,
      commission: 15
    },
    {
      id: 2,
      title: 'Коллекция орденов и медалей СССР',
      number: 129,
      image: auctionImage2,
      date: '2025-12-20 16:00',
      status: 'published',
      lotsCount: 89,
      commission: 12
    },
    {
      id: 3,
      title: 'Антикварные украшения XIX века',
      number: 130,
      image: auctionImage3,
      date: '2025-12-22 15:00',
      status: 'planned',
      lotsCount: 67,
      commission: 18
    },
    {
      id: 4,
      title: 'Банкноты и бумажные деньги мира',
      number: 131,
      image: 'https://images.unsplash.com/photo-1633769573304-90d2d44eef0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYmFua25vdGVzJTIwbW9uZXl8ZW58MXx8fHwxNzY1MjYyNTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-12-25 14:30',
      status: 'awaiting-payment',
      lotsCount: 203,
      commission: 10
    },
    {
      id: 5,
      title: 'Древнеримские монеты и артефакты',
      number: 132,
      image: 'https://images.unsplash.com/photo-1579468118444-283b34316500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwcm9tYW4lMjBjb2luc3xlbnwxfHx8fDE3NjUyNjI1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2025-12-28 13:00',
      status: 'draft',
      lotsCount: 45,
      commission: 20
    },
    {
      id: 6,
      title: 'Коллекционные марки и филателия',
      number: 133,
      image: 'https://images.unsplash.com/photo-1612798993808-36ca518f7ceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWN0aWJsZSUyMHN0YW1wcyUyMHZpbnRhZ2V8ZW58MXx8fHwxNzY1MjYyNTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2026-01-05 15:30',
      status: 'completed',
      lotsCount: 312,
      commission: 8
    },
    {
      id: 7,
      title: 'Старинные карты и атласы',
      number: 134,
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbWFwfGVufDF8fHwxNzY1MjYyNTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2026-01-10 12:00',
      status: 'cancelled',
      lotsCount: 28,
      commission: 15
    },
    {
      id: 8,
      title: 'Живопись советского реализма',
      number: 135,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3ZpZXQlMjBhcnR8ZW58MXx8fHwxNzY1MjYyNTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: '2026-01-15 14:00',
      status: 'archived',
      lotsCount: 42,
      commission: 12
    }
  ];

  // Загружаем аукционы из localStorage или используем дефолтные
  const [auctions, setAuctions] = useState<Auction[]>(() => {
    const saved = localStorage.getItem('auctions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultAuctions;
      }
    }
    return defaultAuctions;
  });

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('auctions', JSON.stringify(auctions));
  }, [auctions]);

  // Функция добавления нового аукциона
  const handleAddAuction = (newAuction: Omit<Auction, 'id' | 'number'>) => {
    const maxId = Math.max(...auctions.map(a => a.id), 0);
    const maxNumber = Math.max(...auctions.map(a => a.number), 0);

    const auction: Auction = {
      ...newAuction,
      id: maxId + 1,
      number: maxNumber + 1
    };

    setAuctions(prev => [auction, ...prev]);
  };

  const getStatusBadge = (status: AuctionStatus) => {
    const statusMap: Record<AuctionStatus, { label: string; variant: "neutral" | "warning" | "info" | "planned" | "success" | "success-dark" | "danger" | "muted" }> = {
      'draft': { label: 'Черновик', variant: 'neutral' },
      'awaiting-payment': { label: 'Ожидает оплаты', variant: 'warning' },
      'published': { label: 'Опубликован', variant: 'info' },
      'planned': { label: 'Запланирован', variant: 'planned' },
      'active': { label: 'Торги', variant: 'success' },
      'completed': { label: 'Завершён', variant: 'success-dark' },
      'cancelled': { label: 'Отменён', variant: 'danger' },
      'archived': { label: 'В архиве', variant: 'muted' }
    };
    const { label, variant } = statusMap[status];
    return <Badge variant={variant} className="rounded-full px-3">{label}</Badge>;
  };

  const getStatusAction = (auction: Auction) => {
    const handleViewDetails = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedAuctionId(auction.id);
    };

    switch (auction.status) {
      case 'draft':
        return (
          <button onClick={handleViewDetails} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Завершить настройку
          </button>
        );
      case 'awaiting-payment':
        return (
          <button onClick={handleViewDetails} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
            Оплатить размещение
          </button>
        );
      case 'published':
        return (
          <button onClick={handleViewDetails} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Просмотр аукциона
          </button>
        );
      case 'planned':
        return (
          <button onClick={handleViewDetails} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            Начать торги
          </button>
        );
      case 'active':
        return (
          <button onClick={handleViewDetails} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Перейти к торгам
          </button>
        );
      case 'completed':
        return (
          <button onClick={handleViewDetails} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Посмотреть результаты
          </button>
        );
      case 'cancelled':
        return (
          <button onClick={handleViewDetails} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Подробности
          </button>
        );
      case 'archived':
        return (
          <button onClick={handleViewDetails} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors">
            Открыть архив
          </button>
        );
      default:
        return null;
    }
  };

  // Если выбран конкретный аукцион, показываем детальный просмотр
  if (selectedAuctionId !== null) {
    const selectedAuction = auctions.find(a => a.id === selectedAuctionId);
    return (
      <AuctionHouseAuctionDetail
        auctionId={selectedAuctionId}
        auctionData={selectedAuction ? {
          title: selectedAuction.title,
          date: selectedAuction.date,
          lotsCount: selectedAuction.lotsCount,
          commission: selectedAuction.commission
        } : undefined}
        onBack={() => setSelectedAuctionId(null)}
        onNavigateToDashboard={() => {
          setSelectedAuctionId(null);
          setActiveSection('dashboard');
        }}
        onNavigateToAuctions={() => {
          setSelectedAuctionId(null);
          setActiveSection('auctions');
        }}
        onNavigateToProfile={() => {
          setSelectedAuctionId(null);
          setActiveSection('profile');
        }}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Навигационная панель */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Логотип */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent">
                  МБ-маркет
                </div>
                <div className="text-xs text-gray-500">Империал Аукцион</div>
                <div className="text-xs text-amber-600 mt-0.5">Аукционный дом</div>
              </div>
            </div>

            {/* Меню */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveSection('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'dashboard'
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Главная</span>
              </button>
              <button
                onClick={() => setActiveSection('auctions')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'auctions'
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Gavel className="w-5 h-5" />
                <span>Аукционы</span>
              </button>
              <button
                onClick={() => setActiveSection('profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'profile'
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>Профиль</span>
              </button>
            </div>

            {/* Выход */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Выход</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'dashboard' && (
          <>
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Продано лотов</div>
                  <Package className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl mb-1">1,247</div>
                <div className="text-sm text-green-600">+12% за месяц</div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Доход АД</div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl mb-1">₽ 2,456,789</div>
                <div className="text-sm text-green-600">+18% за месяц</div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-600">Комиссия платформы</div>
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl mb-1">₽ 49,136</div>
                <div className="text-sm text-gray-500">2% от оборота</div>
              </div>
            </div>

            {/* Текущие аукционы */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="">Аукционы</h2>
                <button
                  onClick={() => setActiveSection('create-auction')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Создать аукцион
                </button>
              </div>

              {/* Фильтры */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as AuctionStatus | 'all')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="all">Все статусы</option>
                    <option value="draft">Черновик</option>
                    <option value="awaiting-payment">Ож��дает оплаты</option>
                    <option value="paid">Оплачен</option>
                    <option value="open-preview">Предпросмотр</option>
                    <option value="active">Идёт аукцион</option>
                    <option value="completed">Завершён</option>
                  </select>
                </div>

                <div className="flex-1 flex items-center gap-2 max-w-md">
                  <Search className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск аукциона..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 transition-colors ${
                      viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

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
                        onClick={() => setSelectedAuctionId(auction.id)}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:scale-105 duration-300"
                      >
                        {/* Изображение */}
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={auction.image}
                            alt={auction.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Информация */}
                        <div className="p-5">
                          <div className="text-sm text-gray-500 mb-2">
                            Аукцион №{auction.number}
                          </div>
                          <h3 className="mb-3 line-clamp-2">{auction.title}</h3>

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
                              <DollarSign className="w-4 h-4" />
                              <span>Комиссия АД: {auction.commission}%</span>
                            </div>
                          </div>

                          {getStatusAction(auction)}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Отображение в виде строк */}
              {viewMode === 'list' && (
                <div className="space-y-3">
                  {auctions
                    .filter((auction) => {
                      if (statusFilter === 'all') return true;
                      return auction.status === statusFilter;
                    })
                    .filter((auction) => auction.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((auction) => (
                      <div
                        key={auction.id}
                        onClick={() => setSelectedAuctionId(auction.id)}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden cursor-pointer hover:bg-gray-50"
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
                                  Аукцион №{auction.number}
                                </div>
                                <h3 className="mb-2 line-clamp-1">{auction.title}</h3>
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
                                    <DollarSign className="w-4 h-4" />
                                    <span>Комиссия {auction.commission}%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Действия */}
                              <div className="flex items-center gap-3 flex-shrink-0">
                                {getStatusAction(auction)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'auctions' && (
          <div className="flex gap-6">
            {/* Левая панель фильтров */}
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-amber-600" />
                  <h3 className="">Фильтры</h3>
                </div>

                {/* Поиск */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Поиск</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Название аукциона..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Статус */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Статус</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as AuctionStatus | 'all')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">Все статусы</option>
                    <option value="draft">Черновик</option>
                    <option value="awaiting-payment">Ожидает оплаты</option>
                    <option value="published">Опубликован</option>
                    <option value="planned">Запланирован</option>
                    <option value="active">Торги</option>
                    <option value="completed">Завершён</option>
                    <option value="cancelled">Отменён</option>
                    <option value="archived">В архиве</option>
                  </select>
                </div>

                {/* Категория товаров */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Категория товаров</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">Все категории</option>
                    <option value="coins">Монеты и банкноты</option>
                    <option value="medals">Ордена и медали</option>
                    <option value="jewelry">Ювелирные изделия</option>
                    <option value="antiques">Антиквариат</option>
                    <option value="art">Произведения искусства</option>
                    <option value="stamps">Марки и филателия</option>
                    <option value="collectibles">Коллекционирование</option>
                  </select>
                </div>

                {/* Дата проведения */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-3">Дата проведения</label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">От</label>
                      <input
                        type="date"
                        value={dateFromFilter}
                        onChange={(e) => setDateFromFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">До</label>
                      <input
                        type="date"
                        value={dateToFilter}
                        onChange={(e) => setDateToFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Количество лотов */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Количество лотов</label>
                  <select
                    value={lotsCountFilter}
                    onChange={(e) => setLotsCountFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">Любое количество</option>
                    <option value="1-50">1-50 лотов</option>
                    <option value="51-100">51-100 лотов</option>
                    <option value="101-200">101-200 лотов</option>
                    <option value="201+">201+ лотов</option>
                  </select>
                </div>

                {/* Комиссия АД */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-700 mb-2">Комиссия АД</label>
                  <select
                    value={commissionFilter}
                    onChange={(e) => setCommissionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="all">Любая</option>
                    <option value="0-10">0-10%</option>
                    <option value="11-15">11-15%</option>
                    <option value="16-20">16-20%</option>
                    <option value="21+">21%+</option>
                  </select>
                </div>

                {/* Кнопка сброса фильтров */}
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setDateFromFilter('');
                    setDateToFilter('');
                    setLotsCountFilter('all');
                    setCommissionFilter('all');
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            </div>

            {/* Основной контент */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="">Все аукционы</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-4 py-2 transition-colors ${
                        viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 transition-colors ${
                        viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveSection('create-auction')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Создать аукцион
                  </button>
                </div>
              </div>

              {/* Отображение в виде плиток */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {auctions
                    .filter((auction) => {
                      if (statusFilter === 'all') return true;
                      return auction.status === statusFilter;
                    })
                    .filter((auction) => auction.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((auction) => (
                      <div
                        key={auction.id}
                        onClick={() => setSelectedAuctionId(auction.id)}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:scale-105 duration-300"
                      >
                        {/* Изображение */}
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={auction.image}
                            alt={auction.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Информация */}
                        <div className="p-5">
                          <div className="text-sm text-gray-500 mb-2">
                            Аукцион №{auction.number}
                          </div>
                          <h3 className="mb-3 line-clamp-2">{auction.title}</h3>

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
                              <DollarSign className="w-4 h-4" />
                              <span>Комиссия АД: {auction.commission}%</span>
                            </div>
                          </div>

                          {getStatusAction(auction)}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Отображение в виде строк */}
              {viewMode === 'list' && (
                <div className="space-y-3">
                  {auctions
                    .filter((auction) => {
                      if (statusFilter === 'all') return true;
                      return auction.status === statusFilter;
                    })
                    .filter((auction) => auction.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((auction) => (
                      <div
                        key={auction.id}
                        onClick={() => setSelectedAuctionId(auction.id)}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden cursor-pointer hover:bg-gray-50"
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
                                  Аукцион №{auction.number}
                                </div>
                                <h3 className="mb-2 line-clamp-1">{auction.title}</h3>
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
                                    <DollarSign className="w-4 h-4" />
                                    <span>Комиссия {auction.commission}%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Действия */}
                              <div className="flex items-center gap-3 flex-shrink-0">
                                {getStatusAction(auction)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="max-w-3xl">
            <h1 className="mb-6">Профиль Аукционного дома</h1>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Логотип */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-3">Логотип</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center text-5xl">
                    {auctionHouseData.logo}
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Изменить логотип
                  </button>
                </div>
              </div>

              {/* Основные данные */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Название Аукционного дома</label>
                  <input
                    type="text"
                    defaultValue={auctionHouseData.name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value="tender@admin.ru"
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Фактический адрес</label>
                  <input
                    type="text"
                    defaultValue="г. Москва, ул. Арбат, д. 15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Телефон</label>
                    <input
                      type="tel"
                      defaultValue="+7 (495) 123-45-67"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Время работы</label>
                    <input
                      type="text"
                      defaultValue="Пн-Пт: 10:00-19:00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Сайт</label>
                  <input
                    type="url"
                    defaultValue="https://imperial-auction.ru"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
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

        {activeSection === 'create-auction' && (
          <CreateAuction
            onBack={() => setActiveSection('dashboard')}
            onCreateAuction={handleAddAuction}
            auctionHouseData={{
              name: auctionHouseData.name,
              logo: auctionHouseData.logo,
              address: 'г. Москва, ул. Арбат, д. 15',
              phone: '+7 (495) 123-45-67',
              website: 'https://imperial-auction.ru',
              workingHours: 'Пн-Пт: 10:00-19:00'
            }}
          />
        )}
      </div>
    </div>
  );
}