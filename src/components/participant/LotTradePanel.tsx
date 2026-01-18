import { useState, useEffect } from 'react';
import { X, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';

type AuctionStatus = 'published' | 'planned' | 'active' | 'completed';

interface Bid {
  id: number;
  time: string;
  userLabel: string;
  amount: number;
  isCurrentUser: boolean;
}

interface LotTradeView {
  lotId: number;
  lotTitle: string;
  lotImage: string;
  startPrice: number;
  currentPrice: number;
  step: number;
  bidsCount: number;
  leaderUserId: string | null;
  myLastBid?: Bid;
  auctionStatus: AuctionStatus;
  isUserApproved: boolean;
  auctionTitle: string;
  bids: Bid[];
  description?: string;
  characteristics?: { key: string; value: string }[];
  documents?: { name: string; url: string }[];
}

interface LotTradePanelProps {
  lot: LotTradeView;
  onClose: () => void;
  onBidSubmit?: (amount: number) => void;
}

export function LotTradePanel({ lot, onClose, onBidSubmit }: LotTradePanelProps) {
  const [bidAmount, setBidAmount] = useState(lot.currentPrice + lot.step);
  const [bidError, setBidError] = useState('');
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Сбрасываем сумму ставки при изменении текущей цены
  useEffect(() => {
    setBidAmount(lot.currentPrice + lot.step);
    setBidError('');
  }, [lot.currentPrice, lot.step]);

  const minBid = lot.currentPrice + lot.step;

  const handleBidChange = (value: string) => {
    const amount = parseInt(value.replace(/\s/g, '')) || 0;
    setBidAmount(amount);

    if (amount < minBid) {
      setBidError(`Ставка должна быть не меньше ${minBid.toLocaleString()} ₽`);
    } else {
      setBidError('');
    }
  };

  const handleQuickBid = (multiplier: number) => {
    const newAmount = lot.currentPrice + (lot.step * multiplier);
    setBidAmount(newAmount);
    setBidError('');
  };

  const handleBidSubmit = () => {
    if (bidAmount < minBid) {
      setBidError(`Ставка должна быть не меньше ${minBid.toLocaleString()} ₽`);
      return;
    }

    if (onBidSubmit) {
      onBidSubmit(bidAmount);
      setNotification({ type: 'success', message: 'Ставка принята!' });
      setTimeout(() => setNotification(null), 3000);
    }
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

  const isUserLeader = lot.leaderUserId === 'current-user';
  const hasUserBid = !!lot.myLastBid;
  const canBid = lot.auctionStatus === 'active' && lot.isUserApproved;

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Уведомление */}
      {notification && (
        <div
          className={`px-4 py-3 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white text-center`}
        >
          {notification.message}
        </div>
      )}

      {/* Хедер */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-semibold mb-1">{lot.lotTitle}</h2>
            <div className="flex items-center gap-2">
              {getStatusBadge(lot.auctionStatus)}
              {lot.auctionStatus === 'active' && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>До конца: 12:34</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="max-h-[600px] overflow-y-auto">
        {/* Блок "Кратко о лоте" */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={lot.lotImage}
                alt={lot.lotTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Стартовая цена:</span>
                <span className="font-semibold">{lot.startPrice.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Текущая цена:</span>
                <span className="font-semibold text-green-600">{lot.currentPrice.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Шаг ставки:</span>
                <span className="font-semibold">{lot.step.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ставок:</span>
                <span className="font-semibold">{lot.bidsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Лидер:</span>
                <span className={`font-semibold ${isUserLeader ? 'text-blue-600' : 'text-gray-700'}`}>
                  {isUserLeader ? 'Вы' : lot.leaderUserId ? 'Участник #2' : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Блок "Сделать ставку" */}
        {canBid ? (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold mb-3">Ваша ставка</h3>
            <div className="space-y-3">
              <div>
                <Input
                  type="text"
                  value={bidAmount.toLocaleString()}
                  onChange={(e) => handleBidChange(e.target.value)}
                  placeholder="Введите сумму ставки"
                  className={`text-lg font-semibold ${bidError ? 'border-red-500' : ''}`}
                />
                {bidError && (
                  <div className="text-red-500 text-sm mt-1">{bidError}</div>
                )}
                <div className="text-sm text-gray-500 mt-1">
                  Минимум: {minBid.toLocaleString()} ₽
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickBid(1)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                >
                  +{lot.step.toLocaleString()} ₽
                </button>
                <button
                  onClick={() => handleQuickBid(2)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                >
                  +{(lot.step * 2).toLocaleString()} ₽
                </button>
                <button
                  onClick={() => handleQuickBid(5)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                >
                  +{(lot.step * 5).toLocaleString()} ₽
                </button>
              </div>

              <button
                onClick={handleBidSubmit}
                disabled={!!bidError}
                className={`w-full px-4 py-2.5 rounded-lg transition-colors text-white font-medium ${
                  bidError ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                Сделать ставку
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-200">
            {!lot.isUserApproved ? (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription>
                  Вы не допущены к участию в этом аукционе
                </AlertDescription>
              </Alert>
            ) : lot.auctionStatus === 'published' || lot.auctionStatus === 'planned' ? (
              <Alert>
                <AlertDescription>
                  Ставки будут доступны после старта торгов
                </AlertDescription>
              </Alert>
            ) : lot.auctionStatus === 'completed' ? (
              <Alert>
                <AlertDescription>
                  Торги завершены
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        )}

        {/* Блок "Текущая ситуация" */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold mb-3">Текущая ситуация</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Вы участвуете:</span>
              <span className="font-semibold">{hasUserBid ? 'Да' : 'Нет'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ваш статус:</span>
              <span className={`font-semibold ${isUserLeader ? 'text-green-600' : hasUserBid ? 'text-red-600' : 'text-gray-700'}`}>
                {isUserLeader ? 'Лидер' : hasUserBid ? 'Перебили' : 'Нет ставок'}
              </span>
            </div>
            {lot.myLastBid && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ваша последняя ставка:</span>
                <span className="font-semibold">
                  {lot.myLastBid.amount.toLocaleString()} ₽
                </span>
              </div>
            )}
            {isUserLeader && (
              <div className="mt-2">
                <Badge variant="success" className="rounded-full px-3">
                  Вы лидируете
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Блок "История ставок" */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold mb-3">История ставок</h3>
          {lot.bids.length > 0 ? (
            <div className="space-y-2">
              {lot.bids.map((bid, index) => (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                    index === 0 ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">{formatTime(bid.time)}</span>
                    <span className={`font-medium ${bid.isCurrentUser ? 'text-blue-600' : 'text-gray-700'}`}>
                      {bid.userLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{bid.amount.toLocaleString()} ₽</span>
                    {index === 0 && (
                      <Badge variant="success" className="text-xs px-2 py-0.5">
                        Лидер
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              Ставок пока нет
            </div>
          )}
        </div>

        {/* Блок "Описание и характеристики" (сворачиваемый) */}
        <div className="p-4">
          <button
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold">Описание и характеристики</h3>
            {isDescriptionOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {isDescriptionOpen && (
            <div className="mt-4 space-y-4">
              {lot.description && (
                <div>
                  <h4 className="font-medium mb-2">Описание</h4>
                  <p className="text-sm text-gray-600">{lot.description}</p>
                </div>
              )}
              {lot.characteristics && lot.characteristics.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Характеристики</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {lot.characteristics.map((char, index) => (
                      <div
                        key={index}
                        className={`flex text-sm ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex-1 px-3 py-2 border-r border-gray-200 text-gray-500">
                          {char.key}
                        </div>
                        <div className="flex-1 px-3 py-2 font-medium">{char.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {lot.documents && lot.documents.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Документы</h4>
                  <div className="space-y-2">
                    {lot.documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.url}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="w-4 h-4" />
                        {doc.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
