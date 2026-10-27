import test from 'node:test';
import assert from 'node:assert/strict';
import {amountInCents, missingEvidence, sortedEvents, summary} from './case.js';
test('money remains exact and rejects malformed or unsafe amounts', () => {
  assert.equal(amountInCents('19.99'),1999);
  assert.equal(amountInCents('1.1'),110);
  for(const value of ['0','-10','1.001','1e4','Infinity','NaN','9007199254740992']) assert.throws(() => amountInCents(value));
});
test('refund cases request confirmation rather than tracking', () => {
  const evidence = [{category:'Receipt'},{category:'Merchant correspondence'}];
  assert.deepEqual(missingEvidence('refund',evidence),['Refund confirmation']);
  assert.deepEqual(missingEvidence('missing',evidence),['Delivery / tracking record']);
});
test('timeline sorts without mutating original user entries', () => {
  const entries=[{date:'2026-10-20',description:'B'},{date:'2026-10-01',description:'A'}];
  assert.equal(sortedEvents(entries)[0].description,'A'); assert.equal(entries[0].description,'B');
});
test('summary preserves consumer facts and names missing evidence without inventing claims', () => {
  const text=summary({merchant:'Example Store',kind:'refund',cents:1234,purchaseDate:'2026-10-01',statement:'Refund promised.',resolution:'Return $12.34.'},[],[]);
  assert.match(text,/\$12\.34/); assert.match(text,/Refund promised\./); assert.match(text,/Not attached: Refund confirmation/);
  assert.match(text,/does not submit a dispute/);
});
