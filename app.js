import {amountInCents, missingEvidence, sortedEvents, summary} from './case.js';
const $ = id => document.getElementById(id);
const form = $('case-form');
let evidence = [], events = [], current = null, generation = 0;
const status = message => { $('status').textContent = message; };
function invalidate() {
  current = null;
  $('summary').hidden = true;
  $('exports').hidden = true;
}
function draw() {
  function list(id, entries, collection) {
    $(id).replaceChildren();
    for (const item of entries) {
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = collection === 'evidence' ? `${item.category} · ${item.name}` : `${item.date} · ${item.description}`;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'secondary'; button.textContent = 'Remove';
      button.setAttribute('aria-label', `Remove ${collection === 'evidence' ? item.name : item.description}`);
      button.onclick = () => {
        if (collection === 'evidence') evidence = evidence.filter(e => e.id !== item.id);
        else events = events.filter(e => e.id !== item.id);
        invalidate(); draw(); status('Case updated. Build your summary again when ready.');
      };
      li.append(text, button); $(id).append(li);
    }
  }
  list('evidence-list', evidence, 'evidence'); list('timeline', sortedEvents(events), 'events');
  const missing = missingEvidence(form.elements.kind.value, evidence);
  $('checklist').textContent = missing.length ? `Suggested documents still missing: ${missing.join('; ')}.` : 'Suggested document categories attached. Review each file for relevance and accuracy.';
}
form.addEventListener('input', () => { invalidate(); status('Draft updated. Build your summary when ready.'); });
form.elements.kind.addEventListener('change', draw);
$('files').addEventListener('change', async event => {
  const token = generation;
  const selected = [...event.target.files];
  const category = $('category').value;
  event.target.disabled = true;
  invalidate();
  const messages = [];
  try {
    for (const file of selected) {
      if (token !== generation) break;
      if (!/\.(pdf|png|jpe?g|txt)$/i.test(file.name)) { messages.push(`${file.name}: unsupported file type.`); continue; }
      if (!file.size || file.size > 5 * 1024 * 1024 || evidence.reduce((n,e) => n + e.size,0) + file.size > 20 * 1024 * 1024) {
        messages.push(`${file.name}: empty file or size limit exceeded.`); continue;
      }
      try {
        const dataUrl = await new Promise((resolve,reject) => {
          const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
        });
        if (token === generation) evidence.push({id:crypto.randomUUID(), name:file.name, category, size:file.size, dataUrl});
      } catch { messages.push(`${file.name}: could not read file. Try attaching it again.`); }
    }
    if (token === generation) { invalidate(); draw(); status(messages.length ? messages.join('\n') : 'Evidence attached in this tab. Build your summary when ready.'); }
  } finally { event.target.disabled = false; event.target.value = ''; }
});
$('add-event').onclick = () => {
  const date = $('event-date').value, description = $('event-description').value.trim();
  if (!date || !description) { status('Add both an event date and description.'); return; }
  events.push({id:crypto.randomUUID(), date, description});
  $('event-date').value = ''; $('event-description').value = '';
  invalidate(); draw(); status('Event added to your timeline.');
};
form.onsubmit = event => {
  event.preventDefault();
  if ($('files').disabled) { status('Wait for evidence files to finish loading.'); return; }
  const fields = Object.fromEntries(new FormData(form));
  for (const key of Object.keys(fields)) fields[key] = fields[key].trim();
  if (!fields.merchant || !fields.statement || !fields.resolution) { status('Complete the merchant, statement, and requested resolution.'); return; }
  try { fields.cents = amountInCents(fields.amount); }
  catch(error) { status(error.message); return; }
  const timeline = [{date:fields.purchaseDate, description:'Purchase made'}, ...sortedEvents(events)];
  current = {version:1, case:fields, timeline, evidence:[...evidence], summary:summary(fields, timeline, evidence)};
  $('summary').textContent = current.summary; $('summary').hidden = false; $('exports').hidden = false;
  status('Ready for your review. Check all facts and document contents before submitting.');
};
$('download').onclick = () => {
  if (!current) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(current,null,2)],{type:'application/json'}));
  const link = document.createElement('a'); link.href = url; link.download = 'maboy-case-backup.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
  status('Backup downloaded with attachment bytes. Keep it somewhere private.');
};
$('print').onclick = () => { if (current) window.print(); };
$('clear').onclick = () => {
  if (!confirm('Clear this case and all attached files? Export a backup first if you need it.')) return;
  generation++; evidence=[]; events=[]; form.reset(); invalidate(); $('summary').textContent=''; draw(); status('Case cleared.');
};
window.addEventListener('beforeunload', event => {
  if (evidence.length || events.length || form.elements.merchant.value || form.elements.statement.value) { event.preventDefault(); event.returnValue=''; }
});
draw();
