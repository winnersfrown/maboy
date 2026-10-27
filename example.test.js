import test from 'node:test';
import assert from 'node:assert/strict';
import {createExample} from './example.js';
import {amountInCents, missingEvidence, summary} from './case.js';
for (const kind of ['missing','refund']) test(`${kind} example supports a complete case and exposes missing evidence after removal`, () => {
  const sample=createExample(kind);
  assert.equal(amountInCents(sample.fields.amount),8995);
  assert.deepEqual(missingEvidence(kind,sample.documents),[]);
  assert.equal(missingEvidence(kind,sample.documents.slice(0,2)).length,1);
  for(const doc of sample.documents) {
    assert.match(doc.content,/FICTIONAL EXAMPLE/);
    assert.equal(atob(btoa(doc.content)),doc.content);
  }
  const output=summary({...sample.fields,cents:8995},sample.events,sample.documents);
  assert.match(output,/\$89\.95/);
  assert.match(output,/fictional/);
});
test('example loads return independent state',()=>{
  const first=createExample();first.events.pop();first.fields.merchant='Changed';
  assert.equal(createExample().events.length,3);
  assert.notEqual(createExample().fields.merchant,'Changed');
});
