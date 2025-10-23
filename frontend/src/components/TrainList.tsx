import React, { useState, useMemo } from 'react';
import './TrainList.css';

interface TrainInfo {
  trainNo: string;
  trainType: string;
  fromStation: string;
  toStation: string;
  fromTime: string;
  toTime: string;
  duration: string;
  fromStationCode: string;
  toStationCode: string;
  seats: {
    business?: string | number;
    firstClassPlus?: string | number;
    firstClassPremium?: string | number;
    firstClass?: string | number;
    secondClass?: string | number;
    secondClassPackage?: string | number;
    premiumSleeper?: string | number;
    softSleeper?: string | number;
    firstSleeper?: string | number;
    hardSleeper?: string | number;
    secondSleeper?: string | number;
    softSeat?: string | number;
    hardSeat?: string | number;
    noSeat?: string | number;
    other?: string | number;
  };
  canBook: boolean;
  isHighSpeed: boolean;
  remarks?: string;
}

interface TrainListProps {
  trains: TrainInfo[];
  onTrainSelect?: (train: TrainInfo) => void;
}

type SortType = 'departure' | 'arrival' | 'duration' | 'trainNo';
type SortOrder = 'asc' | 'desc';

const TrainList: React.FC<TrainListProps> = ({ trains, onTrainSelect }) => {
  const [sortType, setSortType] = useState<SortType>('departure');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // 座位类型配置
  const seatTypes = [
    { key: 'business', label: '商务座', shortLabel: '商务' },
    { key: 'firstClassPlus', label: '特等座', shortLabel: '特等' },
    { key: 'firstClassPremium', label: '优选一等座', shortLabel: '优选一等' },
    { key: 'firstClass', label: '一等座', shortLabel: '一等' },
    { key: 'secondClass', label: '二等座', shortLabel: '二等' },
    { key: 'secondClassPackage', label: '二等包座', shortLabel: '二等包' },
    { key: 'premiumSleeper', label: '高级软卧', shortLabel: '高软' },
    { key: 'softSleeper', label: '软卧/动卧', shortLabel: '软卧' },
    { key: 'firstSleeper', label: '一等卧', shortLabel: '一等卧' },
    { key: 'hardSleeper', label: '硬卧', shortLabel: '硬卧' },
    { key: 'secondSleeper', label: '二等卧', shortLabel: '二等卧' },
    { key: 'softSeat', label: '软座', shortLabel: '软座' },
    { key: 'hardSeat', label: '硬座', shortLabel: '硬座' },
    { key: 'noSeat', label: '无座', shortLabel: '无座' },
    { key: 'other', label: '其他', shortLabel: '其他' }
  ];

  // 排序逻辑
  const sortedTrains = useMemo(() => {
    const sorted = [...trains].sort((a, b) => {
      let comparison = 0;
      
      switch (sortType) {
        case 'departure':
          comparison = a.fromTime.localeCompare(b.fromTime);
          break;
        case 'arrival':
          comparison = a.toTime.localeCompare(b.toTime);
          break;
        case 'duration':
          const aDuration = parseDuration(a.duration);
          const bDuration = parseDuration(b.duration);
          comparison = aDuration - bDuration;
          break;
        case 'trainNo':
          comparison = a.trainNo.localeCompare(b.trainNo);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [trains, sortType, sortOrder]);

  // 解析时长字符串为分钟数
  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+):(\d+)/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  };

  // 处理排序
  const handleSort = (type: SortType) => {
    if (sortType === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortOrder('asc');
    }
  };

  // 渲染座位信息
  const renderSeatInfo = (train: TrainInfo, seatKey: string) => {
    const seatValue = train.seats[seatKey as keyof typeof train.seats];
    
    if (seatValue === undefined || seatValue === null) {
      return <span className="seat-unavailable">--</span>;
    }
    
    if (seatValue === 0 || seatValue === '0') {
      return <span className="seat-unavailable">--</span>;
    }
    
    if (typeof seatValue === 'string') {
      if (seatValue === '有') {
        return <span className="seat-available">有</span>;
      }
      if (seatValue === '候补') {
        return <span className="seat-waitlist">候补</span>;
      }
      return <span className="seat-available">{seatValue}</span>;
    }
    
    if (typeof seatValue === 'number' && seatValue > 0) {
      return <span className="seat-available">{seatValue}</span>;
    }
    
    return <span className="seat-unavailable">--</span>;
  };

  // 获取车次类型样式
  const getTrainTypeClass = (trainType: string) => {
    if (trainType.startsWith('G') || trainType.startsWith('C')) return 'train-type-g';
    if (trainType.startsWith('D')) return 'train-type-d';
    if (trainType.startsWith('Z')) return 'train-type-z';
    if (trainType.startsWith('T')) return 'train-type-t';
    if (trainType.startsWith('K')) return 'train-type-k';
    return 'train-type-other';
  };

  // 渲染排序图标
  const renderSortIcon = (type: SortType) => {
    if (sortType !== type) {
      return <span className="sort-icon">↕</span>;
    }
    return (
      <span className={`sort-icon active ${sortOrder}`}>
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="train-list">
      <div className="train-list-header">
        <div className="header-row">
          <div className="train-info-header">
            <div className="train-no-header" onClick={() => handleSort('trainNo')}>
              车次 {renderSortIcon('trainNo')}
            </div>
            <div className="station-header">出发站</div>
            <div className="station-header">到达站</div>
            <div className="time-header" onClick={() => handleSort('departure')}>
              出发时间 {renderSortIcon('departure')}
            </div>
            <div className="time-header" onClick={() => handleSort('arrival')}>
              到达时间 {renderSortIcon('arrival')}
            </div>
            <div className="duration-header" onClick={() => handleSort('duration')}>
              历时 {renderSortIcon('duration')}
            </div>
          </div>
          
          <div className="seat-headers">
            {seatTypes.map(seatType => (
              <div key={seatType.key} className="seat-header" title={seatType.label}>
                {seatType.shortLabel}
              </div>
            ))}
          </div>
          
          <div className="action-header">
            <div>备注</div>
          </div>
        </div>
      </div>

      <div className="train-list-body">
        {sortedTrains.map((train, index) => (
          <div key={`${train.trainNo}-${index}`} className="train-row">
            <div className="train-info">
              <div className="train-no">
                <span className={`train-type ${getTrainTypeClass(train.trainType)}`}>
                  {train.trainNo}
                </span>
              </div>
              
              <div className="station-info">
                <div className="station from-station">
                  <div className="station-name">{train.fromStation}</div>
                  <div className="station-code">{train.fromStationCode}</div>
                </div>
              </div>
              
              <div className="station-info">
                <div className="station to-station">
                  <div className="station-name">{train.toStation}</div>
                  <div className="station-code">{train.toStationCode}</div>
                </div>
              </div>
              
              <div className="time-info">
                <div className="time from-time">{train.fromTime}</div>
              </div>
              
              <div className="time-info">
                <div className="time to-time">{train.toTime}</div>
              </div>
              
              <div className="duration-info">
                <div className="duration">{train.duration}</div>
              </div>
            </div>

            <div className="seat-info">
              {seatTypes.map(seatType => (
                <div key={seatType.key} className="seat-cell">
                  {renderSeatInfo(train, seatType.key)}
                </div>
              ))}
            </div>

            <div className="action-info">
              <div className="remarks">
                {train.remarks || '--'}
              </div>
              <button 
                className={`book-button ${train.canBook ? 'available' : 'disabled'}`}
                disabled={!train.canBook}
                onClick={() => train.canBook && onTrainSelect?.(train)}
              >
                {train.canBook ? '预订' : '不可预订'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedTrains.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🚄</div>
          <div className="empty-text">暂无符合条件的车次</div>
          <div className="empty-hint">请尝试调整筛选条件或更换日期</div>
        </div>
      )}
    </div>
  );
};

export default TrainList;