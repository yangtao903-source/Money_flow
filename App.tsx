import React, { useState, useEffect, useRef } from 'react';
import { Settings, TrendingUp, Clock, CalendarDays, Coins } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import GeminiCard from './components/GeminiCard';
import { SalaryConfig, EarningsRate } from './types';
import { DEFAULT_CONFIG, STORAGE_KEY } from './constants';
import { calculateRates, calculateEarningsToday } from './utils/calculations';

const App: React.FC = () => {
  const [config, setConfig] = useState<SalaryConfig>(DEFAULT_CONFIG);
  const [currentEarnings, setCurrentEarnings] = useState<number>(0);
  const [rates, setRates] = useState<EarningsRate>({ perSecond: 0, perMinute: 0, perHour: 0, perDay: 0 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setHydrated(true);
  }, []);

  // Update rates when config changes
  useEffect(() => {
    if (hydrated) {
      const newRates = calculateRates(config);
      setRates(newRates);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [config, hydrated]);

  // Main Timer Loop using requestAnimationFrame for smooth UI
  useEffect(() => {
    if (!hydrated) return;

    let animationFrameId: number;

    const tick = () => {
      const earned = calculateEarningsToday(config, rates);
      setCurrentEarnings(earned);
      animationFrameId = requestAnimationFrame(tick);
    };

    // Start the loop
    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [config, rates, hydrated]);


  const handleSaveConfig = (newConfig: SalaryConfig) => {
    setConfig(newConfig);
  };

  // Format currency helper
  const formatMoney = (val: number, decimals: number = 2) => {
    return val.toFixed(decimals);
  };

  if (!hydrated) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">加载中...</div>;

  const progressPercentage = Math.min((currentEarnings / (rates.perDay || 1)) * 100, 100);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <Coins className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">MoneyFlow</h1>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-4xl mx-auto space-y-8">
        
        {/* Hero Display */}
        <div className="relative py-12 md:py-20 text-center space-y-4 select-none">
           {/* Progress Bar Background */}
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
              <div 
                className="h-full bg-emerald-900/20 blur-3xl transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
           </div>

          <h2 className="text-zinc-500 text-sm font-semibold uppercase tracking-[0.2em] mb-2">
            今日已赚
          </h2>
          
          <div className="font-mono text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 tabular-nums break-all">
             <span className="text-3xl md:text-5xl text-zinc-600 mr-2 align-top mt-2 inline-block">{config.currencySymbol}</span>
             {/* Increased to 7 decimals to ensure movement is visible every frame */}
             {formatMoney(currentEarnings, 7)}
          </div>
          
          <div className="flex items-center justify-center gap-2 text-emerald-500 font-mono text-sm md:text-base animate-pulse">
            <TrendingUp className="w-4 h-4" />
            <span>+{config.currencySymbol}{formatMoney(rates.perSecond, 5)} / 秒</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="每分钟" 
            value={`${config.currencySymbol}${formatMoney(rates.perMinute)}`} 
            icon={<Clock className="w-4 h-4 text-zinc-500" />}
          />
          <StatCard 
            label="每小时" 
            value={`${config.currencySymbol}${formatMoney(rates.perHour)}`} 
            icon={<Clock className="w-4 h-4 text-zinc-500" />}
          />
          <StatCard 
            label="日薪 (标准)" 
            value={`${config.currencySymbol}${formatMoney(rates.perDay)}`} 
            icon={<CalendarDays className="w-4 h-4 text-zinc-500" />}
          />
          <StatCard 
            label="今日进度" 
            value={`${((currentEarnings / (rates.perDay || 1)) * 100).toFixed(2)}%`} 
            icon={<TrendingUp className="w-4 h-4 text-zinc-500" />}
          />
        </div>

        {/* AI Integration */}
        <GeminiCard currentAmount={currentEarnings} currencySymbol={config.currencySymbol} />

        {/* Context Info */}
        <div className="text-center text-zinc-600 text-xs py-8">
           计算基于：月薪 {config.currencySymbol}{config.monthlySalary}， 
           月工作 {config.workingDaysPerMonth} 天，每天 {config.workingHoursPerDay} 小时。
           <br /> 上班时间：{String(config.startHour).padStart(2, '0')}:{String(config.startMinute).padStart(2, '0')}。
        </div>

      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={config} 
        onSave={handleSaveConfig} 
      />
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-zinc-700 transition-colors">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">{label}</span>
    </div>
    <span className="text-lg md:text-xl font-mono font-bold text-zinc-200">{value}</span>
  </div>
);

export default App;