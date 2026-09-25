// Static SEO content for Saurabh Shirbhate's portfolio.
// This is a forked copy of the reference project — Sanity integration was
// removed in favor of hardcoded data so the site never depends on the
// original author's Sanity project.

const SITE = {
    domain: 'https://saurabh-portfolio.pages.dev',
    siteTitle: 'Saurabh Shirbhate | Software Developer Portfolio',
    siteDescription: 'Interactive 3D developer portfolio by Saurabh Shirbhate. Explore Java, Spring Boot and React projects in a hand-drawn gallery.',
    aboutMe: "I'm a full-stack Java developer building insurance-domain systems at Sapiens — mostly the configuration layer that lets business analysts define products without a developer in the loop. XML/XSD/XSLT document transformation is my daily bread; Java and Spring Boot are the tools I reach for when something needs to be built for real. I like systems that are boring in the best way: predictable, documented, and fast.",
    personName: 'Saurabh Shirbhate',
    alternateName: ['Saurabh', 'Saurabh Shirbhate'],
    jobTitle: 'Software Developer',
    githubUrl: 'https://github.com/SSaurabhShirbhate',
    linkedinUrl: 'https://www.linkedin.com/in/saurabhshirbhate',
    knowsAbout: ['Java', 'Spring Boot', 'React', 'MySQL', 'XML', 'XSD', 'XSLT', 'GhostDraft', 'REST', 'Docker'],
};

// Static gallery projects (mirrors src/components/canvas/rooms/Gallery/GalleryRoom.jsx)
const PROJECTS = [
    {
        title: 'FCBankers',
        url: 'https://github.com/SSaurabhShirbhate',
        description: 'GhostDraft configurator built in Core Java with MySQL persistence — insurance products authored as structured XML/XSD/JSON documents and validated before they ever reach a build. Rollout time dropped from weeks to days.',
        techStack: ['jslogo.webp', 'csslogo.webp', 'htmllogo.webp']
    },
    {
        title: 'StarrKInsurance',
        url: 'https://github.com/SSaurabhShirbhate',
        description: 'Policy technical analyst work on the Sapiens GhostDraft configurator: automated document generation, managed workflows, and scrum-driven troubleshooting of configuration defects across P&C product lines.',
        techStack: ['jslogo.webp', 'csslogo.webp', 'htmllogo.webp']
    },
    {
        title: 'PolicyPal AI',
        url: 'https://github.com/SSaurabhShirbhate',
        description: 'An LLM + RAG assistant for policy documents built with Java and Spring Boot over embedded policy PDFs, a React front-end, and strict citations so every answer points at its source page.',
        techStack: ['reactlogo.webp', 'jslogo.webp', 'csslogo.webp', 'htmllogo.webp']
    },
    {
        title: 'LedgerLens',
        url: 'https://github.com/SSaurabhShirbhate',
        description: 'A microservices expense tracker (ledger, categorisation, insights) built with Spring Boot, MySQL and Docker, with an AI layer that auto-categorises transactions and surfaces spending patterns.',
        techStack: ['reactlogo.webp', 'jslogo.webp', 'csslogo.webp', 'netlifylogo.webp']
    },
];

const STUDIO = [];
const AWARDS = [];
const FAQ_LIST = [];

// Tech stack filename -> human-readable name mapping for JSON-LD
const TECH_STACK_NAMES = {
    'reactlogo.webp': 'React',
    'htmllogo.webp': 'HTML',
    'csslogo.webp': 'CSS',
    'jslogo.webp': 'JavaScript',
    'tailwindlogo.webp': 'Tailwind CSS',
    'firebaselogo.webp': 'Firebase',
    'netlifylogo.webp': 'Netlify',
    'wordpresslogo.webp': 'WordPress',
    'elementorlogo.webp': 'Elementor',
    'phplogo.webp': 'PHP',
};

/**
 * Helper to ensure dates are in ISO-8601 format with timezone for SEO.
 */
function formatIsoDate(dateString) {
    if (!dateString) return undefined;
    if (dateString.includes('T')) return dateString; // Already has time/timezone
    return `${dateString}T12:00:00Z`; // Default to noon UTC
}

/**
 * Build dynamic JSON-LD structured data.
 * This generates schema.org entities that AI search engines (Google AI Overviews,
 * Perplexity, Gemini) use to understand and cite content in their answers.
 */
