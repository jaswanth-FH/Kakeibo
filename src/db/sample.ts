// ponytail: placeholder profile and payment draft for the auth and /pay/* mockups; replaced by onboarding (settings) and the pay draft store in M3–M5.
export const SAMPLE_PROFILE = {
  name: 'Aarav Rao',
  phone: '+91 98765 43210',
  email: 'aarav.rao@gmail.com',
};

/** An in-progress payment (shape of the PayDraft in docs/spec.md) for the /pay/* mockups. */
export const SAMPLE_DRAFT = {
  rawUri:
    'upi://pay?pa=applestore@hdfcbank&pn=Apple%20Store%2C%20BKC&am=5900.00&cu=INR&mc=5732&tr=AS-2041-8831',
  payeeVpa: 'applestore@hdfcbank',
  payeeName: 'Apple Store, BKC',
  amountPaise: 590000,
  amountLocked: true,
  merchantCode: '5732',
  txnRef: 'AS-2041-8831',
  categoryId: 'tech',
  upiApp: 'Google Pay',
  upiApprovalRef: '428913377210',
};
