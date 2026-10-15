// Studio room data — "The Archive Wall"
//
// Each *real* drawer in the cabinet wall contains one of these records. The
// file is intentionally dependency-free (plain JS, no JSX, no browser APIs)
// so it can also be imported by `seo-plugin.js` at build time. That keeps the
// crawlable text and the 3D scene from ever drifting apart.
//
// Shape: { id, label, title, summary, tags, url, kind }
//   id      — stable slug (also used as a React key / overlay id)
//   label   — short hand-lettered drawer sticker, e.g. "FCB-2025"
//   title   — human readable title shown in the panel
//   summary — 1–2 lines shown in the document panel
//   tags    — short tech/keyword tags
//   url     — link to the real project / write-up. Empty string if unknown.
//   kind    — "project" | "writeup" | "contact"

export const STUDIO_DOCUMENTS = [
    {
        id: 'fcbankers',
        label: 'FCB-2025',
        title: 'FCBankers',
        summary:
            'GhostDraft configurator in Core Java + MySQL. Insurance products are authored as XML/XSD/JSON, validated before build, and rollout dropped from weeks to days.',
        tags: ['Java', 'MySQL', 'XML', 'XSD', 'GhostDraft'],
        // TODO: add the repository / case-study URL
        url: '',
        kind: 'project',
    },
    {
        id: 'starrk-insurance',
        label: 'STARRK-INS',
        title: 'StarrKInsurance',
        summary:
            'Policy technical analyst on the Sapiens GhostDraft configurator: automated document generation and scrum troubleshooting of configuration defects across P&C lines.',
        tags: ['GhostDraft', 'P&C', 'Automation', 'XSLT'],
        // TODO: add the repository / case-study URL
        url: '',
        kind: 'project',
    },
    {
        id: 'policypal-ai',
        label: 'POLICYPAL-AI',
        title: 'PolicyPal AI',
        summary:
            'LLM + RAG assistant over policy PDFs (Java, Spring Boot, React) that answers with strict page citations so every claim points back to its source.',
        tags: ['Java', 'Spring Boot', 'React', 'RAG', 'LLM'],
        // TODO: add the repository / case-study URL
        url: '',
        kind: 'project',
    },
    {
        id: 'ledgerlens',
        label: 'LEDGERLENS',
        title: 'LedgerLens',
        summary:
            'Microservices expense tracker (Spring Boot, MySQL, Docker) with an AI layer that auto-categorises transactions and surfaces spending patterns.',
        tags: ['Spring Boot', 'MySQL', 'Docker', 'Microservices', 'AI'],
        // TODO: add the repository / case-study URL
        url: '',
        kind: 'project',
    },
    // ---- Write-ups (placeholder copy — marked for rewrite) ----
    {
        id: 'why-xsd-before-build',
        label: 'XSD-FIRST',
        title: 'Why XSD validation belongs before the build',
        // TODO: rewrite
        summary:
            'Placeholder: catching malformed configuration at schema level is cheaper than catching it in production. Draft pending.',
        // TODO: rewrite
        tags: ['XSD', 'XML', 'Validation'],
        // TODO: add a URL when the write-up is published
        url: '',
        kind: 'writeup',
    },
    {
        id: 'xslt-vs-templates',
        label: 'XSLT-NOTES',
        title: 'XSLT vs templates for document generation',
        // TODO: rewrite
        summary:
            'Placeholder: when a transform language beats a templating engine, and when it quietly becomes a maintenance tax. Draft pending.',
        // TODO: rewrite
        tags: ['XSLT', 'Templating', 'Documents'],
        // TODO: add a URL when the write-up is published
        url: '',
        kind: 'writeup',
    },
    {
        id: 'config-layers-analysts-own',
        label: 'CONFIG-LAYERS',
        title: 'Config layers business analysts can own',
        // TODO: rewrite
        summary:
            'Placeholder: designing the configuration layers so non-developers can change products without touching code. Draft pending.',
        // TODO: rewrite
        tags: ['Configuration', 'GhostDraft', 'DX'],
        // TODO: add a URL when the write-up is published
        url: '',
        kind: 'writeup',
    },
    // ---- The stuck "DO NOT OPEN" drawer: resume + contact links ----
    {
        id: 'stuck-drawer',
        label: 'DO NOT OPEN',
        title: 'Resume & Contact',
        summary:
            'You pulled the forbidden drawer. Inside: my resume and the fastest ways to reach me.',
        tags: ['Resume', 'GitHub', 'LinkedIn'],
        url: '/resume/saurabh-shirbhate-resume.pdf',
        kind: 'contact',
        links: [
            { label: 'Resume (PDF)', url: '/resume/saurabh-shirbhate-resume.pdf' },
            { label: 'GitHub', url: 'https://github.com/SSaurabhShirbhate' },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/saurabhshirbhate' },
        ],
    },
];

// Convenience helpers (kept tiny so both the scene and the SEO plugin agree)
export const getStudioDocument = (id) =>
    STUDIO_DOCUMENTS.find((doc) => doc.id === id) || null;

// The stuck drawer is always the last record and is *not* a normal document.
export const STUCK_DOCUMENT = STUDIO_DOCUMENTS.find((doc) => doc.kind === 'contact');

export default STUDIO_DOCUMENTS;
