import React, { useState } from 'react';
import { ArrowLeft, Upload, X, CheckCircle2 } from 'lucide-react';

interface ParticipationRequestFormProps {
  auctionId: number;
  auctionTitle: string;
  auctionHouse: string;
  auctionStatus: string;
  onBack: () => void;
  onSubmit: () => void;
}

export function ParticipationRequestForm({
  auctionId,
  auctionTitle,
  auctionHouse,
  auctionStatus,
  onBack,
  onSubmit
}: ParticipationRequestFormProps) {
  const [formData, setFormData] = useState({
    // Контактное лицо
    contactName: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    email: 'ivan.petrov@example.com',
    // Организация
    orgName: 'ООО "АгрТорг"',
    inn: '1234567890',
    address: '',
    // Условия участия
    acceptConditions: false,
    confirmData: false,
    acceptPersonalData: false,
    emailNotifications: true,
    systemNotifications: true,
    // Комментарий
    comment: ''
  });

  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Валидация
    if (!formData.contactName || !formData.phone || !formData.email ||
        !formData.orgName || !formData.inn ||
        !formData.acceptConditions || !formData.confirmData || !formData.acceptPersonalData) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Проверка ИНН
    const innDigits = formData.inn.replace(/\D/g, '');
    if (innDigits.length !== 10 && innDigits.length !== 12) {
      alert('ИНН должен содержать 10 или 12 цифр');
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Заявка отправлена</h2>
          <p className="text-gray-600 mb-6">
            Организатор рассмотрит заявку. Мы уведомим вас о решении.
          </p>
          <button
            onClick={onSubmit}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all"
          >
            Перейти в "Мои участия"
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Кнопка назад */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Назад</span>
      </button>

      {/* Информация об аукционе */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">{auctionTitle}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{auctionHouse}</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {auctionStatus === 'published' ? 'Опубликован' : auctionStatus === 'planned' ? 'Запланирован' : auctionStatus}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Для участия требуется допуск организатора</p>
      </div>

      {/* Форма заявки */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Заявка на участие</h3>

        {/* Контактное лицо */}
        <div className="mb-6">
          <h4 className="font-medium mb-4 text-gray-700">Контактное лицо</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ФИО <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Организация */}
        <div className="mb-6">
          <h4 className="font-medium mb-4 text-gray-700">Организация</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название организации <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orgName"
                value={formData.orgName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ИНН <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="inn"
                value={formData.inn}
                onChange={handleInputChange}
                placeholder="10 или 12 цифр"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Юридический адрес
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Условия участия */}
        <div className="mb-6">
          <h4 className="font-medium mb-4 text-gray-700">Условия участия</h4>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptConditions"
                checked={formData.acceptConditions}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-amber-500 rounded"
                required
              />
              <span className="text-sm text-gray-700">
                Я принимаю условия аукциона <span className="text-red-500">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="confirmData"
                checked={formData.confirmData}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-amber-500 rounded"
                required
              />
              <span className="text-sm text-gray-700">
                Я подтверждаю достоверность данных <span className="text-red-500">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptPersonalData"
                checked={formData.acceptPersonalData}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-amber-500 rounded"
                required
              />
              <span className="text-sm text-gray-700">
                Я согласен на обработку персональных данных <span className="text-red-500">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-amber-500 rounded"
              />
              <span className="text-sm text-gray-700">
                Получать уведомления по Email
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="systemNotifications"
                checked={formData.systemNotifications}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-amber-500 rounded"
              />
              <span className="text-sm text-gray-700">
                Получать уведомления в системе
              </span>
            </label>
          </div>
        </div>

        {/* Комментарий */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий к заявке
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={4}
            maxLength={1000}
            placeholder="Дополнительная информация (необязательно)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.comment.length} / 1000 символов
          </div>
        </div>

        {/* Файлы */}
        <div className="mb-6">
          <h4 className="font-medium mb-4 text-gray-700">Файлы</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">Загрузить файл</span>
              <span className="text-xs text-gray-400">
                PDF, JPG, PNG, DOCX (например: доверенность, карточка компании, сертификаты)
              </span>
            </label>
          </div>

          {/* Список загруженных файлов */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                      <Upload className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">{file.name}</div>
                      <div className="text-xs text-gray-500">{file.size}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all font-medium"
          >
            Отправить заявку
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
