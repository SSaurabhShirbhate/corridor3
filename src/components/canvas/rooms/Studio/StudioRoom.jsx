import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAchievements } from '../../../../context/AchievementsContext';
import { useScene } from '../../../../context/SceneContext';
import { useAudio } from '../../../../context/AudioManager';
import { useReducedMotion } from '../../../../hooks/useReducedMotion';
import Press from './Press';
import TypeCase from './TypeCase';
import Sheet from './Sheet';
import PosterStack from './PosterStack';
import { toOverlayContent } from './DocumentPanel';
import { getStudioDocument } from '../../../../data/studio-documents';
import { STUDIO_REELS, getReel } from '../../../../data/studio-skills';
import { SHELL } from './pressConfig';

// ============================================
// AUDIO SETTINGS - kept for API compatibility
// ============================================
// eslint-disable-next-line react-refresh/only-export-components
export const AUDIO_SETTINGS = {
    volume: 1,
    distance: 2,
    rolloff: 1.0,
};

// Existing sound files reused. TODO: source a dedicated press-clank and ink/roller
// squelch for a crisper print-shop feel.
const SOUND = {
    room: 'szumwiatru', // quiet room tone
    load: 'uchyleniedrzwi', // form loaded into the bed (creak) — placeholder
    print: 'papersound', // roller/platen contact + sheet — placeholder
};

const FRAMES_TO_WAIT = 5;

const featuredDocId = (reel) => {
    if (!reel) return null;
    for (const skill of reel.skills) {
        if (skill.projects && skill.projects.length) return skill.projects[0];
    }
    return null;
};

/**
 * StudioRoom - "The Letterpress".
 *
 * A hand-drawn print shop. Each skill *category* is a movable type form in the
 * case along the bottom. Load a form into the press, pull the flywheel, and the
 * platen clamps down — inking a poster that lists that category's skills. Each
 * printed poster stacks up on the side table; skill rows on the poster and the
 * finished posters both open the shared HUD overlay for a linked project.
 *
 * Keyboard: Tab / ArrowLeft / ArrowRight / A / D cycle the focused form;
 * Enter / Space loads the focused form (or pulls the wheel if one is loaded).
 *
 * Props contract (used by RoomInterior + RoomWarmup):
 *   showRoom, onReady, isExiting, isWarmup
 */
const StudioRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
    const reducedMotion = useReducedMotion();

    const { unlockAchievement, showTutorial, hidePopup } = useAchievements();
    const { openOverlay, overlayContent } = useScene();
    const { play } = useAudio();

    const [loadedReelId, setLoadedReelId] = useState(null);
    const [printedIds, setPrintedIds] = useState([]);
    const [focusedReelId, setFocusedReelId] = useState(null);

    const pressRef = useRef(null);

    const roomActive = showRoom && !isWarmup && !isExiting;
    const busy = !!overlayContent; // an overlay is open: freeze room input
    const interactive = roomActive && !busy;

    const loadedReel = useMemo(() => getReel(loadedReelId), [loadedReelId]);
    const loadedPrinted = loadedReelId ? printedIds.includes(loadedReelId) : false;

    // ---- first interaction achievement ----
    const hasInteracted = useRef(false);
    const markInteract = useCallback(() => {
        if (isWarmup || hasInteracted.current) return;
        hasInteracted.current = true;
        unlockAchievement('studio_interact');
    }, [isWarmup, unlockAchievement]);

    // ---- load a type form into the press ----
    const handleLoadForm = useCallback(
        (reel) => {
            if (!reel || isWarmup) return;
            markInteract();
            play(SOUND.load, { volume: 0.4 });
            setFocusedReelId(reel.id);
            setLoadedReelId(reel.id);
        },
        [isWarmup, play, markInteract]
    );

    // ---- the platen hit: the loaded form prints a poster ----
    const handleImpact = useCallback(() => {
        if (isWarmup) return;
        play(SOUND.print, { volume: 0.5 });
        if (!loadedReelId) return;
        markInteract();
        setPrintedIds((prev) => (prev.includes(loadedReelId) ? prev : [...prev, loadedReelId]));
    }, [isWarmup, play, loadedReelId, markInteract]);

    // ---- open the overlay doc for a project ----
    const openDoc = useCallback(
        (docId) => {
            if (isWarmup) return;
            const doc = getStudioDocument(docId);
            if (!doc) return;
            markInteract();
            play(SOUND.print, { volume: 0.3 });
            unlockAchievement('studio_open_doc');
            openOverlay(toOverlayContent(doc));
        },
        [isWarmup, openOverlay, play, markInteract, unlockAchievement]
    );

    const handleOpenSkill = useCallback(
        (skill) => {
            const docId = skill && skill.projects && skill.projects[0];
            if (docId) openDoc(docId);
        },
        [openDoc]
    );

    const handleOpenReel = useCallback(
        (reel) => {
            const docId = featuredDocId(reel);
            if (docId) openDoc(docId);
        },
        [openDoc]
    );

    // ---- cycle keyboard focus across the forms ----
    const cycleFocus = useCallback(
        (dir) => {
            const ids = STUDIO_REELS.map((r) => r.id);
            const cur = ids.indexOf(focusedReelId);
            const next = cur < 0 ? (dir > 0 ? 0 : ids.length - 1) : (cur + dir + ids.length) % ids.length;
            setFocusedReelId(ids[next]);
        },
        [focusedReelId]
    );

    // ---- room tone while the room is active ----
    useEffect(() => {
        if (!roomActive) return undefined;
        const tone = play(SOUND.room, { loop: true, volume: 0.1 });
        return () => tone?.stop?.();
    }, [roomActive, play]);

    // ---- keyboard ----
    useEffect(() => {
        if (!roomActive) return undefined;

        const onKey = (e) => {
            const ae = document.activeElement;
            const onBody = !ae || ae === document.body || ae.tagName === 'CANVAS';
            if (!onBody) return;
            if (busy) return;

            if (e.key === 'Tab') {
                e.preventDefault();
                cycleFocus(e.shiftKey ? -1 : 1);
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const targetId = focusedReelId;
                if (targetId && targetId !== loadedReelId) {
                    handleLoadForm(getReel(targetId));
                } else if (loadedReelId) {
                    pressRef.current?.pull();
                } else {
                    handleLoadForm(getReel(targetId || STUDIO_REELS[0].id));
                }
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                cycleFocus(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                cycleFocus(-1);
            } else if (e.key === 'Escape') {
                setFocusedReelId(null);
            }
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [roomActive, busy, loadedReelId, focusedReelId, cycleFocus, handleLoadForm]);

    useEffect(() => {
        if (isExiting) hidePopup?.();
    }, [isExiting, hidePopup]);

    // ---- real-render ready detection ----
    const frameCount = useRef(0);
    const hasSignaledReady = useRef(false);
    useFrame(() => {
        if (hasSignaledReady.current) return;
        frameCount.current += 1;
        if (frameCount.current >= FRAMES_TO_WAIT) {
            hasSignaledReady.current = true;
            onReady?.();
            if (!isWarmup) setTimeout(() => showTutorial?.('studio_interact'), 2000);
        }
    });

    return (
        <group>
            {/* ---- room shell: warm paper backdrop + floor + soft side walls ---- */}
            <mesh position={[0, SHELL.wallY, SHELL.wallZ]}>
                <planeGeometry args={[SHELL.wallW, SHELL.wallH]} />
                <meshBasicMaterial color={SHELL.wall} toneMapped={false} />
            </mesh>
            <mesh position={[0, SHELL.floorY, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[SHELL.wallW, 20]} />
                <meshBasicMaterial color="#e7dcc4" toneMapped={false} />
            </mesh>
            <mesh position={[-SHELL.sideX, 3, -5]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[14, 12]} />
                <meshBasicMaterial color="#e9ddc6" toneMapped={false} />
            </mesh>
            <mesh position={[SHELL.sideX, 3, -5]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[14, 12]} />
                <meshBasicMaterial color="#e9ddc6" toneMapped={false} />
            </mesh>

            {/* ---- the machine ---- */}
            <Press
                apiRef={pressRef}
                interactive={interactive}
                reducedMotion={reducedMotion}
                showHint={!!loadedReelId && !loadedPrinted}
                onImpact={handleImpact}
            />

            {/* ---- the poster on the bed ---- */}
            <Sheet
                reel={loadedReel}
                printed={loadedPrinted}
                interactive={interactive}
                onOpenSkill={handleOpenSkill}
            />

            {/* ---- the case of category forms ---- */}
            <TypeCase
                loadedReelId={loadedReelId}
                printedIds={printedIds}
                focusedReelId={focusedReelId}
                interactive={interactive}
                onLoadReel={handleLoadForm}
                onFocusReel={setFocusedReelId}
            />

            {/* ---- the pile of printed posters ---- */}
            <PosterStack printedIds={printedIds} interactive={interactive} onOpenReel={handleOpenReel} />
        </group>
    );
};

export default StudioRoom;
