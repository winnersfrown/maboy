// All names, references, dates, and document contents below are fictional.
export function createExample(kind = 'missing') {
  if (!['missing','refund'].includes(kind)) throw new Error('Unknown example type');
  const warning = 'FICTIONAL EXAMPLE - FOR TESTING ONLY. DO NOT SUBMIT.\n\n';
  const refund = kind === 'refund';
  return {
    fields: {
      kind, merchant:'Demo Audio Store (fictional)',amount:'89.95',purchaseDate:'2026-09-01',reference:'DEMO-1042',
      statement: refund
        ? 'This is a fictional test case. I bought headphones for $89.95 on September 1. The order did not arrive. On September 10, the merchant promised a full refund within five business days. As of September 22, I have not received the refund. I followed up on September 22 and have not received a response.'
        : 'This is a fictional test case. I bought headphones for $89.95 on September 1 with delivery expected September 8. The tracking record still showed label created on September 9. I contacted the merchant on September 9 and followed up on September 15, but have not received a response or the headphones.',
      resolution:'For this fictional example, I am requesting a full refund of $89.95 for the undelivered order.'
    },
    events: refund ? [
      {date:'2026-09-08',description:'Expected delivery date passed without delivery.'},
      {date:'2026-09-10',description:'Merchant promised a full refund within five business days.'},
      {date:'2026-09-22',description:'Refund still missing; sent a follow-up message.'}
    ] : [
      {date:'2026-09-08',description:'Expected delivery date passed without delivery.'},
      {date:'2026-09-09',description:'Tracking showed label created; contacted merchant.'},
      {date:'2026-09-15',description:'Sent a second message; no merchant response received.'}
    ],
    documents: [
      {name:'DEMO-receipt.txt',category:'Receipt',content:warning+'Demo Audio Store (fictional)\nOrder DEMO-1042\nDate: 2026-09-01\nHeadphones: $79.95\nShipping: $10.00\nTotal paid: $89.95 USD\nExpected delivery: 2026-09-08'},
      {name:'DEMO-merchant-messages.txt',category:'Merchant correspondence',content:warning+(refund ? '2026-09-10 Merchant: We will refund the full $89.95 within five business days.\n2026-09-22 Customer: The refund has not arrived. Please provide an update.\nNo further response recorded.' : '2026-09-09 Customer: My order DEMO-1042 has not arrived. Please provide a delivery update.\n2026-09-15 Customer: Following up on my missing order. Please refund $89.95.\nNo merchant response recorded.')},
      refund ? {name:'DEMO-refund-confirmation.txt',category:'Refund confirmation',content:warning+'2026-09-10\nDemo Audio Store (fictional)\nOrder DEMO-1042\nWe will refund $89.95 USD to the original payment method within five business days.'}
        : {name:'DEMO-tracking-record.txt',category:'Delivery / tracking record',content:warning+'Tracking reference: DEMO-TRACK-1042\nStatus checked: 2026-09-09\nStatus: Label created. Package not received from sender.\nNo delivery scan recorded.'}
    ]
  };
}
