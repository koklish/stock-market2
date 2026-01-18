import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Check, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type PaymentMethod = 'card' | 'sbp' | 'invoice';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: any;
}

interface PaymentFormProps {
  lotTitle: string;
  lotPrice: number;
  onClose: () => void;
  onSubmit: (paymentData: PaymentFormData) => void;
}

export interface PaymentFormData {
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolder?: string;
  companyName?: string;
  inn?: string;
  kpp?: string;
  legalAddress?: string;
}

export function PaymentForm({
  lotTitle,
  lotPrice,
  onClose,
  onSubmit
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [inn, setInn] = useState('');
  const [kpp, setKpp] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'card',
      name: 'Банковская карта',
      description: 'Visa, MasterCard, МИР',
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 'sbp',
      name: 'СБП (Система быстрых платежей)',
      description: 'Моментальный перевод по QR-коду',
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 'invoice',
      name: 'Счёт для юр. лиц',
      description: 'Выставим счёт для организации',
      icon: <Building2 className="w-6 h-6" />
    }
  ];

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedMethod === 'card') {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Укажите номер карты';
      } else if (cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Некорректный номер карты';
      }

      if (!cardExpiry.trim()) {
        newErrors.cardExpiry = 'Укажите срок действия';
      }

      if (!cardCvv.trim()) {
        newErrors.cardCvv = 'Укажите CVV';
      } else if (cardCvv.length < 3) {
        newErrors.cardCvv = 'Некорректный CVV';
      }

      if (!cardHolder.trim()) {
        newErrors.cardHolder = 'Укажите имя держателя';
      }
    }

    if (selectedMethod === 'invoice') {
      if (!companyName.trim()) {
        newErrors.companyName = 'Укажите название организации';
      }

      if (!inn.trim()) {
        newErrors.inn = 'Укажите ИНН';
      }

      if (!legalAddress.trim()) {
        newErrors.legalAddress = 'Укажите юридический адрес';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsProcessing(true);

      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentData: PaymentFormData = {
        paymentMethod: selectedMethod,
        cardNumber: selectedMethod === 'card' ? cardNumber : undefined,
        cardExpiry: selectedMethod === 'card' ? cardExpiry : undefined,
        cardCvv: selectedMethod === 'card' ? cardCvv : undefined,
        cardHolder: selectedMethod === 'card' ? cardHolder : undefined,
        companyName: selectedMethod === 'invoice' ? companyName : undefined,
        inn: selectedMethod === 'invoice' ? inn : undefined,
        kpp: selectedMethod === 'invoice' ? kpp : undefined,
        legalAddress: selectedMethod === 'invoice' ? legalAddress : undefined,
      };

      setIsProcessing(false);
      onSubmit(paymentData);
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Хедер */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Оплата лота</h2>
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
          {/* Левая колонка - выбор способа оплаты */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Способ оплаты</h3>
              <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
                <div className="space-y-3">
                  {paymentOptions.map((option) => (
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
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                        <RadioGroupItem value={option.id} className="sr-only" />
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Информация о безопасности */}
            <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-1">Безопасная оплата</div>
                <div className="opacity-90">Все данные защищены SSL-шифрованием. Мы не храним данные вашей карты.</div>
              </div>
            </div>
          </div>

          {/* Правая колонка - форма оплаты */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Данные для оплаты</h3>

              {/* Оплата картой */}
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label>Номер карты *</Label>
                    <Input
                      value={formatCardNumber(cardNumber)}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className={errors.cardNumber ? 'border-red-500' : ''}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Срок действия *</Label>
                      <Input
                        value={formatExpiry(cardExpiry)}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={errors.cardExpiry ? 'border-red-500' : ''}
                      />
                      {errors.cardExpiry && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>
                      )}
                    </div>

                    <div>
                      <Label>CVV *</Label>
                      <Input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="000"
                        maxLength={3}
                        type="password"
                        className={errors.cardCvv ? 'border-red-500' : ''}
                      />
                      {errors.cardCvv && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Имя держателя *</Label>
                    <Input
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="IVAN IVANOV"
                      className={errors.cardHolder ? 'border-red-500' : ''}
                    />
                    {errors.cardHolder && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>
                    )}
                  </div>
                </div>
              )}

              {/* СБП */}
              {selectedMethod === 'sbp' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <Smartphone className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Оплата через СБП</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      После подтверждения заказа мы отправим QR-код на ваш email для оплаты через приложение банка
                    </p>
                  </div>
                </div>
              )}

              {/* Счёт для юр. лиц */}
              {selectedMethod === 'invoice' && (
                <div className="space-y-4">
                  <div>
                    <Label>Название организации *</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="ООО 'Ромашка'"
                      className={errors.companyName ? 'border-red-500' : ''}
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>ИНН *</Label>
                      <Input
                        value={inn}
                        onChange={(e) => setInn(e.target.value)}
                        placeholder="1234567890"
                        className={errors.inn ? 'border-red-500' : ''}
                      />
                      {errors.inn && (
                        <p className="text-red-500 text-sm mt-1">{errors.inn}</p>
                      )}
                    </div>

                    <div>
                      <Label>КПП</Label>
                      <Input
                        value={kpp}
                        onChange={(e) => setKpp(e.target.value)}
                        placeholder="123456789"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Юридический адрес *</Label>
                    <Input
                      value={legalAddress}
                      onChange={(e) => setLegalAddress(e.target.value)}
                      placeholder="г. Москва, ул. Примерная, д. 1"
                      className={errors.legalAddress ? 'border-red-500' : ''}
                    />
                    {errors.legalAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.legalAddress}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Итоговая информация */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                К оплате
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Лот:</span>
                  <span className="font-medium">{lotTitle}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-lg">
                  <span className="font-semibold">Всего:</span>
                  <span className="font-bold text-amber-600">{lotPrice.toLocaleString()} ₽</span>
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
            disabled={isProcessing}
            className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Обработка...
              </span>
            ) : (
              `Оплатить ${lotPrice.toLocaleString()} ₽`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
