import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Play, Pause, Square, TrendingUp, User as UserIcon, Package } from 'lucide-react';

interface TradingScreenProps {
  auctionId: number;
  onBack: () => void;
}

interface Lot {
  id: number;
  title: string;
  currentPrice: number;
  leader: string;
  bidStep: number;
}

interface Bid {
  id: number;
  time: string;
  participant: string;
  amount: number;
}

export function TradingScreen({ auctionId, onBack }: TradingScreenProps) {
  const [selectedLotId, setSelectedLotId] = useState(1);
  const [bidAmount, setBidAmount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 минут в секундах
  const [lots, setLots] = useState<Lot[]>([
    {
      id: 1,
      title: 'Золотой червонец 1718 года',
      currentPrice: 185000,
      leader: 'Вы',
      bidStep: 500
    },
    {
      id: 2,
      title: 'Серебряный рубль 1896 года',
      currentPrice: 62500,
      leader: 'Участник #2',
      bidStep: 500
    },
    {
      id: 3,
      title: 'Платиновая монета 1828 года',
      currentPrice: 300000,
      leader: '-',
      bidStep: 1000
    },
    {
      id: 4,
      title: 'Золотой империал 1897 года',
      currentPrice: 45000,
      leader: 'Участник #3',
      bidStep: 500
    },
    {
      id: 5,
      title: 'Серебряный полтинник 1762 года',
      currentPrice: 28000,
      leader: '-',
      bidStep: 300
    }
  ]);

  const [bids, setBids] = useState<Bid[]>([
    { id: 1, time: '14:25:30', participant: 'Вы', amount: 185000 },
    { id: 2, time: '14:24:15', participant: 'Участник #2', amount: 184500 },
    { id: 3, time: '14:23:00', participant: 'Вы', amount: 184000 },
    { id: 4, time: '14:22:45', participant: 'Участник #2', amount: 183500 },
    { id: 5, time: '14:21:30', participant: 'Вы', amount: 183000 }
  ]);

  const selectedLot = lots.find(lot => lot.id === selectedLotId);

  // Обновляем bidAmount при смене лота
  useEffect(() => {
    if (selectedLot) {
      setBidAmount(selectedLot.currentPrice + selectedLot.bidStep);
    }
  }, [selectedLotId, selectedLot]);

  // Таймер
  useEffect(() => {
    if (!isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = () => {
    if (!selectedLot) return;

    const newBid: Bid = {
      id: bids.length + 1,
      time: new Date().toLocaleTimeString('ru-RU'),
      participant: 'Вы',
      amount: bidAmount
    };

    // Обновляем лоты
    setLots(prevLots => prevLots.map(lot =>
      lot.id === selectedLotId
        ? { ...lot, currentPrice: bidAmount, leader: 'Вы' }
        : lot
    ));

    // Добавляем ставку в историю
    setBids(prevBids => [newBid, ...prevBids]);

    // Обновляем минимальную ставку
    setBidAmount(bidAmount + selectedLot.bidStep);
  };

  const handleSimulateCompetitorBid = () => {
    if (!selectedLot) return;

    const competitorAmount = selectedLot.currentPrice + selectedLot.bidStep;
    const newBid: Bid = {
      id: bids.length + 1,
      time: new Date().toLocaleTimeString('ru-RU'),
      participant: 'Участник #2',
      amount: competitorAmount
    };

    // Обновляем лоты
    setLots(prevLots => prevLots.map(lot =>
      lot.id === selectedLotId
        ? { ...lot, currentPrice: competitorAmount, leader: 'Участник #2' }
        : lot
    ));

    // Добавляем ставку в историю
    setBids(prevBids => [newBid, ...prevBids]);

    // Обновляем минимальную ставку
    setBidAmount(competitorAmount + selectedLot.bidStep);
  };

  const handleQuickBid = (multiplier: number) => {
    if (!selectedLot) return;
    setBidAmount(selectedLot.currentPrice + (selectedLot.bidStep * multiplier));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Верхняя панель */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Назад</span>
              </button>
              <div>
                <h1 className="text-lg font-semibold">Редкие монеты Российской Империи</h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Таймер */}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <div className="text-2xl font-mono font-bold text-green-600">
                  {formatTime(timeRemaining)}
                </div>
              </div>

              {/* Индикатор соединения */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live (mock)</span>
              </div>

              {/* Кнопки демо */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateCompetitorBid}
                  className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  Симулировать ставку
                </button>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setTimeRemaining(0)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <Square className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Левая колонка - список лотов */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  Лоты ({lots.length})
                </h3>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {lots.map((lot) => (
                  <div
                    key={lot.id}
                    onClick={() => setSelectedLotId(lot.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedLotId === lot.id ? 'bg-amber-50 border-l-4 border-l-amber-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold mb-2 text-sm">{lot.title}</div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <div className="text-gray-500">Цена</div>
                        <div className="font-semibold text-green-600">
                          {lot.currentPrice.toLocaleString()} ₽
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500">Лидер</div>
                        <div className={`font-semibold ${lot.leader === 'Вы' ? 'text-amber-600' : 'text-gray-700'}`}>
                          {lot.leader}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Центральная зона - торги по лоту */}
          <div className="flex-1">
            {selectedLot && (
              <div className="space-y-6">
                {/* Информация о лоте */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">{selectedLot.title}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Текущая цена */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                      <div className="text-sm text-gray-600 mb-2">Текущая цена</div>
                      <div className="text-4xl font-bold text-green-600">
                        {selectedLot.currentPrice.toLocaleString()} ₽
                      </div>
                    </div>

                    {/* Лидер */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6">
                      <div className="text-sm text-gray-600 mb-2">Лидер</div>
                      <div className={`text-2xl font-bold ${selectedLot.leader === 'Вы' ? 'text-amber-600' : 'text-gray-700'}`}>
                        {selectedLot.leader}
                      </div>
                    </div>

                    {/* Шаг ставки */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                      <div className="text-sm text-gray-600 mb-2">Шаг ставки</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedLot.bidStep.toLocaleString()} ₽
                      </div>
                    </div>
                  </div>

                  {/* Панель ставки */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Сделать ставку
                    </h3>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-2">Сумма ставки</label>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-lg font-semibold"
                        />
                      </div>
                      <button
                        onClick={handlePlaceBid}
                        disabled={bidAmount < selectedLot.currentPrice + selectedLot.bidStep}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed self-end"
                      >
                        Сделать ставку
                      </button>
                    </div>

                    {/* Быстрые кнопки */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Быстро:</span>
                      <button
                        onClick={() => handleQuickBid(1)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        +{selectedLot.bidStep}
                      </button>
                      <button
                        onClick={() => handleQuickBid(2)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        +{selectedLot.bidStep * 2}
                      </button>
                      <button
                        onClick={() => handleQuickBid(5)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        +{selectedLot.bidStep * 5}
                      </button>
                    </div>

                    {bidAmount < selectedLot.currentPrice + selectedLot.bidStep && (
                      <div className="mt-3 text-sm text-red-600">
                        Минимальная ставка: {(selectedLot.currentPrice + selectedLot.bidStep).toLocaleString()} ₽
                      </div>
                    )}
                  </div>
                </div>

                {/* История ставок */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    История ставок (последние 10)
                  </h3>

                  <div className="space-y-2">
                    {bids.slice(0, 10).map((bid) => (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          bid.participant === 'Вы' ? 'bg-amber-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <UserIcon className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className={`font-semibold ${bid.participant === 'Вы' ? 'text-amber-600' : 'text-gray-700'}`}>
                              {bid.participant}
                            </div>
                            <div className="text-sm text-gray-500">{bid.time}</div>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          {bid.amount.toLocaleString()} ₽
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
