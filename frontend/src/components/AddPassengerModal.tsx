import React, { useState } from 'react';
import './AddPassengerModal.css';

interface Passenger {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  passengerType: '成人' | '儿童' | '学生';
}

interface AddPassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (passenger: Omit<Passenger, 'id'>) => void;
  onEdit?: (id: string, passenger: Omit<Passenger, 'id'>) => void;
  editingPassenger?: Passenger | null;
}

const AddPassengerModal: React.FC<AddPassengerModalProps> = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  onEdit,
  editingPassenger 
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    idCard: string;
    phone: string;
    passengerType: '成人' | '儿童' | '学生';
  }>({
    name: editingPassenger?.name || '',
    idCard: editingPassenger?.idCard || '',
    phone: editingPassenger?.phone || '',
    passengerType: editingPassenger?.passengerType || '成人'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }
    
    if (!formData.idCard.trim()) {
      newErrors.idCard = '请输入身份证号';
    } else if (!/^\d{17}[\dX]$/.test(formData.idCard)) {
      newErrors.idCard = '身份证号格式不正确';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '手机号格式不正确';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (editingPassenger && onEdit) {
        onEdit(editingPassenger.id, formData);
      } else {
        onAdd(formData);
      }
      setFormData({ name: '', idCard: '', phone: '', passengerType: '成人' });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingPassenger ? '编辑乘车人' : '添加乘车人'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="passenger-form">
          <div className="form-group">
            <label htmlFor="name">姓名 <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="请输入真实姓名"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="passengerType">乘客类型 <span className="required">*</span></label>
            <select
              id="passengerType"
              value={formData.passengerType}
              onChange={(e) => handleInputChange('passengerType', e.target.value)}
            >
              <option value="成人">成人</option>
              <option value="儿童">儿童</option>
              <option value="学生">学生</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idCard">身份证号 <span className="required">*</span></label>
            <input
              type="text"
              id="idCard"
              value={formData.idCard}
              onChange={(e) => handleInputChange('idCard', e.target.value)}
              placeholder="请输入18位身份证号"
              maxLength={18}
              className={errors.idCard ? 'error' : ''}
            />
            {errors.idCard && <span className="error-message">{errors.idCard}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">手机号 <span className="required">*</span></label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="请输入11位手机号"
              maxLength={11}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="submit-btn">
              {editingPassenger ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPassengerModal;