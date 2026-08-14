import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/th';

dayjs.extend(isBetween);
dayjs.extend(localeData);
dayjs.locale('th');

export const FORMAT_DATE = 'YYYY-MM-DD';
export const FORMAT_DATE_DISPLAY = 'DD MMM YYYY';

export const getTodayDate = (): string => dayjs().format(FORMAT_DATE);

export const getPresetDateRange = (preset: 'today' | 'this_week' | 'this_month'): { startDate: string; endDate: string } => {
  const now = dayjs();
  switch (preset) {
    case 'today':
      return {
        startDate: now.format(FORMAT_DATE),
        endDate: now.format(FORMAT_DATE),
      };
    case 'this_week':
      return {
        startDate: now.startOf('week').format(FORMAT_DATE),
        endDate: now.endOf('week').format(FORMAT_DATE),
      };
    case 'this_month':
      return {
        startDate: now.startOf('month').format(FORMAT_DATE),
        endDate: now.endOf('month').format(FORMAT_DATE),
      };
  }
};

export const isDateInRange = (targetDate: string, startDate: string, endDate: string): boolean => {
  const target = dayjs(targetDate);
  const start = dayjs(startDate).startOf('day');
  const end = dayjs(endDate).endOf('day');
  return target.isSame(start, 'day') || target.isSame(end, 'day') || (target.isAfter(start) && target.isBefore(end));
};

export const formatDateThai = (dateStr: string): string => {
  if (!dateStr) return '';
  return dayjs(dateStr).locale('th').format('D MMM YYYY');
};

export const isOverdue = (dateStr: string, status: string): boolean => {
  if (status === 'completed') return false;
  return dayjs(dateStr).isBefore(dayjs().startOf('day'));
};
