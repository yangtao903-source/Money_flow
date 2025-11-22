import { SalaryConfig, EarningsRate } from '../types';

export const calculateRates = (config: SalaryConfig): EarningsRate => {
  const { monthlySalary, workingDaysPerMonth, workingHoursPerDay } = config;

  // Avoid division by zero
  if (workingDaysPerMonth === 0 || workingHoursPerDay === 0) {
    return { perSecond: 0, perMinute: 0, perHour: 0, perDay: 0 };
  }

  const totalWorkingHoursPerMonth = workingDaysPerMonth * workingHoursPerDay;
  const totalWorkingSecondsPerMonth = totalWorkingHoursPerMonth * 3600;

  const perSecond = monthlySalary / totalWorkingSecondsPerMonth;
  const perMinute = perSecond * 60;
  const perHour = perMinute * 60;
  const perDay = perHour * workingHoursPerDay;

  return {
    perSecond,
    perMinute,
    perHour,
    perDay
  };
};

export const calculateEarningsToday = (config: SalaryConfig, rates: EarningsRate): number => {
  const now = new Date();
  const startTime = new Date();
  startTime.setHours(config.startHour, config.startMinute, 0, 0);

  // If start time is in the future for today (e.g. it's 8am, start is 9am), earnings are 0
  if (now < startTime) {
    return 0;
  }

  const diffInSeconds = (now.getTime() - startTime.getTime()) / 1000;
  
  // 移除了原本的 Math.min(diffInSeconds, maxSeconds) 限制
  // 这样即使超过了每天的工作时长，数字也会继续跳动（视为加班或单纯的时间流逝）
  // 满足"随时都在变化"的视觉需求
  const effectiveSeconds = diffInSeconds;

  return effectiveSeconds * rates.perSecond;
};