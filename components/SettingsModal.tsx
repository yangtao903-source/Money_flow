import React, { useState } from 'react';
import { X, Save, DollarSign, Clock, Calendar } from 'lucide-react';
import { SalaryConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SalaryConfig;
  onSave: (config: SalaryConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [formData, setFormData] = useState<SalaryConfig>(config);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currencySymbol' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            薪资配置
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Salary & Currency */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">月薪</label>
              <input
                type="number"
                name="monthlySalary"
                value={formData.monthlySalary}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="10000"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">货币单位</label>
              <select
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="¥">¥ 人民币</option>
                <option value="$">$ 美元</option>
                <option value="€">€ 欧元</option>
                <option value="£">£ 英镑</option>
                <option value="₹">₹ 卢比</option>
              </select>
            </div>
          </div>

          {/* Time Config */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> 每月工作天数
              </label>
              <input
                type="number"
                name="workingDaysPerMonth"
                value={formData.workingDaysPerMonth}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> 每天工作时长
              </label>
              <input
                type="number"
                name="workingHoursPerDay"
                value={formData.workingHoursPerDay}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">上班时间</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="startHour"
                min="0"
                max="23"
                value={formData.startHour}
                onChange={handleChange}
                className="flex-1 bg-zinc-950 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all text-center"
                placeholder="09"
              />
              <span className="flex items-center text-zinc-500">:</span>
              <input
                type="number"
                name="startMinute"
                min="0"
                max="59"
                value={formData.startMinute}
                onChange={handleChange}
                className="flex-1 bg-zinc-950 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all text-center"
                placeholder="00"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-5 h-5" />
            保存并计算
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;