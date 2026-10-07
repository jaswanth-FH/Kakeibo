import { describe, expect, test } from '@jest/globals';

import { amountToPaise, buildPayUri, parseUpiUri } from './upiUri';

const MERCHANT =
  'upi://pay?pa=applestore@hdfcbank&pn=Apple%20Store%2C%20BKC&am=5900.00&cu=INR&mc=5732&tr=AS-2041-8831';

describe('parseUpiUri', () => {
  test('reads a merchant QR', () => {
    expect(parseUpiUri(MERCHANT)).toEqual({
      rawUri: MERCHANT,
      pa: 'applestore@hdfcbank',
      pn: 'Apple Store, BKC',
      am: '5900.00',
      cu: 'INR',
      tn: undefined,
      tr: 'AS-2041-8831',
      mc: '5732',
      sign: undefined,
    });
  });

  test('accepts upper-case scheme and keys, trims whitespace', () => {
    expect(parseUpiUri('  UPI://PAY?PA=rohan.m@okaxis&PN=Rohan  ')).toMatchObject({
      pa: 'rohan.m@okaxis',
      pn: 'Rohan',
      am: undefined,
    });
  });

  test.each([
    ['not a UPI link', 'https://example.com/?pa=a@b'],
    ['upi but not pay', 'upi://mandate?pa=rohan@okaxis'],
    ['missing pa', 'upi://pay?pn=Rohan&am=10'],
    ['bad VPA', 'upi://pay?pa=rohan'],
    ['bad VPA handle', 'upi://pay?pa=rohan@1bank'],
    ['non-INR', 'upi://pay?pa=rohan@okaxis&am=10&cu=USD'],
    ['zero amount', 'upi://pay?pa=rohan@okaxis&am=0'],
    ['non-numeric amount', 'upi://pay?pa=rohan@okaxis&am=ten'],
  ])('rejects %s', (_, text) => {
    expect(parseUpiUri(text)).toBeNull();
  });
});

test('amountToPaise rounds to whole paise', () => {
  expect(amountToPaise('5900.00')).toBe(590000);
  expect(amountToPaise('0.1')).toBe(10);
  expect(amountToPaise('19.999')).toBe(2000);
});

describe('buildPayUri', () => {
  test('passes a merchant QR with an amount through unchanged', () => {
    const d = parseUpiUri(MERCHANT)!;
    expect(buildPayUri(d, 1, 'ignored')).toBe(MERCHANT);
  });

  test('passes a signed QR through unchanged even without an amount', () => {
    const raw = 'upi://pay?pa=shop@ybl&pn=Shop&sign=MEUCIQDabc';
    expect(buildPayUri(parseUpiUri(raw)!, 25000)).toBe(raw);
  });

  test('builds a fresh link for a personal QR', () => {
    const uri = buildPayUri(
      parseUpiUri('upi://pay?pa=rohan.m@okaxis&pn=Rohan%20M')!,
      12550,
      'Dinner',
    );
    const q = new URLSearchParams(uri.slice(uri.indexOf('?') + 1));
    expect(uri.startsWith('upi://pay?')).toBe(true);
    expect(Object.fromEntries(q)).toEqual({
      pa: 'rohan.m@okaxis',
      pn: 'Rohan M',
      am: '125.50',
      cu: 'INR',
      tn: 'Dinner',
    });
  });
});
