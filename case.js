export function amountInCents(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error('Enter a positive amount with up to two decimal places.');
  const [whole, fraction = ''] = value.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error('Enter a positive amount within the supported range.');
  return cents;
}
export function missingEvidence(kind, evidence) {
  const needed = ['Receipt', 'Merchant correspondence', kind === 'refund' ? 'Refund confirmation' : 'Delivery / tracking record'];
  return needed.filter(type => !evidence.some(item => item.category === type));
}
export function sortedEvents(events) {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}
export function money(cents) {
  return new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'}).format(cents / 100);
}
export function summary(data, events, evidence) {
  return [
    'DISPUTE PREPARATION SUMMARY',
    `Merchant: ${data.merchant}`,
    `Issue: ${data.kind === 'refund' ? 'Promised refund not received' : 'Purchase not received'}`,
    `Amount in question: ${money(data.cents)} USD`,
    `Purchase date: ${data.purchaseDate}`,
    `Order reference: ${data.reference || 'Not provided'}`,
    '', 'Consumer statement', data.statement,
    '', 'Requested resolution', data.resolution,
    '', 'Timeline', ...sortedEvents(events).map(e => `${e.date}: ${e.description}`),
    '', 'Evidence index', ...evidence.map((e, i) => `${i+1}. ${e.category}: ${e.name}`),
    '', 'Preparation checklist',
    ...missingEvidence(data.kind, evidence).map(type => `Not attached: ${type}`),
    '', 'Prepared from consumer-entered information. Review facts before submitting.',
    'Attach the original evidence separately. This summary does not submit a dispute or determine eligibility.'
  ].join('\n');
}
