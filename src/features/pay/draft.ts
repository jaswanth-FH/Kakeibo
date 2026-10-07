import { create } from 'zustand';

import { amountToPaise, type ParsedUpi } from '@/features/pay/upiUri';

/** The in-progress payment from scan to result (docs/spec.md, "Payment draft"). */
export type PayDraft = {
  rawUri: string;
  payeeVpa: string;
  payeeName?: string;
  amountPaise?: number;
  amountLocked: boolean;
  merchantCode?: string;
  txnRef?: string;
  qrNote?: string;
  categoryId?: string;
  note?: string;
  txnId?: string;
};

type Store = {
  draft: PayDraft | null;
  start: (qr: ParsedUpi) => PayDraft;
  update: (patch: Partial<PayDraft>) => void;
  clear: () => void;
};

export const usePayDraft = create<Store>((set) => ({
  draft: null,
  start: (qr) => {
    const draft: PayDraft = {
      rawUri: qr.rawUri,
      payeeVpa: qr.pa,
      payeeName: qr.pn,
      amountPaise: qr.am ? amountToPaise(qr.am) : undefined,
      amountLocked: Boolean(qr.am),
      merchantCode: qr.mc,
      txnRef: qr.tr,
      qrNote: qr.tn,
    };
    set({ draft });
    return draft;
  },
  update: (patch) => set((s) => (s.draft ? { draft: { ...s.draft, ...patch } } : s)),
  clear: () => set({ draft: null }),
}));
