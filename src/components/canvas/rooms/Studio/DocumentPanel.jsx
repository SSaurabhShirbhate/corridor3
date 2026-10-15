// DocumentPanel - maps an archive record to the shared HUD overlay payload.
//
// The actual panel UI is the existing <GlobalOverlay /> (opened through
// SceneContext.openOverlay). This module is the single place that translates
// a drawer's document into that overlay shape, so the slide-out / camera-zoom
// flow and the panel content stay in sync.

const KIND_LABEL = {
    project: 'PROJECT',
    writeup: 'WRITE-UP',
    contact: 'RESUME & CONTACT',
};

export const toOverlayContent = (doc) => {
    if (!doc) return null;

    let description = doc.summary || '';
    if (Array.isArray(doc.links) && doc.links.length > 0) {
        const links = doc.links.map((l) => l.label).join(' · ');
        description = `${description}\n\n${links}`;
    }

    return {
        id: doc.id,
        title: doc.title,
        description,
        date: (doc.tags || []).join(' · '),
        url: doc.url || '',
        layout: 'default',
        platformConfig: { label: KIND_LABEL[doc.kind] || 'DOCUMENT' },
    };
};

export default toOverlayContent;