function buildJsonLd(globalInfo, projects, studio, awards, faqList) {
    const graph = [];
    const domain = SITE.domain;

    // --- 1. Person: Central node of the Knowledge Graph ---
    const person = {
        '@type': 'Person',
        '@id': `${domain}/#person`,
        name: globalInfo?.personName || SITE.personName,
        alternateName: SITE.alternateName,
        url: domain,
        jobTitle: globalInfo?.jobTitle || SITE.jobTitle,
        description: globalInfo?.aboutMe || SITE.aboutMe,
        knowsAbout: SITE.knowsAbout,
        sameAs: [
            globalInfo?.linkedinUrl || SITE.linkedinUrl,
            globalInfo?.githubUrl || SITE.githubUrl
        ].filter(Boolean)
    };
    graph.push(person);

    // --- 2. WebSite ---
    const website = {
        '@type': 'WebSite',
        '@id': `${domain}/#website`,
        url: domain,
        name: globalInfo?.siteTitle || SITE.siteTitle,
        description: globalInfo?.siteDescription || SITE.siteDescription,
        publisher: { '@id': `${domain}/#person` }
    };
    graph.push(website);

    // --- 3. ProfilePage ---
    graph.push({
        '@type': 'ProfilePage',
        '@id': `${domain}/#profilepage`,
        url: domain,
        mainEntity: { '@id': `${domain}/#person` },
        about: { '@id': `${domain}/#person` }
    });

    // --- 4. FAQPage (GEO & AI search engine optimizer) ---
    if (faqList && faqList.length > 0) {
        graph.push({
            '@type': 'FAQPage',
            '@id': `${domain}/#faq`,
            mainEntity: faqList.map(item => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                }
            }))
        });
    }

    // --- 5. ItemList: Portfolio Projects (Google rich results for lists) ---
    if (projects && projects.length > 0) {
        graph.push({
            '@type': 'ItemList',
            '@id': `${domain}/#projectslist`,
            name: 'Portfolio Projects by Saurabh Shirbhate',
            description: 'Selected software development projects showcasing Java, Spring Boot, React, and full-stack engineering.',
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: p.title,
                    description: p.description || '',
                    url: p.url || undefined,
                    creator: { '@id': `${domain}/#person` },
                    ...(p.techStack && p.techStack.length > 0 ? {
                        keywords: p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')
                    } : {}),
                }
            }))
        });

        // Individual CreativeWork entries for each project (richer detail)
        projects.forEach(p => {
            const projectSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            graph.push({
                '@type': 'CreativeWork',
                '@id': `${domain}/#project-${projectSlug}`,
                name: p.title,
                description: p.description || '',
                url: p.url || undefined,
                creator: { '@id': `${domain}/#person` },
                ...(p.techStack && p.techStack.length > 0 ? {
                    keywords: p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')
                } : {}),
            });
        });
    }

    // --- 6. Studio Content ---
    if (studio && studio.length > 0) {
        studio.forEach((s, idx) => {
            const studioSlug = `studio-item-${idx}`;
            if (s.platform === 'youtube') {
                let embedUrl = undefined;
                if (s.url) {
                    const ytMatch = s.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/);
                    if (ytMatch && ytMatch[1]) {
                        embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
                    }
                }

                graph.push({
                    '@type': 'VideoObject',
                    '@id': `${domain}/#${studioSlug}`,
                    name: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    contentUrl: s.url || undefined,
                    ...(embedUrl ? { embedUrl } : {}),
                    thumbnailUrl: s.thumbnailUrl || `${domain}/og-image.webp`,
                    ...(s.duration ? { duration: `PT${s.duration.replace(':', 'M')}S` } : {}),
                    ...(s.date ? { uploadDate: formatIsoDate(s.date) } : {}),
                    ...(s.views ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/WatchAction', userInteractionCount: s.views } } : {}),
                    author: { '@id': `${domain}/#person` },
                });
            } else if (s.platform === 'blog' || s.platform === 'codrops') {
                graph.push({
                    '@type': 'Article',
                    '@id': `${domain}/#${studioSlug}`,
                    headline: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    image: s.thumbnailUrl || `${domain}/og-image.webp`,
                    ...(s.date ? { datePublished: formatIsoDate(s.date) } : {}),
                    ...(s.readTime ? { timeRequired: `PT${s.readTime.replace(' min', '')}M` } : {}),
                    author: { '@id': `${domain}/#person` },
                });
            } else if (s.platform === 'tiktok') {
                graph.push({
                    '@type': 'VideoObject',
                    '@id': `${domain}/#${studioSlug}`,
                    name: s.seoTitle || s.title,
                    description: s.seoDescription || s.description || '',
                    url: s.url || undefined,
                    contentUrl: s.url || undefined,
                    thumbnailUrl: s.thumbnailUrl || `${domain}/og-image.webp`,
                    ...(s.date ? { uploadDate: formatIsoDate(s.date) } : {}),
                    ...(s.views ? { interactionStatistic: { '@type': 'InteractionCounter', interactionType: 'https://schema.org/WatchAction', userInteractionCount: s.views } } : {}),
                    ...(s.likes ? { aggregateRating: { '@type': 'AggregateRating', ratingCount: s.likes } } : {}),
                    author: { '@id': `${domain}/#person` },
                });
            }
        });
    }

    // --- 7. Awards ---
    if (awards && awards.length > 0) {
        const categoryLabels = { sotd: 'Site of the Day', sotm: 'Site of the Month', other: 'Honorable Mention' };
        graph.push({
            '@type': 'ItemList',
            '@id': `${domain}/#awardslist`,
            name: 'Web Design Awards received by Saurabh Shirbhate',
            numberOfItems: awards.length,
            itemListElement: awards.map((a, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: `${categoryLabels[a.category] || a.category} — ${a.seoTitle || a.title}`,
                    ...(a.date ? { dateCreated: formatIsoDate(a.date) } : {}),
                    url: a.url || undefined,
                    description: a.seoDescription || undefined,
                    award: categoryLabels[a.category] || a.category,
                    creator: { '@id': `${domain}/#person` },
                }
            }))
        });
    }

    return {
        '@context': 'https://schema.org',
        '@graph': graph
    };
}

