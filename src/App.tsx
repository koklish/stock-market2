import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterTypeSelect } from './components/RegisterTypeSelect';
import { ParticipantRegister } from './components/ParticipantRegister';
import { AuctionHouseRegister } from './components/AuctionHouseRegister';
import { ForgotPassword } from './components/ForgotPassword';
import { AuctionHouseDashboard } from './components/auction-house/AuctionHouseDashboard';
import { ParticipantDashboard } from './components/participant/ParticipantDashboard';
import { Coins, CheckCircle } from 'lucide-react';

type UserRole = 'admin' | 'auction-house' | 'participant';

type Screen = 
  | 'login' 
  | 'register-type' 
  | 'register-participant' 
  | 'register-auction-house'
  | 'forgot-password'
  | 'success-participant'
  | 'success-auction-house'
  | 'logged-in';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const getUserRole = (email: string): UserRole => {
    if (email === 'admin@admin.ru') return 'admin';
    if (email === 'tender@admin.ru') return 'auction-house';
    if (email === 'post@admin.ru') return 'participant';
    return 'participant'; // default
  };

  const getRoleTitle = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'Администратор';
      case 'auction-house': return 'Аукционный д ом';
      case 'participant': return 'Участник';
    }
  };

  const getRoleDescription = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'Вы вошли в панель администратора';
      case 'auction-house': return 'Вы вошли в личный кабинет аукционного дома';
      case 'participant': return 'Вы вошли в личный кабинет участника';
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginForm
            onForgotPassword={() => setCurrentScreen('forgot-password')}
            onRegister={() => setCurrentScreen('register-type')}
            onLogin={(email) => {
              const role = getUserRole(email);
              setUserRole(role);
              setUserEmail(email);
              setCurrentScreen('logged-in');
            }}
          />
        );
      
      case 'register-type':
        return (
          <RegisterTypeSelect
            onSelectParticipant={() => setCurrentScreen('register-participant')}
            onSelectAuctionHouse={() => setCurrentScreen('register-auction-house')}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );
      
      case 'register-participant':
        return (
          <ParticipantRegister
            onSuccess={() => setCurrentScreen('success-participant')}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );
      
      case 'register-auction-house':
        return (
          <AuctionHouseRegister
            onSuccess={() => setCurrentScreen('success-auction-house')}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );
      
      case 'forgot-password':
        return (
          <ForgotPassword
            onBack={() => setCurrentScreen('login')}
            onSuccess={() => {
              alert('Ссылка для восстановления отправлена на email');
              setCurrentScreen('login');
            }}
          />
        );
      
      case 'success-participant':
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h2 className="mb-2">Регистрация успешна!</h2>
              <p className="text-gray-600 mb-6">
                Добро пожаловать в систему аукционов нумизматики
              </p>
              <button
                onClick={() => setCurrentScreen('login')}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all"
              >
                Войти в систему
              </button>
            </div>
          </div>
        );
      
      case 'success-auction-house':
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h2 className="mb-2">Аукционный дом зарегистрирован!</h2>
              <p className="text-gray-600 mb-6">
                Ваша заявка принята. Теперь вы можете войти в личный кабинет
              </p>
              <button
                onClick={() => setCurrentScreen('login')}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all"
              >
                Войти в личный кабинет
              </button>
            </div>
          </div>
        );
      
      case 'logged-in':
        if (userRole) {
          // Если роль - Аукционный дом, показываем его ЛК
          if (userRole === 'auction-house') {
            return (
              <AuctionHouseDashboard
                onLogout={() => {
                  setUserRole(null);
                  setUserEmail('');
                  setCurrentScreen('login');
                }}
              />
            );
          }

          // Если роль - Участник, показываем его ЛК
          if (userRole === 'participant') {
            return (
              <ParticipantDashboard
                onLogout={() => {
                  setUserRole(null);
                  setUserEmail('');
                  setCurrentScreen('login');
                }}
              />
            );
          }

          // Для остальных ролей - показываем информер
          return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-white to-yellow-50">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {/* Успешная авторизация */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="mb-2">Вы успешно авторизованы!</h2>
                  <p className="text-gray-600">
                    {getRoleDescription(userRole)}
                  </p>
                </div>

                {/* Информация о пользователе */}
                <div className="bg-amber-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Роль:</span>
                    <span className="bg-gradient-to-r from-amber-600 to-yellow-700 bg-clip-text text-transparent">
                      {getRoleTitle(userRole)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-800">{userEmail}</span>
                  </div>
                </div>

                {/* Кнопка выхода */}
                <button
                  onClick={() => {
                    setUserRole(null);
                    setUserEmail('');
                    setCurrentScreen('login');
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
                >
                  Выйти из системы
                </button>
              </div>
            </div>
          );
        }
        return null;
      
      default:
        return null;
    }
  };

  return <>{renderScreen()}</>;
}