import React, { useState } from 'react';
import './FilterConditions.css';

interface FilterConditionsProps {
  onFiltersChange?: (filters: FilterState) => void;
}

interface FilterState {
  departureTime: string[];
  trainTypes: string[];
  departureStations: string[];
  arrivalStations: string[];
  seatTypes: string[];
  showDiscountTrains: boolean;
  showPointsTrains: boolean;
  showAllBookableTrains: boolean;
}

const FilterConditions: React.FC<FilterConditionsProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    departureTime: [],
    trainTypes: [],
    departureStations: [],
    arrivalStations: [],
    seatTypes: [],
    showDiscountTrains: false,
    showPointsTrains: false,
    showAllBookableTrains: true
  });

  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    departureTime: true,
    trainTypes: true,
    departureStations: false,
    arrivalStations: false,
    seatTypes: false
  });

  // 发车时间选项
  const departureTimeOptions = [
    { value: '00:00-06:00', label: '00:00-06:00', count: 12 },
    { value: '06:00-12:00', label: '06:00-12:00', count: 45 },
    { value: '12:00-18:00', label: '12:00-18:00', count: 38 },
    { value: '18:00-24:00', label: '18:00-24:00', count: 23 }
  ];

  // 车次类型选项
  const trainTypeOptions = [
    { value: 'all', label: '全部', count: 118 },
    { value: 'GC', label: 'GC-高铁/城际', count: 67 },
    { value: 'D', label: 'D-动车', count: 28 },
    { value: 'Z', label: 'Z-直达', count: 5 },
    { value: 'T', label: 'T-特快', count: 8 },
    { value: 'K', label: 'K-快速', count: 7 },
    { value: 'other', label: '其他', count: 3 },
    { value: 'smart', label: '复兴号智能动车组', count: 15 }
  ];

  // 出发车站选项（示例数据）
  const departureStationOptions = [
    { value: 'all', label: '全部', count: 118 },
    { value: 'shanghai', label: '上海', count: 45 },
    { value: 'shanghai-hongqiao', label: '上海虹桥', count: 73 }
  ];

  // 到达车站选项（示例数据）
  const arrivalStationOptions = [
    { value: 'all', label: '全部', count: 118 },
    { value: 'beijing', label: '北京', count: 28 },
    { value: 'beijing-south', label: '北京南', count: 90 }
  ];

  // 席别选项
  const seatTypeOptions = [
    { value: 'all', label: '全部', count: 118 },
    { value: 'business', label: '商务座', count: 45 },
    { value: 'first_class_plus', label: '特等座', count: 32 },
    { value: 'first_class_premium', label: '优选一等座', count: 28 },
    { value: 'first_class', label: '一等座', count: 89 },
    { value: 'second_class', label: '二等座', count: 118 },
    { value: 'second_class_package', label: '二等包座', count: 15 },
    { value: 'premium_sleeper', label: '高级软卧', count: 8 },
    { value: 'soft_sleeper', label: '软卧/动卧', count: 12 },
    { value: 'first_sleeper', label: '一等卧', count: 5 },
    { value: 'hard_sleeper', label: '硬卧', count: 18 },
    { value: 'second_sleeper', label: '二等卧', count: 7 },
    { value: 'soft_seat', label: '软座', count: 3 },
    { value: 'hard_seat', label: '硬座', count: 25 },
    { value: 'no_seat', label: '无座', count: 45 },
    { value: 'other_seat', label: '其他', count: 8 }
  ];

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    
    if (Array.isArray(newFilters[category])) {
      const currentArray = newFilters[category] as string[];
      if (checked) {
        if (!currentArray.includes(value)) {
          (newFilters[category] as string[]) = [...currentArray, value];
        }
      } else {
        (newFilters[category] as string[]) = currentArray.filter(item => item !== value);
      }
    }
    
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleBooleanFilterChange = (key: keyof FilterState, checked: boolean) => {
    const newFilters = { ...filters, [key]: checked };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      departureTime: [],
      trainTypes: [],
      departureStations: [],
      arrivalStations: [],
      seatTypes: [],
      showDiscountTrains: false,
      showPointsTrains: false,
      showAllBookableTrains: true
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const renderFilterSection = (
    title: string,
    sectionKey: string,
    options: Array<{value: string, label: string, count: number}>,
    filterKey: keyof FilterState
  ) => (
    <div className="filter-section">
      <div className="filter-header" onClick={() => toggleSection(sectionKey)}>
        <h3>{title}</h3>
        <span className={`expand-icon ${expandedSections[sectionKey] ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>
      
      {expandedSections[sectionKey] && (
        <div className="filter-options">
          {options.map(option => (
            <label key={option.value} className="filter-option">
              <input
                type="checkbox"
                checked={(filters[filterKey] as string[]).includes(option.value)}
                onChange={(e) => handleFilterChange(filterKey, option.value, e.target.checked)}
              />
              <span className="option-label">{option.label}</span>
              <span className="option-count">({option.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="filter-conditions">
      <div className="filter-header-main">
        <h2>筛选条件</h2>
        <button className="clear-filters" onClick={clearAllFilters}>
          清空筛选
        </button>
      </div>

      <div className="filter-content">
        {/* 发车时间筛选 */}
        {renderFilterSection('发车时间', 'departureTime', departureTimeOptions, 'departureTime')}

        {/* 车次类型筛选 */}
        {renderFilterSection('车次类型', 'trainTypes', trainTypeOptions, 'trainTypes')}

        {/* 出发车站筛选 */}
        {renderFilterSection('出发车站', 'departureStations', departureStationOptions, 'departureStations')}

        {/* 到达车站筛选 */}
        {renderFilterSection('到达车站', 'arrivalStations', arrivalStationOptions, 'arrivalStations')}

        {/* 席别筛选 */}
        {renderFilterSection('车次席别', 'seatTypes', seatTypeOptions, 'seatTypes')}

        {/* 显示选项 */}
        <div className="filter-section">
          <div className="filter-header">
            <h3>显示选项</h3>
          </div>
          
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.showDiscountTrains}
                onChange={(e) => handleBooleanFilterChange('showDiscountTrains', e.target.checked)}
              />
              <span className="option-label">显示折扣车次</span>
            </label>
            
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.showPointsTrains}
                onChange={(e) => handleBooleanFilterChange('showPointsTrains', e.target.checked)}
              />
              <span className="option-label">显示积分兑换车次</span>
            </label>
            
            <label className="filter-option">
              <input
                type="checkbox"
                checked={filters.showAllBookableTrains}
                onChange={(e) => handleBooleanFilterChange('showAllBookableTrains', e.target.checked)}
              />
              <span className="option-label">显示全部可预订车次</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterConditions;