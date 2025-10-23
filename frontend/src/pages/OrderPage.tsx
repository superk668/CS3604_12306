import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AddPassengerModal from '../components/AddPassengerModal';
import './OrderPage.css';

interface TrainInfo {
  trainNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  seatType: string;
  price: number;
}

interface Passenger {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  passengerType: '成人' | '儿童' | '学生';
}

interface TicketInfo {
  passengerId: string;
  passengerName: string;
  seatType: string;
  ticketType: '成人票' | '儿童票' | '学生票';
  price: number;
}

const OrderPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [trainInfo, setTrainInfo] = useState<TrainInfo | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const [ticketInfos, setTicketInfos] = useState<TicketInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 从路由参数获取列车信息
    const searchParams = new URLSearchParams(location.search);
    const trainData = {
      trainNumber: searchParams.get('trainNumber') || 'G1234',
      from: searchParams.get('from') || '北京南',
      to: searchParams.get('to') || '上海虹桥',
      departureTime: searchParams.get('departureTime') || '08:00',
      arrivalTime: searchParams.get('arrivalTime') || '12:30',
      date: searchParams.get('date') || '2025-01-20',
      duration: searchParams.get('duration') || '4小时30分',
      seatType: searchParams.get('seatType') || '二等座',
      price: parseInt(searchParams.get('price') || '553')
    };
    setTrainInfo(trainData);

    // 模拟获取用户常用联系人
    const mockPassengers: Passenger[] = [
      {
        id: '1',
        name: '张三',
        idCard: '110101199001011234',
        phone: '13800138000',
        passengerType: '成人'
      },
      {
        id: '2',
        name: '李四',
        idCard: '110101199501011234',
        phone: '13800138001',
        passengerType: '成人'
      }
    ];
    setPassengers(mockPassengers);
  }, [location]);

  const handlePassengerSelect = (passengerId: string) => {
    const isSelected = selectedPassengers.includes(passengerId);
    if (isSelected) {
      setSelectedPassengers(prev => prev.filter(id => id !== passengerId));
      setTicketInfos(prev => prev.filter(info => info.passengerId !== passengerId));
    } else {
      setSelectedPassengers(prev => [...prev, passengerId]);
      const passenger = passengers.find(p => p.id === passengerId);
      if (passenger && trainInfo) {
        const newTicketInfo: TicketInfo = {
          passengerId: passenger.id,
          passengerName: passenger.name,
          seatType: trainInfo.seatType,
          ticketType: passenger.passengerType === '成人' ? '成人票' : 
                     passenger.passengerType === '儿童' ? '儿童票' : '学生票',
          price: trainInfo.price
        };
        setTicketInfos(prev => [...prev, newTicketInfo]);
      }
    }
  };

  const handleSeatTypeChange = (passengerId: string, seatType: string) => {
    setTicketInfos(prev => prev.map(info => 
      info.passengerId === passengerId 
        ? { ...info, seatType, price: getSeatPrice(seatType) }
        : info
    ));
  };

  const getSeatPrice = (seatType: string): number => {
    const basePrices: { [key: string]: number } = {
      '商务座': 1748,
      '一等座': 933,
      '二等座': 553,
      '无座': 553
    };
    return basePrices[seatType] || 553;
  };

  const getTotalPrice = (): number => {
    return ticketInfos.reduce((total, info) => total + info.price, 0);
  };

  const handleSubmitOrder = async () => {
    if (selectedPassengers.length === 0) {
      alert('请选择乘车人');
      return;
    }

    // 验证所有必要信息
    const hasIncompleteInfo = ticketInfos.some(info => !info.seatType || !info.passengerName);
    if (hasIncompleteInfo) {
      alert('请完善所有乘车人的购票信息');
      return;
    }

    setIsSubmitting(true);
    try {
      // 构建订单数据
      const orderData = {
        trainInfo,
        passengers: selectedPassengers.map(id => passengers.find(p => p.id === id)),
        ticketInfos,
        totalPrice: getTotalPrice(),
        orderTime: new Date().toISOString(),
        orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // 模拟API调用
      console.log('提交订单数据:', orderData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟成功响应
      const success = Math.random() > 0.1; // 90% 成功率
      
      if (success) {
        alert(`订单提交成功！\n订单号：${orderData.orderId}\n总金额：¥${orderData.totalPrice}`);
        // 这里可以导航到订单详情页面或订单列表页面
        // navigate(`/order-detail/${orderData.orderId}`);
        navigate('/');
      } else {
        throw new Error('订单提交失败');
      }
    } catch (error) {
      console.error('订单提交错误:', error);
      alert('订单提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPassenger = (passengerData: Omit<Passenger, 'id'>) => {
    const newPassenger: Passenger = {
      ...passengerData,
      id: Date.now().toString()
    };
    setPassengers(prev => [...prev, newPassenger]);
  };

  if (!trainInfo) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="order-page">
      <div className="order-container">
        <div className="order-header">
          <h2>确认订单信息</h2>
          <div className="breadcrumb">
            <span>车票预订</span>
            <span className="separator">&gt;</span>
            <span className="current">确认订单</span>
          </div>
        </div>

        {/* 列车信息 */}
        <div className="train-info-section">
          <div className="section-header">
            <h3>列车信息</h3>
          </div>
          <div className="train-info-card">
            <div className="train-number">{trainInfo.trainNumber}</div>
            <div className="train-route">
              <div className="departure">
                <div className="station">{trainInfo.from}</div>
                <div className="time">{trainInfo.departureTime}</div>
              </div>
              <div className="duration">
                <div className="arrow">→</div>
                <div className="time-duration">{trainInfo.duration}</div>
              </div>
              <div className="arrival">
                <div className="station">{trainInfo.to}</div>
                <div className="time">{trainInfo.arrivalTime}</div>
              </div>
            </div>
            <div className="train-date">{trainInfo.date}</div>
          </div>
        </div>

        {/* 乘客信息 */}
        <div className="passenger-section">
          <div className="section-header">
            <h3>选择乘车人</h3>
            <button className="add-passenger-btn" onClick={() => setIsModalOpen(true)}>+ 添加乘车人</button>
          </div>
          <div className="passenger-list">
            {passengers.map(passenger => (
              <div 
                key={passenger.id} 
                className={`passenger-item ${selectedPassengers.includes(passenger.id) ? 'selected' : ''}`}
                onClick={() => handlePassengerSelect(passenger.id)}
              >
                <div className="passenger-checkbox">
                  <input 
                    type="checkbox" 
                    checked={selectedPassengers.includes(passenger.id)}
                    onChange={() => {}}
                  />
                </div>
                <div className="passenger-info">
                  <div className="passenger-name">{passenger.name}</div>
                  <div className="passenger-id">{passenger.idCard}</div>
                  <div className={`passenger-type ${passenger.passengerType === '成人' ? 'adult' : passenger.passengerType === '儿童' ? 'child' : 'student'}`}>
                    {passenger.passengerType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 购票信息 */}
        {ticketInfos.length > 0 && (
          <div className="ticket-info-section">
            <div className="section-header">
              <h3>购票信息</h3>
            </div>
            <div className="ticket-table">
              <div className="table-header">
                <div className="col-passenger">乘车人</div>
                <div className="col-ticket-type">票种</div>
                <div className="col-seat-type">席别</div>
                <div className="col-price">票价</div>
              </div>
              {ticketInfos.map(info => (
                <div key={info.passengerId} className="table-row">
                  <div className="col-passenger">{info.passengerName}</div>
                  <div className="col-ticket-type">{info.ticketType}</div>
                  <div className="col-seat-type">
                    <select 
                      value={info.seatType}
                      onChange={(e) => handleSeatTypeChange(info.passengerId, e.target.value)}
                    >
                      <option value="商务座">商务座</option>
                      <option value="一等座">一等座</option>
                      <option value="二等座">二等座</option>
                      <option value="无座">无座</option>
                    </select>
                  </div>
                  <div className="col-price">¥{info.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 订单总计 */}
        {ticketInfos.length > 0 && (
          <div className="order-summary">
            <div className="summary-content">
              <div className="total-info">
                <span className="total-label">总计：</span>
                <span className="total-price">¥{getTotalPrice()}</span>
              </div>
              <button 
                className="submit-order-btn"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交订单'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 添加乘车人模态框 */}
      <AddPassengerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPassenger}
      />
    </div>
  );
};

export default OrderPage;