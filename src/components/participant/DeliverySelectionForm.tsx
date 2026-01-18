import React, { useState } from 'react';
import { X, Truck, Package, MapPin, CreditCard, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type DeliveryMethod = 'courier' | 'pickup' | 'cdek' | 'russian-post';

interface DeliveryOption {
  id: DeliveryMethod;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: any;
}

interface DeliverySelectionFormProps {
  lotTitle: string;
  lotPrice: number;
  onClose: () => void;
  onSubmit: (deliveryData: DeliveryFormData) => void;
  onSuccess?: () => void;
}

export interface DeliveryFormData {
  deliveryMethod: DeliveryMethod;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  comment?: string;
  deliveryPrice: number;
}

export function DeliverySelectionForm({
  lotTitle,
  lotPrice,
  onClose,
  onSubmit,
  onSuccess
}: DeliverySelectionFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod>('courier');
  const [recipientName, setRecipientName] = useState('Иван Петров');
  const [recipientPhone, setRecipientPhone] = useState('+7 (999) 123-45-67');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'courier',
      name: 'Курьерская доставка',
      description: 'Доставка курьером по Москве в пределах МКАД',
      price: 500,
      estimatedDays: '1-2 дня',
      icon: <Truck className="w-6 h-6" />
    },
    {
      id: 'cdek',
      name: 'СДЭК',
      description: 'Доставка в пункты выдачи или курьером по России',
      price: 350,
      estimatedDays: '2-5 дней',
      icon: <Package className="w-6 h-6" />
    },
    {
      id: 'russian-post',
      name: 'Почта России',
      description: 'Доставка почтой по всей стране',
      price: 250,
      estimatedDays: '5-10 дней',
      icon: <Package className="w-6 h-6" />
    },
    {
      id: 'pickup',
      name: 'Самовывоз',
      description: 'Забрать лот самостоятельно в офисе аукционного дома',
      price: 0,
      estimatedDays: 'Сегодня',
      icon: <MapPin className="w-6 h-6" />
    }
  ];

  const selectedOption = deliveryOptions.find(opt => opt.id === selectedMethod);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!recipientName.trim()) {
      newErrors.recipientName = 'Укажите имя получателя';
    }

    if (!recipientPhone.trim()) {
      newErrors.recipientPhone = 'Укажите телефон получателя';
    }

    if (selectedMethod !== 'pickup' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Укажите адрес доставки';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Отправляем данные
      onSubmit({
        deliveryMethod: selectedMethod,
        recipientName,
        recipientPhone,
        deliveryAddress: selectedMethod === 'pickup' ? 'Самовывоз' : deliveryAddress,
        comment,
        deliveryPrice: selectedOption?.price || 0
      });

      // Вызываем callback onSuccess если он есть
      if (onSuccess) {
        onSuccess();
      }

      // Закрываем форму
      onClose();
    }
  };

  const totalPrice = lotPrice + (selectedOption?.price || 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Хедер */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Оформление доставки</h2>
            <p className="text-gray-600">{lotTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая колонка - выбор доставки */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Способ доставки</h3>
              <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as DeliveryMethod)}>
                <div className="space-y-3">
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedMethod === option.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMethod(option.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedMethod === option.id ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{option.name}</h4>
                            {selectedMethod === option.id && (
                              <Check className="w-5 h-5 text-amber-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-semibold text-amber-600">
                              {option.price === 0 ? 'Бесплатно' : `${option.price.toLocaleString()} ₽`}
                            </span>
                            <span className="text-gray-500">{option.estimatedDays}</span>
                          </div>
                        </div>
                        <RadioGroupItem value={option.id} className="sr-only" />
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Правая колонка - данные получателя */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Данные получателя</h3>
              <div className="space-y-4">
                <div>
                  <Label>ФИО получателя *</Label>
                  <Input
                    id="recipientName"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className={errors.recipientName ? 'border-red-500' : ''}
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
                  )}
                </div>

                <div>
                  <Label>Телефон *</Label>
                  <Input
                    id="recipientPhone"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className={errors.recipientPhone ? 'border-red-500' : ''}
                  />
                  {errors.recipientPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientPhone}</p>
                  )}
                </div>

                {selectedMethod !== 'pickup' && (
                  <div>
                    <Label>Адрес доставки *</Label>
                    <Textarea
                      id="deliveryAddress"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Город, улица, дом, квартира, индекс"
                      rows={3}
                      className={errors.deliveryAddress ? 'border-red-500' : ''}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                    )}
                  </div>
                )}

                <div>
                  <Label>Комментарий к заказу</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Код домофона, ориентиры и т.д."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Итоговая информация */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Итого к оплате
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Стоимость лота:</span>
                  <span className="font-medium">{lotPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Доставка ({selectedOption?.name}):</span>
                  <span className="font-medium">
                    {selectedOption?.price === 0 ? 'Бесплатно' : `${selectedOption?.price.toLocaleString()} ₽`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-lg">
                  <span className="font-semibold">Всего:</span>
                  <span className="font-bold text-amber-600">{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Футер */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Отмена
          </button>
          <Button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-lg transition-all"
          >
            Подтвердить заказ
          </Button>
        </div>
      </div>
    </div>
  );
}
