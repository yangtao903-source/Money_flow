import { SalaryConfig } from './types';

export const DEFAULT_CONFIG: SalaryConfig = {
  monthlySalary: 10000,
  workingDaysPerMonth: 22,
  workingHoursPerDay: 8,
  currencySymbol: '¥',
  startHour: 9,
  startMinute: 0,
};

export const STORAGE_KEY = 'moneyflow_config_v1';
