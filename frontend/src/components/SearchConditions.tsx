import React, { useState } from 'react';
import './SearchConditions.css';

interface SearchConditionsProps {
  fromStation: string;
  toStation: string;
  departDate: string;
  passengerType: 'adult' | 'student';
  trainType: 'all' | 'high_speed';
  onConditionsChange?: (conditions: SearchConditions) => void;
}

interface SearchConditions {
  fromStation: string;
  toStation: string;
  departDate: string;
  passengerType: 'adult' | 'student';
  trainType: 'all' | 'high_speed';
}

const SearchConditions: React.FC<SearchConditionsProps> = ({
  fromStation,
  toStation,
  departDate,
  passengerType,
  trainType,
  onConditionsChange
}) => {
  const [conditions, setConditions] = useState<SearchConditions>({
    fromStation,
    toStation,
    departDate,
    passengerType,
    trainType
  });

  const handleSwapStations = () => {
    const newConditions = {
      ...conditions,
      fromStation: conditions.toStation,
      toStation: conditions.fromStation
    };
    setConditions(newConditions);
    onConditionsChange?.(newConditions);
  };

  const handleDateChange = (date: string) => {
    const newConditions = { ...conditions, departDate: date };
    setConditions(newConditions);
    onConditionsChange?.(newConditions);
  };

  const handlePassengerTypeChange = (type: 'adult' | 'student') => {
    const newConditions = { ...conditions, passengerType: type };
    setConditions(newConditions);
    onConditionsChange?.(newConditions);
  };

  const handleTrainTypeChange = (type: 'all' | 'high_speed') => {
    const newConditions = { ...conditions, trainType: type };
    setConditions(newConditions);
    onConditionsChange?.(newConditions);
  };

  // 生成日期选项（当前日期前后15天）
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = -7; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
      
      dates.push({
        value: `${date.getFullYear()}-${month}-${day}`,
        display: `${month}-${day}`,
        weekDay: `周${weekDay}`,
        isToday: i === 0
      });
    }
    
    return dates;
  };

  const dateOptions = generateDateOptions();

  return (
    <div className="search-conditions">
      {/* 查询条件主区域 */}
      <div className="search-main">
        <div className="station-selector">
          <div className="station-item">
            <label>出发地</label>
            <div className="station-name">{conditions.fromStation}</div>
          </div>
          
          <button 
            className="swap-button"
            onClick={handleSwapStations}
            title="交换出发地和目的地"
          >
            ⇄
          </button>
          
          <div className="station-item">
            <label>目的地</label>
            <div className="station-name">{conditions.toStation}</div>
          </div>
        </div>

        <div className="date-selector">
          <label>出发日期</label>
          <div className="current-date">{conditions.departDate}</div>
        </div>

        <div className="passenger-type-selector">
          <label>乘客类型</label>
          <div className="radio-group">
            <label className="radio-item">
              <input
                type="radio"
                name="passengerType"
                value="adult"
                checked={conditions.passengerType === 'adult'}
                onChange={() => handlePassengerTypeChange('adult')}
              />
              成人
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="passengerType"
                value="student"
                checked={conditions.passengerType === 'student'}
                onChange={() => handlePassengerTypeChange('student')}
              />
              学生
            </label>
          </div>
        </div>

        <div className="train-type-selector">
          <label>车次类型</label>
          <div className="radio-group">
            <label className="radio-item">
              <input
                type="radio"
                name="trainType"
                value="high_speed"
                checked={conditions.trainType === 'high_speed'}
                onChange={() => handleTrainTypeChange('high_speed')}
              />
              高铁/动车
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="trainType"
                value="all"
                checked={conditions.trainType === 'all'}
                onChange={() => handleTrainTypeChange('all')}
              />
              全部
            </label>
          </div>
        </div>

        <button className="search-button">
          查询
        </button>
      </div>

      {/* 日期选择区域 */}
      <div className="date-navigation">
        <div className="date-list">
          {dateOptions.map((date) => (
            <button
              key={date.value}
              className={`date-item ${date.value === conditions.departDate ? 'active' : ''} ${date.isToday ? 'today' : ''}`}
              onClick={() => handleDateChange(date.value)}
            >
              <div className="date-display">{date.display}</div>
              <div className="week-day">{date.weekDay}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchConditions;