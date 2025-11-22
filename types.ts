export interface SalaryConfig {
  monthlySalary: number;
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
  currencySymbol: string;
  startHour: number; // 0-23
  startMinute: number; // 0-59
}

export interface EarningsRate {
  perSecond: number;
  perMinute: number;
  perHour: number;
  perDay: number;
}

export interface AIResponse {
  text: string;
  items: string[];
}