// Helper to generate the llms.txt content in clean Markdown
function buildLlmsTxt(globalInfo, projects, studio, awards, faqList) {
    const siteTitle = globalInfo?.siteTitle || SITE.siteTitle;
    const siteDescription = globalInfo?.siteDescription || SITE.siteDescription;
    const aboutMe = globalInfo?.aboutMe || SITE.aboutMe;

    let content = `# ${siteTitle}\n`;
    content += `> ${siteDescription}\n\n`;

    content += `## Biography / About Me\n`;
    content += `${aboutMe}\n\n`;

    content += `## Core Technologies & Skills\n`;
    content += `- Java, Spring Boot, React, MySQL, XML, XSD, XSLT, GhostDraft, REST, Docker, JavaScript, HTML, CSS.\n\n`;

    if (projects && projects.length > 0) {
        content += `## Selected Portfolio Projects\n`;
        projects.forEach(p => {
            const tech = p.techStack ? ` (Tech: ${p.techStack.map(t => TECH_STACK_NAMES[t] || t).join(', ')})` : '';
            content += `- [${p.title}](${p.url || SITE.domain}): ${p.description || ''}${tech}\n`;
        });
        content += `\n`;
    }

    if (studio && studio.length > 0) {
        content += `## Studio Content & Publications\n`;
        studio.forEach(s => {
            content += `- [${s.seoTitle || s.title} (${s.platform})](${s.url || SITE.domain}): ${s.seoDescription || s.description || ''}\n`;
        });
        content += `\n`;
    }

    if (awards && awards.length > 0) {
        content += `## Design Awards & Achievements\n`;
        const categoryLabels = { sotd: 'Site of the Day', sotm: 'Site of the Month', other: 'Honorable Mention' };
        awards.forEach(a => {
            const category = categoryLabels[a.category] || a.category;
            content += `- **${category}** — [${a.seoTitle || a.title}](${a.url || SITE.domain}): Awarded on ${a.date || 'unknown'}. ${a.seoDescription || ''}\n`;
        });
        content += `\n`;
    }

    if (faqList && faqList.length > 0) {
        content += `## Frequently Asked Questions (FAQ)\n`;
        faqList.forEach(item => {
            content += `- **${item.question}**\n`;
            content += `  ${item.answer.replace(/\n/g, '\n  ')}\n`;
        });
    }

    return content;
}

