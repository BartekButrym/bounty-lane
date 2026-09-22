import { CustomBig } from '@/lib/big';

export const toCent = (amount: number) =>
  new CustomBig(amount).mul(100).round(2).toNumber();

export const fromCent = (amount: number) =>
  new CustomBig(amount).div(100).round(2).toNumber();

export const toCurrencyFromCent = (amount: number, currency?: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ?? 'USD',
  }).format(fromCent(amount));
