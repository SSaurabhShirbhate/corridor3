// Studio room data — "The Letterpress"
//
// The Studio is the "how I build" room: skills & tools framed as a hand-drawn
// print shop. Each type *form* in the case is a category; loading a form into
// the press prints its *skills* onto a poster, one skill row at a time.
//
// This file is intentionally dependency-free (plain JS, no JSX, no browser
// APIs) so it can also be imported by `seo-plugin.js` at build time, keeping
// the crawlable text and the 3D scene in sync.
//
// Shape:
//   reel  { id, label, subtitle, accent, skills: [skill] }
//   skill { id, name, level (1-5), note, projects: [studio-document id] }
//
// Project ids reference `src/data/studio-documents.js` so a projected "used in"
// chip can open the same overlay the Gallery/Archive use.

export const LEVEL_LABELS = ['Learning', 'Working', 'Comfortable', 'Strong', 'Daily driver'];

export const STUDIO_REELS = [
    {
        id: 'backend',
        label: 'BACKEND',
        subtitle: 'APIs, services & domain logic',
        accent: '#c05a4a',
        skills: [
            {
                id: 'java',
                name: 'Java',
                level: 5,
                note: 'Daily driver — Core Java for tooling, batch jobs and the GhostDraft config layer.',
                projects: ['fcbankers', 'policypal-ai'],
            },
            {
                id: 'spring-boot',
                name: 'Spring Boot',
                level: 5,
                note: 'REST services and microservices behind LedgerLens and PolicyPal AI.',
                projects: ['ledgerlens', 'policypal-ai'],
            },
            {
                id: 'hibernate',
                name: 'Hibernate',
                level: 4,
                note: 'JPA/Hibernate persistence from the CDAC PG-DAC full-stack track.',
                projects: ['ledgerlens'],
            },
            {
                id: 'rest-apis',
                name: 'REST APIs',
                level: 4,
                note: 'Designed and shipped REST microservices end to end.',
                projects: ['ledgerlens', 'policypal-ai'],
            },
            {
                id: 'microservices',
                name: 'Microservices',
                level: 4,
                note: 'LedgerLens: independent ledger, categorisation and insights services.',
                projects: ['ledgerlens'],
            },
            {
                id: 'system-design',
                name: 'System Design',
                level: 3,
                note: 'Schemas and service boundaries drawn out before any code.',
                projects: ['ledgerlens'],
            },
        ],
    },
    {
        id: 'frontend',
        label: 'FRONTEND',
        subtitle: 'Interfaces people actually touch',
        accent: '#c98a2b',
        skills: [
            {
                id: 'react',
                name: 'React',
                level: 4,
                note: 'Front-ends for PolicyPal AI and LedgerLens — components, state, routing.',
                projects: ['policypal-ai', 'ledgerlens'],
            },
            {
                id: 'javascript',
                name: 'JavaScript',
                level: 4,
                note: 'Everyday browser work and interactive components.',
                projects: [],
            },
            {
                id: 'typescript',
                name: 'TypeScript',
                level: 3,
                note: 'Typed React front-ends for larger features.',
                projects: ['policypal-ai'],
            },
            {
                id: 'tailwind',
                name: 'Tailwind CSS',
                level: 3,
                note: 'Utility-first styling to move from mockup to UI fast.',
                projects: [],
            },
            {
                id: 'nextjs',
                name: 'Next.js',
                level: 3,
                note: 'SSR/SSG for modern React apps.',
                projects: [],
            },
            {
                id: 'html-css',
                name: 'HTML / CSS',
                level: 4,
                note: 'Responsive, cross-browser layouts since the Mine8 internship.',
                projects: [],
            },
        ],
    },
    {
        id: 'data',
        label: 'DATA',
        subtitle: 'Storage & document pipelines',
        accent: '#4a7a5e',
        skills: [
            {
                id: 'mysql',
                name: 'MySQL',
                level: 5,
                note: 'Primary store for FCBankers and LedgerLens persistence.',
                projects: ['fcbankers', 'ledgerlens'],
            },
            {
                id: 'sql',
                name: 'SQL',
                level: 4,
                note: 'Query design and tuning across MySQL and PostgreSQL.',
                projects: ['ledgerlens'],
            },
            {
                id: 'postgresql',
                name: 'PostgreSQL',
                level: 3,
                note: 'Relational modelling beyond MySQL.',
                projects: [],
            },
            {
                id: 'mongodb',
                name: 'MongoDB',
                level: 3,
                note: 'Document-store experiments where the shape fits.',
                projects: [],
            },
            {
                id: 'xml-xslt',
                name: 'XML / XSD / XSLT',
                level: 5,
                note: 'Document-transformation pipelines — authored to running product.',
                projects: ['fcbankers', 'starrk-insurance'],
            },
        ],
    },
    {
        id: 'devops',
        label: 'DEVOPS & TOOLS',
        subtitle: 'Ship it, then keep it running',
        accent: '#4a6fa5',
        skills: [
            {
                id: 'docker',
                name: 'Docker',
                level: 4,
                note: 'Containerised deployments for LedgerLens.',
                projects: ['ledgerlens'],
            },
            {
                id: 'git',
                name: 'Git',
                level: 5,
                note: 'Branching, code reviews and day-to-day version control.',
                projects: [],
            },
            {
                id: 'github',
                name: 'GitHub',
                level: 5,
                note: 'Source, pull requests — and this portfolio.',
                projects: [],
            },
            {
                id: 'cloud',
                name: 'AWS / Cloud',
                level: 3,
                note: 'Cloud delivery and deployment fundamentals.',
                projects: [],
            },
            {
                id: 'maven',
                name: 'Maven',
                level: 4,
                note: 'Java build and dependency management.',
                projects: ['ledgerlens'],
            },
            {
                id: 'postman',
                name: 'Postman',
                level: 4,
                note: 'API development, testing and debugging.',
                projects: ['ledgerlens'],
            },
        ],
    },
    {
        id: 'intelligence',
        label: 'INTELLIGENCE',
        subtitle: 'AI, automation & config systems',
        accent: '#7a5aa5',
        skills: [
            {
                id: 'llm-rag',
                name: 'LLM / RAG',
                level: 3,
                note: 'PolicyPal AI — retrieval over policy PDFs with strict page citations.',
                projects: ['policypal-ai'],
            },
            {
                id: 'ai-tools',
                name: 'AI Tools',
                level: 4,
                note: 'AI-assisted development across the whole stack.',
                projects: [],
            },
            {
                id: 'ghostdraft',
                name: 'GhostDraft',
                level: 5,
                note: 'Insurance document configuration at Sapiens, authored by analysts.',
                projects: ['fcbankers', 'starrk-insurance'],
            },
            {
                id: 'scrum',
                name: 'Scrum',
                level: 4,
                note: 'Sprint cadence and configuration-defect triage.',
                projects: ['starrk-insurance'],
            },
        ],
    },
];

// Flat list of every skill (kept tiny for the SEO plugin + a11y layer).
export const ALL_SKILLS = STUDIO_REELS.flatMap((reel) =>
    reel.skills.map((skill) => ({ ...skill, reel: reel.id, reelLabel: reel.label }))
);

export const getReel = (id) => STUDIO_REELS.find((r) => r.id === id) || null;

export const getSkill = (id) => ALL_SKILLS.find((s) => s.id === id) || null;

export default STUDIO_REELS;
