import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import '../../shaders/RevealMaterial';
import { STUDIO_REELS } from '../../../../data/studio-skills';
import { TYPE_CASE, SHEET, TEXTURES, COLORS, LABEL_FONT } from './pressConfig';

const SHORT = { intelligence: 'AI', devops: 'DEVOPS' };
const shortLabel = (reel) => SHORT[reel.id] || reel.label.split(' ')[0];

const tileX = (i, n) => {
    if (n <= 1) return SHEET.x;
    const step = TYPE_CASE.span / (n - 1);
    return SHEET.x + (i - (n - 1) / 2) * step;
};

/** One wooden type form in the case. Hover paints it; click loads it. */
const FormTile = ({ reel, index, count, loaded, printed, focused, interactive, onLoad, onFocus }) => {
    const [sketchTex, paintedTex] = useTexture([TEXTURES.form, TEXTURES.formPainted]);
    const revealRef = useRef(null);
    const hovered = useRef(false);
    const paint = useRef(0);
    const [cursorHover, setCursorHover] = useState(false);
    useCursor(cursorHover);

    const x = useMemo(() => tileX(index, count), [index, count]);

    const over = useCallback((e) => {
        e?.stopPropagation?.();
        hovered.current = true;
        setCursorHover(true);
    }, []);
    const out = useCallback(() => {
        hovered.current = false;
        setCursorHover(false);
    }, []);
    const click = useCallback(
        (e) => {
            e?.stopPropagation?.();
            if (!interactive) return;
            onFocus?.(reel.id);
            onLoad?.(reel);
        },
        [interactive, reel, onLoad, onFocus]
    );

    const loadedRef = useRef(loaded);
    useEffect(() => {
        loadedRef.current = loaded;
    }, [loaded]);

    useFrame((_, delta) => {
        const want = hovered.current || loadedRef.current ? 1 : 0;
        paint.current = THREE.MathUtils.damp(paint.current, want, 7, delta);
        if (revealRef.current) revealRef.current.uProgress = paint.current;
    });

    return (
        <group position={[x, TYPE_CASE.y, TYPE_CASE.z]}>
            {/* painted layer */}
            <mesh position={[0, 0, 0.001]}>
                <planeGeometry args={[TYPE_CASE.tileW, TYPE_CASE.tileH]} />
                <meshBasicMaterial map={paintedTex} transparent alphaTest={0.1} toneMapped={false} />
            </mesh>
            {/* sketch layer, wiped on hover/load */}
            <mesh
                position={[0, 0, 0.002]}
                ref={(m) => {
                    if (m && m.material) revealRef.current = m.material;
                }}
            >
                <planeGeometry args={[TYPE_CASE.tileW, TYPE_CASE.tileH]} />
                <revealMaterial map={sketchTex} transparent alphaTest={0.1} toneMapped={false} />
            </mesh>

            {/* label below the tile */}
            <Text
                position={[0, -TYPE_CASE.tileH * 0.5 - 0.11, 0.02]}
                font={LABEL_FONT}
                fontSize={0.12}
                color={COLORS.ink}
                anchorX="center"
                anchorY="middle"
                maxWidth={1.2}
                textAlign="center"
            >
                {shortLabel(reel)}
            </Text>

            {/* printed tick */}
            {printed && (
                <Text
                    position={[TYPE_CASE.tileW * 0.46, TYPE_CASE.tileH * 0.42, 0.02]}
                    font={LABEL_FONT}
                    fontSize={0.14}
                    color={reel.accent}
                    anchorX="center"
                    anchorY="middle"
                >
                    •
                </Text>
            )}

            {/* focus underline */}
            {focused && (
                <mesh position={[0, TYPE_CASE.tileH * 0.5 + 0.045, 0.006]}>
                    <planeGeometry args={[TYPE_CASE.tileW, 0.035]} />
                    <meshBasicMaterial color={COLORS.highlight} toneMapped={false} />
                </mesh>
            )}

            {/* hitbox */}
            <mesh position={[0, 0, 0.03]} onClick={click} onPointerOver={over} onPointerOut={out}>
                <planeGeometry args={[TYPE_CASE.tileW * 1.15, TYPE_CASE.tileH * 1.35]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    );
};

/** TypeCase - the wooden tray of category forms along the bottom. */
const TypeCase = ({ loadedReelId, printedIds, focusedReelId, interactive, onLoadReel, onFocusReel }) => {
    const reels = STUDIO_REELS;
    const printed = useMemo(() => new Set(printedIds || []), [printedIds]);

    return (
        <group>
            {/* tray */}
            <mesh position={[SHEET.x, TYPE_CASE.y, TYPE_CASE.z - 0.06]}>
                <planeGeometry args={[TYPE_CASE.span + 1.1, TYPE_CASE.tileH + 0.5]} />
                <meshBasicMaterial color={COLORS.wood} toneMapped={false} />
            </mesh>
            <mesh position={[SHEET.x, TYPE_CASE.y - (TYPE_CASE.tileH + 0.5) * 0.5, TYPE_CASE.z - 0.03]}>
                <planeGeometry args={[TYPE_CASE.span + 1.1, 0.05]} />
                <meshBasicMaterial color={COLORS.ink} toneMapped={false} transparent opacity={0.7} />
            </mesh>

            {reels.map((reel, i) => (
                <FormTile
                    key={reel.id}
                    reel={reel}
                    index={i}
                    count={reels.length}
                    loaded={loadedReelId === reel.id}
                    printed={printed.has(reel.id)}
                    focused={focusedReelId === reel.id}
                    interactive={interactive}
                    onLoad={onLoadReel}
                    onFocus={onFocusReel}
                />
            ))}
        </group>
    );
};

export default TypeCase;
