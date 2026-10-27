# maboy

A consumer dispute preparation assistant for purchases that never arrived and promised refunds that never appeared.

## First prototype

Use **Try a missing-order example** or **Try a refund example** to load fictional case facts, a timeline, and three sample text documents. The summary builds immediately. Try removing evidence to exercise the checklist or download the JSON backup to inspect the embedded sample files. Loading an example asks before replacing an existing draft. Example notices remain in exports and printed summaries until the case is cleared.

Run `python -m http.server 8000` from this folder and visit http://localhost:8000. No installation or API key is required. Run checks with `node --test`.

The app collects case facts, attaches evidence, builds an editable timeline, identifies missing documents, and exports a JSON backup containing attachments. Print the summary to save a PDF; original evidence must be submitted separately to your provider.

All case information and attachment bytes stay in this tab's memory until you export them. Refreshing or closing clears the case. Nothing is uploaded or automatically submitted. Use sample documents while evaluating this prototype. There is no account system, cloud storage, AI extraction, bank integration, eligibility determination, deadline calculation, or guaranteed recovery.

## Next milestones

1. Test the preparation workflow with consumers who recently handled purchase disputes.
2. Improve document previews and create a bundled evidence export.
3. Add encrypted persistence and authenticated storage only after privacy and retention requirements are established.
4. Evaluate evidence extraction with user review and source references.

Pricing and willingness to pay remain unvalidated.
