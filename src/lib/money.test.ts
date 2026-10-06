import { expect, test } from '@jest/globals';
import { formatPaise, formatPaiseCompact } from './money';

test('formatPaise uses Indian grouping and drops zero paise', () => {
  expect(formatPaise(590000)).toBe('₹5,900');
  expect(formatPaise(10000000)).toBe('₹1,00,000');
  expect(formatPaise(12345)).toBe('₹123.45');
  expect(formatPaise(0)).toBe('₹0');
  expect(formatPaise(998050)).toBe('₹9,980.50');
});

test('formatPaiseCompact uses K / L / Cr', () => {
  expect(formatPaiseCompact(2850000)).toBe('₹28.5K');
  expect(formatPaiseCompact(48600)).toBe('₹486');
  expect(formatPaiseCompact(25000000)).toBe('₹2.5L');
  expect(formatPaiseCompact(1250000000)).toBe('₹1.25Cr');
});
