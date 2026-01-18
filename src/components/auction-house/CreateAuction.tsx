import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  Edit,
  Copy,
  Trash2,
  Eye,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Building2,
  Clock,
  Phone,
  Globe,
  MapPin
} from 'lucide-react';

interface Lot {
  id: number;
  number: number;
  name: string;
  description: string;
  images: string[];
  videoUrl: string;
  tags: string;
  category: string;
  startPrice: number;
  contractNumber: string;
}

interface AuctionData {
  title: string;
  date: string;
  time: string;
  commission: number;
  format: 'in-person' | 'online';
  rules: string;
  coverImage: string;
}

interface NewAuction {
  title: string;
  image: string;
  date: string;
  status: 'published';
  lotsCount: number;
  commission: number;
}

interface CreateAuctionProps {
  onBack: () => void;
  onCreateAuction: (auction: NewAuction) => void;
  auctionHouseData: {
    name: string;
    logo: string;
    address: string;
    phone: string;
    website: string;
    workingHours: string;
  };
}

export function CreateAuction({ onBack, onCreateAuction, auctionHouseData }: CreateAuctionProps) {
  const [currentBlock, setCurrentBlock] = useState<1 | 2 | 3 | 4>(1);
  const [auctionData, setAuctionData] = useState<AuctionData>({
    title: '',
    date: '',
    time: '',
    commission: 0,
    format: 'online',
    rules: '',
    coverImage: ''
  });

  const [lots, setLots] = useState<Lot[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid'>('unpaid');
  const [isBlock1Saved, setIsBlock1Saved] = useState(false);
  const [showLotForm, setShowLotForm] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [lotsPerPage, setLotsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');

  // Форма лота
  const [lotForm, setLotForm] = useState({
    name: '',
    description: '',
    images: [] as string[],
    videoUrl: '',
    tags: '',
    category: '',
    startPrice: 0,
    contractNumber: ''
  });

  const canProceedToBlock2 = isBlock1Saved;
  const canProceedToBlock3 = lots.length > 0;
  const canProceedToBlock4 = paymentStatus === 'paid';

  const handleSaveBlock1 = () => {
    if (!auctionData.title || !auctionData.date || !auctionData.time || auctionData.commission === null || auctionData.commission === undefined || !auctionData.rules) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    setIsBlock1Saved(true);
    alert('Информация об аукционе сохранена');
  };

  const handleAddLot = () => {
    if (!lotForm.name || !lotForm.category || !lotForm.startPrice || !lotForm.contractNumber) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingLot) {
      // Редактирование существующего лота
      setLots(lots.map(lot => 
        lot.id === editingLot.id 
          ? { ...lot, ...lotForm, id: editingLot.id, number: editingLot.number }
          : lot
      ));
    } else {
      // Добавление нового лота
      const newLot: Lot = {
        id: Date.now(),
        number: lots.length + 1,
        ...lotForm
      };
      setLots([...lots, newLot]);
    }

    // Сброс формы
    setLotForm({
      name: '',
      description: '',
      images: [],
      videoUrl: '',
      tags: '',
      category: '',
      startPrice: 0,
      contractNumber: ''
    });
    setShowLotForm(false);
    setEditingLot(null);
  };

  const handleEditLot = (lot: Lot) => {
    setEditingLot(lot);
    setLotForm({
      name: lot.name,
      description: lot.description,
      images: lot.images,
      videoUrl: lot.videoUrl,
      tags: lot.tags,
      category: lot.category,
      startPrice: lot.startPrice,
      contractNumber: lot.contractNumber
    });
    setShowLotForm(true);
  };

  const handleDeleteLot = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот лот?')) {
      const updatedLots = lots.filter(lot => lot.id !== id);
      // Пересчитываем номера
      const reindexedLots = updatedLots.map((lot, index) => ({
        ...lot,
        number: index + 1
      }));
      setLots(reindexedLots);
    }
  };

  const handleCopyLot = (lot: Lot) => {
    const newLot: Lot = {
      ...lot,
      id: Date.now(),
      number: lots.length + 1,
      name: `${lot.name} (копия)`
    };
    setLots([...lots, newLot]);
  };

  const handleMoveLot = (index: number, direction: 'up' | 'down') => {
    const newLots = [...lots];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newLots.length) return;

    [newLots[index], newLots[targetIndex]] = [newLots[targetIndex], newLots[index]];
    
    // Пересчитываем номера
    const reindexedLots = newLots.map((lot, idx) => ({
      ...lot,
      number: idx + 1
    }));
    
    setLots(reindexedLots);
  };

  const handlePayment = (method: string) => {
    alert(`Выбран способ оплаты: ${method}\nПосле успешной оплаты статус будет обновлен.`);
    // Имитация успешной оплаты
    setTimeout(() => {
      setPaymentStatus('paid');
    }, 1000);
  };

  const handleOpenAuction = () => {
    // Создаём новый аукцион
    const newAuction: NewAuction = {
      title: auctionData.title,
      image: auctionData.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      date: `${auctionData.date} ${auctionData.time}`,
      status: 'published',
      lotsCount: lots.length,
      commission: auctionData.commission
    };

    onCreateAuction(newAuction);
    alert('Аукцион успешно создан и опубликован на МБ-маркет!');
    onBack();
  };

  const filteredLots = lots.filter(lot => 
    lot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Шапка */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Вернуться к списку аукционов
          </button>
          <h1 className="">Создание аукциона</h1>
        </div>

        {/* Индикатор прогресса */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Информация', active: currentBlock === 1, completed: isBlock1Saved },
              { num: 2, label: 'Каталог', active: currentBlock === 2, completed: lots.length > 0 },
              { num: 3, label: 'Оплата', active: currentBlock === 3, completed: paymentStatus === 'paid' },
              { num: 4, label: 'Публикация', active: currentBlock === 4, completed: false }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      step.completed
                        ? 'bg-green-500 text-white'
                        : step.active
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.completed ? <CheckCircle className="w-6 h-6" /> : step.num}
                  </div>
                  <div className="text-sm mt-2">{step.label}</div>
                </div>
                {index < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-colors ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* БЛОК 1: Информация по аукиону */}
        {currentBlock === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="mb-6">Блок 1: Информация по аукциону</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Название аукциона */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Название аукциона <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={auctionData.title}
                  onChange={(e) => setAuctionData({ ...auctionData, title: e.target.value })}
                  placeholder="Введите название аукциона"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Дата проведения */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Дата проведения <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={auctionData.date}
                  onChange={(e) => setAuctionData({ ...auctionData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Время проведения */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Время проведения <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={auctionData.time}
                  onChange={(e) => setAuctionData({ ...auctionData, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Комиссия АД */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Комиссия Аукционного дома (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={auctionData.commission || ''}
                  onChange={(e) => setAuctionData({ ...auctionData, commission: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Форма проведения */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Форма проведения <span className="text-red-500">*</span>
                </label>
                <select
                  value={auctionData.format}
                  onChange={(e) => setAuctionData({ ...auctionData, format: e.target.value as 'in-person' | 'online' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                >
                  <option value="in-person">Очная</option>
                  <option value="online">Заочная интернет-аукцион</option>
                </select>
              </div>
            </div>

            {/* Правила проведения торгов */}
            <div className="mb-8">
              <label className="block text-gray-700 mb-2">
                Правила проведения торгов <span className="text-red-500">*</span>
              </label>
              <textarea
                value={auctionData.rules}
                onChange={(e) => setAuctionData({ ...auctionData, rules: e.target.value })}
                placeholder="Опишите правила проведения торгов..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Заставка к аукциону */}
            <div className="mb-8">
              <label className="block text-gray-700 mb-2">Заставка к аукциону</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Нажмите для загрузки изображения</p>
                <p className="text-sm text-gray-500">PNG, JPG до 5MB</p>
              </div>
            </div>

            {/* Информация об АД (readonly) */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="mb-4">Информация об Аукционном доме</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Название</div>
                    <div className="">{auctionHouseData.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Адрес</div>
                    <div className="">{auctionHouseData.address}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Время работы</div>
                    <div className="">{auctionHouseData.workingHours}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Телефон</div>
                    <div className="">{auctionHouseData.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Сайт</div>
                    <div className="">{auctionHouseData.website}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3">
              <button
                onClick={handleSaveBlock1}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md"
              >
                <Save className="w-5 h-5" />
                Сохранить
              </button>
              <button
                onClick={() => {
                  if (canProceedToBlock2) {
                    setCurrentBlock(2);
                  } else {
                    alert('Сначала сохраните информацию об аукционе');
                  }
                }}
                disabled={!canProceedToBlock2}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  canProceedToBlock2
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Перейти к каталогу
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* БЛОК 2: Каталог аукциона */}
        {currentBlock === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="mb-6">Блок 2: Каталог аукциона (лот-лист)</h2>

            {/* Верхняя панель управления */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Лотов на страние:</label>
                  <select
                    value={lotsPerPage}
                    onChange={(e) => setLotsPerPage(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={150}>150</option>
                    <option value={200}>200</option>
                  </select>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск лота..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="w-5 h-5" />
                  Предварительный просмотр
                </button>
                <button
                  onClick={() => setShowLotForm(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Добавить лот
                </button>
              </div>
            </div>

            {/* Таблица лотов */}
            {lots.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">Лоты еще не добавлены</p>
                <button
                  onClick={() => setShowLotForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Добавить первый лот
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm text-gray-600">№ п/п</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600">Наименование лота</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600">Метки</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600">Изображение</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600">Стартовая цена (₽)</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600">Договор комиссии №</th>
                      <th className="px-4 py-3 text-left text-sm text-gray-600">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLots.map((lot, index) => (
                      <tr key={lot.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">{lot.number}</td>
                        <td className="px-4 py-3">
                          <div className="">{lot.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lot.tags || '—'}</td>
                        <td className="px-4 py-3">
                          {lot.images.length > 0 ? (
                            <div className="w-12 h-12 bg-gray-200 rounded"></div>
                          ) : (
                            <span className="text-sm text-gray-400">Нет</span>
                          )}
                        </td>
                        <td className="px-4 py-3">{lot.startPrice.toLocaleString()} ₽</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lot.contractNumber}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveLot(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              title="Переместить вверх"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveLot(index, 'down')}
                              disabled={index === lots.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              title="Переместить вниз"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditLot(lot)}
                              className="p-1 text-blue-500 hover:text-blue-700"
                              title="Редактировать"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCopyLot(lot)}
                              className="p-1 text-green-500 hover:text-green-700"
                              title="Копировать"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLot(lot.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Кнопки навигации */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setCurrentBlock(1)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Назад
              </button>
              <button
                onClick={() => {
                  if (canProceedToBlock3) {
                    setCurrentBlock(3);
                  } else {
                    alert('Добавьте хотя бы один лот');
                  }
                }}
                disabled={!canProceedToBlock3}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  canProceedToBlock3
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Перейти к оплате
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Модальное окно добавления/редактирования лота */}
        {showLotForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="">{editingLot ? 'Редактирование лота' : 'Добавление лота'}</h2>
                <button
                  onClick={() => {
                    setShowLotForm(false);
                    setEditingLot(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Название лота */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Название лота <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lotForm.name}
                    onChange={(e) => setLotForm({ ...lotForm, name: e.target.value })}
                    placeholder="Введите название лота"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Описание */}
                <div>
                  <label className="block text-gray-700 mb-2">Описание лота</label>
                  <textarea
                    value={lotForm.description}
                    onChange={(e) => setLotForm({ ...lotForm, description: e.target.value })}
                    placeholder="Введите описание..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                  />
                </div>

                {/* Загрузка изображений */}
                <div>
                  <label className="block text-gray-700 mb-2">Изображения (до 10 файлов)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Нажмите для загрузки изображений</p>
                  </div>
                </div>

                {/* Ссылка на видео */}
                <div>
                  <label className="block text-gray-700 mb-2">Ссылка на видео</label>
                  <input
                    type="url"
                    value={lotForm.videoUrl}
                    onChange={(e) => setLotForm({ ...lotForm, videoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Идентификаторы (метки) */}
                <div>
                  <label className="block text-gray-700 mb-2">Идентификаторы (метки)</label>
                  <input
                    type="text"
                    value={lotForm.tags}
                    onChange={(e) => setLotForm({ ...lotForm, tags: e.target.value })}
                    placeholder="монеты, серебро, редкие"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Раздел */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Раздел <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={lotForm.category}
                      onChange={(e) => setLotForm({ ...lotForm, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="">Выберите раздел</option>
                      <option value="coins">Монеты и банкноты</option>
                      <option value="medals">Ордена и медали</option>
                      <option value="jewelry">Ювелирные изделия</option>
                      <option value="antiques">Антиквариат</option>
                      <option value="art">Произведения искусства</option>
                      <option value="stamps">Марки и филателия</option>
                    </select>
                  </div>

                  {/* Стартовая цена */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Стартовая цена (₽) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={lotForm.startPrice || ''}
                      onChange={(e) => setLotForm({ ...lotForm, startPrice: Number(e.target.value) })}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Договор комиссии */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Договор комиссии № <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lotForm.contractNumber}
                    onChange={(e) => setLotForm({ ...lotForm, contractNumber: e.target.value })}
                    placeholder="Введите номер договора"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddLot}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setShowLotForm(false);
                    setEditingLot(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* БЛОК 3: Оплата размещения */}
        {currentBlock === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="mb-6">Блок 3: Оплата размещения аукциона</h2>

            <div className="max-w-2xl mx-auto">
              {/* Статус оплаты */}
              <div className="mb-8">
                {paymentStatus === 'unpaid' ? (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <div className="text-red-900">Статус оплаты: Не оплачено</div>
                      <div className="text-sm text-red-700">Выберите способ оплаты для активации аукциона</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="text-green-900">Статус оплаты: Оплачено</div>
                      <div className="text-sm text-green-700">Аукцион готов к публикации на МБ-маркет</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Способы оплаты */}
              {paymentStatus === 'unpaid' && (
                <div className="space-y-3 mb-8">
                  <h3 className="mb-4">Выберите способ оплаты:</h3>
                  
                  <button
                    onClick={() => handlePayment('Реквизиты счета')}
                    className="w-full flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors"
                  >
                    <Building2 className="w-6 h-6 text-amber-600" />
                    <div className="text-left">
                      <div className="">Оплатить по реквизитам счета</div>
                      <div className="text-sm text-gray-600">Банковский перевод</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePayment('Банковская карта')}
                    className="w-full flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors"
                  >
                    <CreditCard className="w-6 h-6 text-amber-600" />
                    <div className="text-left">
                      <div className="">Оплатить картой</div>
                      <div className="text-sm text-gray-600">Visa, MasterCard, МИР</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePayment('QR-код')}
                    className="w-full flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center text-white text-xs">
                      QR
                    </div>
                    <div className="text-left">
                      <div className="">Оплатить по QR</div>
                      <div className="text-sm text-gray-600">СБП и другие системы</div>
                    </div>
                  </button>
                </div>
              )}

              {/* Кнопки навигации */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentBlock(2)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Назад
                </button>
                <button
                  onClick={() => {
                    if (canProceedToBlock4) {
                      setCurrentBlock(4);
                    } else {
                      alert('Сначала оплатите размещение аукциона');
                    }
                  }}
                  disabled={!canProceedToBlock4}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    canProceedToBlock4
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Перейти к публикации
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* БЛОК 4: Открытие аукциона на МБ-маркет */}
        {currentBlock === 4 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="mb-6">Блок 4: Открытие аукциона на МБ-маркет</h2>

            <div className="max-w-2xl mx-auto text-center">
              {paymentStatus === 'paid' ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="mb-4">Аукцион готов к публикации!</h3>
                  <p className="text-gray-600 mb-8">
                    После нажатия кнопки «Открыть аукцион» все участники платформы МБ-маркет смогут просматривать каталог лотов и делать ставки.
                  </p>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-left">
                    <h4 className="mb-3">Что произойдет после открытия:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Аукцион станет доступен всем участникам платформы</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Будет опубликован полный каталог с {lots.length} лотами</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Участники смогут делать ставки начиная со стартовых цен</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>Редактирование аукциона будет заблокировано</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleOpenAuction}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-lg text-lg"
                  >
                    Открыть аукцион на МБ-маркет
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <h3 className="mb-4">Недоступно</h3>
                  <p className="text-gray-600 mb-8">
                    Для публикации аукциона необходимо оплатить размещение.
                  </p>
                </>
              )}

              <div className="flex gap-3 justify-center mt-8">
                <button
                  onClick={() => setCurrentBlock(3)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Назад
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}