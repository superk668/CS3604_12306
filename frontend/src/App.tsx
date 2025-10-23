import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import TrainListPage from './pages/TrainListPage'
import OrderPage from './pages/OrderPage'
import ProfilePage from './pages/ProfilePage'
import Login from './components/Login'
import Register from './components/Register'

interface LoginFormData {
  username: string;
  password: string;
  captcha: string;
  rememberUsername: boolean;
  autoLogin: boolean;
}

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  idType: string;
  realName: string;
  idNumber: string;
  email: string;
  phoneNumber: string;
  passengerType: string;
  phoneVerificationCode: string;
  agreementAccepted: boolean;
}

function App() {
  const handleLogin = (formData: LoginFormData) => {
    console.log('登录数据:', formData);
    // 这里可以添加登录逻辑，比如调用API
    alert(`登录成功！欢迎 ${formData.username}`);
    // 登录成功后跳转到首页
    window.location.href = '/';
  };

  const handleRegister = (formData: RegisterFormData) => {
    console.log('注册数据:', formData);
    // 这里可以添加注册逻辑，比如调用API
    alert(`注册成功！欢迎 ${formData.realName}，请登录您的账户`);
    // 注册成功后跳转到登录页面
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/train-list" element={<TrainListPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route 
            path="/login" 
            element={
              <Login 
                onLogin={handleLogin}
                onNavigateToRegister={() => window.location.href = '/register'}
              />
            } 
          />
          <Route 
            path="/register" 
            element={
              <Register 
                onRegister={handleRegister}
                onNavigateToLogin={() => window.location.href = '/login'}
              />
            } 
          />
          {/* 重定向未匹配的路由到首页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
