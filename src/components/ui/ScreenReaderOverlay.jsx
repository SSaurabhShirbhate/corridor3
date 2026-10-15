import { useScene } from '../../context/SceneContext';
import { useGalleryProjects } from '../../hooks/useSanityData';
import STUDIO_DOCUMENTS from '../../data/studio-documents';
import STUDIO_REELS from '../../data/studio-skills';
import '../../styles/ScreenReaderOverlay.scss';

/**
 * ScreenReaderOverlay — A7 Accessibility
 * 
 * Invisible HTML layer providing screen reader access to 3D canvas content.
 * Contains buttons/links matching interactive 3D elements (doors, rooms).
 * Visually hidden via .sr-only but fully accessible to assistive tech.
 */
const ScreenReaderOverlay = () => {
    const { hasEntered, isInRoom, currentRoom, teleportTo, requestExit, openOverlay } = useScene();
    
    // Pobieranie danych do wygenerowania niewidocznego HTML-a dla SEO / robotów
    const projects = useGalleryProjects();
    const studio = STUDIO_DOCUMENTS;

    return (
        <div className="sr-overlay" role="complementary" aria-label="Accessible navigation for 3D portfolio">
            {/* Skip to content link */}
            <a href="#sr-main-nav" className="sr-only sr-focusable">
                Skip to accessible navigation
            </a>

            {/* Main accessible navigation */}
            <nav id="sr-main-nav" className="sr-only" aria-label="Portfolio rooms">
                <h1>Saurabh Shirbhate — Software Developer Portfolio</h1>
                <h2>Portfolio Navigation</h2>

                {!hasEntered && (
                    <p>Welcome to Saurabh Shirbhate's interactive 3D portfolio. Click or press Enter on the doors to enter.</p>
                )}

                {hasEntered && !isInRoom && (
                    <>
                        <p>You are in the corridor. Choose a room to explore:</p>
                        <ul>
                            <li>
                                <button onClick={() => teleportTo('about')} type="button">
                                    About — My story, skills, and journey
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('gallery')} type="button">
                                    The Gallery — My projects and work
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('contact')} type="button">
                                    Contact — Get in touch with me
                                </button>
                            </li>
                            <li>
                                <button onClick={() => teleportTo('studio')} type="button">
                                    The Studio — Technologies and experience
                                </button>
                            </li>
                        </ul>
                    </>
                )}

                {hasEntered && isInRoom && (
                    <>
                        <p>
                            You are in the {currentRoom === 'about' ? 'About' :
                                currentRoom === 'gallery' ? 'Gallery' :
                                    currentRoom === 'contact' ? 'Contact' :
                                        currentRoom === 'studio' ? 'Studio' : currentRoom} room.
                        </p>
                        <button onClick={requestExit} type="button">
                            Go back to corridor
                        </button>

                        {/* Room-specific content descriptions */}
                        {currentRoom === 'about' && (
                            <div aria-label="About room content">
                                <h3>About Me</h3>
                                <p>This room contains my personal story, journey milestones, and technology skills displayed as interactive balloons.</p>
                            </div>
                        )}
                        {currentRoom === 'gallery' && (
                            <div aria-label="Gallery room content">
                                <h3>My Projects</h3>
                                <p>Browse through my portfolio projects displayed on paper cards. Click on a project card to see details and visit the live site.</p>
                                
                                {projects && projects.length > 0 && (
                                    <ul>
                                        {projects.map((p, i) => (
                                            <li key={i}>
                                                <h4>{p.title}</h4>
                                                <p>{p.description}</p>
                                                {p.url && <a href={p.url}>Visit {p.title}</a>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {currentRoom === 'contact' && (
                            <div aria-label="Contact room content">
                                <h3>Contact Me</h3>
                                <p>Find my social media links displayed as floating barrels. Click to visit my profiles on LinkedIn, GitHub, and other platforms.</p>
                            </div>
                        )}
                        {currentRoom === 'studio' && (
                            <div aria-label="Studio room content">
                                <h3>The Studio — The Letterpress</h3>
                                <p>A hand-drawn print shop. Each type form in the case is a skill category; load a form into the press, then pull the flywheel and the platen clamps down — printing a poster that lists that category's skills. Hover a form to paint it from black-and-white sketch to colour, click to load it, then pull the wheel (or press Enter) to print. Posters stack up on the side table; a skill row on the poster or a finished poster opens the matching project.</p>

                                {STUDIO_REELS.map((reel) => (
                                    <div key={reel.id}>
                                        <h4>{reel.label} — {reel.subtitle}</h4>
                                        <ul>
                                            {reel.skills.map((skill) => (
                                                <li key={skill.id}>
                                                    <strong>{skill.name}</strong> — {skill.note}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}

                                {studio && studio.length > 0 && (
                                    <>
                                        <h4>Projects &amp; write-ups</h4>
                                        <ul>
                                            {studio.map((s) => (
                                                <li key={s.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => openOverlay({
                                                            title: s.title,
                                                            description: s.summary,
                                                            date: (s.tags || []).join(' · '),
                                                            url: s.url,
                                                            layout: 'default',
                                                            platformConfig: { label: 'STUDIO RECORD' },
                                                        })}
                                                    >
                                                        {s.title}
                                                    </button>
                                                    <p>{s.summary}</p>
                                                    {(s.tags || []).length > 0 && <p>Tags: {s.tags.join(', ')}</p>}
                                                    {s.url && <a href={s.url}>View {s.title}</a>}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Quick navigation to other rooms */}
                        <h3>Quick Navigation</h3>
                        <ul>
                            {currentRoom !== 'about' && (
                                <li><button onClick={() => teleportTo('about')} type="button">Go to About</button></li>
                            )}
                            {currentRoom !== 'gallery' && (
                                <li><button onClick={() => teleportTo('gallery')} type="button">Go to Gallery</button></li>
                            )}
                            {currentRoom !== 'contact' && (
                                <li><button onClick={() => teleportTo('contact')} type="button">Go to Contact</button></li>
                            )}
                            {currentRoom !== 'studio' && (
                                <li><button onClick={() => teleportTo('studio')} type="button">Go to Studio</button></li>
                            )}
                        </ul>
                    </>
                )}
            </nav>

            {/* Live region for state changes */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {isInRoom && `Entered ${currentRoom} room`}
            </div>
        </div>
    );
};

export default ScreenReaderOverlay;