export function generateSeoHtml() {
    let cachedLlmsContent = '';

    const globalInfo = SITE;

    function getLlmsContent() {
        if (!cachedLlmsContent) {
            cachedLlmsContent = buildLlmsTxt(globalInfo, PROJECTS, STUDIO, AWARDS, FAQ_LIST);
        }
        return cachedLlmsContent;
    }

    return {
        name: 'static-seo-plugin',

        // Serve llms.txt in local development mode
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url === '/llms.txt') {
                    const content = getLlmsContent();
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    res.end(content);
                } else {
                    next();
                }
            });
        },

        // This hook runs when Vite generates or serves index.html
        transformIndexHtml(html) {
            const siteTitle = globalInfo.siteTitle;
            const siteDescription = globalInfo.siteDescription;
            const aboutMe = globalInfo.aboutMe;

            // Cache llms.txt content for later bundle emission
            cachedLlmsContent = getLlmsContent();

            // ====== PART 1: Build the semantic HTML string ======
            let seoHtml = `\n<div id="seo-content" class="sr-only-seo">\n`;

            seoHtml += `  <header>\n`;
            seoHtml += `    <h1>${siteTitle}</h1>\n`;
            seoHtml += `    <p>${siteDescription}</p>\n`;
            seoHtml += `  </header>\n`;

            seoHtml += `  <section id="about">\n`;
            seoHtml += `    <h2>About Me</h2>\n`;
            seoHtml += `    <p>${aboutMe}</p>\n`;
            if (globalInfo.githubUrl) seoHtml += `    <a href="${globalInfo.githubUrl}">GitHub</a>\n`;
            if (globalInfo.linkedinUrl) seoHtml += `    <a href="${globalInfo.linkedinUrl}">LinkedIn</a>\n`;
            seoHtml += `  </section>\n`;

            if (PROJECTS.length > 0) {
                seoHtml += `  <section id="projects">\n    <h2>Projects</h2>\n    <ul>\n`;
                PROJECTS.forEach(p => {
                    seoHtml += `      <li>\n        <h3>${p.title}</h3>\n        <p>${p.description || ''}</p>\n        ${p.url ? `<a href="${p.url}">Visit ${p.title}</a>\n` : ''}      </li>\n`;
                });
                seoHtml += `    </ul>\n  </section>\n`;
            }

            seoHtml += `</div>\n`;

            // ====== PART 2: Build dynamic JSON-LD ======
            const jsonLdSchemas = buildJsonLd(globalInfo, PROJECTS, STUDIO, AWARDS, FAQ_LIST);
            const jsonLdScript = `\n  <!-- Dynamic Structured Data (JSON-LD) -->\n  <script type="application/ld+json">\n${JSON.stringify(jsonLdSchemas, null, 2)}\n  </script>\n`;

            // ====== PART 3: Transform HTML ======
            // Update the <title> tag
            let transformedHtml = html.replace(
                /<title>(.*?)<\/title>/,
                `<title>${siteTitle}</title>`
            );

            // Add or replace meta description
            if (transformedHtml.includes('<meta name="description"')) {
                transformedHtml = transformedHtml.replace(
                    /<meta name="description" content="(.*?)"\s*\/?>/,
                    `<meta name="description" content="${siteDescription}" />`
                );
            } else {
                transformedHtml = transformedHtml.replace(
                    '</head>',
                    `  <meta name="description" content="${siteDescription}" />\n</head>`
                );
            }

            // Update Open Graph dynamic metadata
            transformedHtml = transformedHtml
                .replace(
                    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
                    `<meta property="og:title" content="${siteTitle}" />`
                )
                .replace(
                    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
                    `<meta property="og:description" content="${siteDescription}" />`
                );

            // Update Twitter card dynamic metadata
            transformedHtml = transformedHtml
                .replace(
                    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
                    `<meta name="twitter:title" content="${siteTitle}" />`
                )
                .replace(
                    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
                    `<meta name="twitter:description" content="${siteDescription}" />`
                );

            // Inject dynamic JSON-LD right before </head> (next to the existing static one)
            transformedHtml = transformedHtml.replace('</head>', `${jsonLdScript}</head>`);

            // Replace the static placeholder with the dynamic one to prevent duplicate #seo-content and double h1s
            if (transformedHtml.includes('id="seo-content"')) {
                transformedHtml = transformedHtml.replace(
                    /<div id="seo-content" class="sr-only-seo">[\s\S]*?<\/div>/,
                    seoHtml
                );
            } else {
                // Fallback injection if the template doesn't contain the static block
                transformedHtml = transformedHtml.replace('</body>', `${seoHtml}</body>`);
            }

            return transformedHtml;
        },

        // Emit llms.txt to the build output directory
        generateBundle() {
            const content = getLlmsContent();
            this.emitFile({
                type: 'asset',
                fileName: 'llms.txt',
                source: content
            });
        }
    };
}
