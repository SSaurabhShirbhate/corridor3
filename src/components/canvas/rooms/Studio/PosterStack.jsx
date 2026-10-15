import { useMemo, useState } from 'react';
import { Text, useTexture, useCursor } from '@react-three/drei';
import { STUDIO_REELS } from '../../../../data/studio-skills';
import { STACK, TEXTURES, COLORS, LABEL_FONT, BODY_FONT } from './pressConfig';

const shortOf = (reel) => (reel.id === 'intelligence' ? 'AI' : reel.label.split(' ')[0]);

const PosterSprite = ({ reel, index, interactive, onOpen }) => {
    const [sheetTex] = useTexture([TEXTURES.sheet]);
    const [cursorHover, setCursorHover] = useState(false);
    useCursor(cursorHover);

    const jitter = useMemo(() => {
        const s = Math.sin(index * 12.9898) * 43758.5453;
        return { x: (s - Math.floor(s)) * 0.05 - 0.025, r: ((s * 7) % 1) * 0.06 - 0.03 };
    }, [index]);

    const y = STACK.y + index * STACK.step;
    const z = STACK.z + index * 0.006;

    return (
        <group
            position={[STACK.x + jitter.x, y, z]}
            rotation={[0, jitter.r, jitter.r * 1.4]}
            onClick={
                interactive
                    ? (e) => {
                          e.stopPropagation();
                          onOpen?.(reel);
                      }
                    : undefined
            }
            onPointerOver={
                interactive
                    ? (e) => {
                          e.stopPropagation();
                          setCursorHover(true);
                      }
                    : undefined
            }
            onPointerOut={interactive ? () => setCursorHover(false) : undefined}
        >
            <mesh>
                <planeGeometry args={[STACK.w, STACK.h]} />
                <meshBasicMaterial map={sheetTex} transparent alphaTest={0.05} toneMapped={false} />
            </mesh>
            {/* accent header band */}
            <mesh position={[0, STACK.h * 0.32, 0.003]}>
                <planeGeometry args={[STACK.w * 0.7, 0.05]} />
                <meshBasicMaterial color={reel.accent} toneMapped={false} />
            </mesh>
            <Text
                position={[0, STACK.h * 0.42, 0.004]}
                font={LABEL_FONT}
                fontSize={0.12}
                color={COLORS.ink}
                anchorX="center"
                anchorY="middle"
                maxWidth={STACK.w - 0.1}
                textAlign="center"
            >
                {shortOf(reel)}
            </Text>
        </group>
    );
};

/** PosterStack - the pile of printed posters on the side table. */
const PosterStack = ({ printedIds, interactive, onOpenReel }) => {
    const printed = useMemo(() => {
        const set = new Set(printedIds || []);
        return STUDIO_REELS.filter((r) => set.has(r.id));
    }, [printedIds]);

    return (
        <group>
            {/* sample-board shelf */}
            <mesh position={[STACK.x, STACK.y - STACK.h / 2 - 0.03, STACK.z - 0.05]}>
                <planeGeometry args={[STACK.w + 0.5, 0.09]} />
                <meshBasicMaterial color={COLORS.wood} toneMapped={false} />
            </mesh>

            {printed.map((reel, i) => (
                <PosterSprite
                    key={reel.id}
                    reel={reel}
                    index={i}
                    interactive={interactive}
                    onOpen={onOpenReel}
                />
            ))}

            {printed.length === 0 && (
                <Text
                    position={[STACK.x, STACK.y + 0.1, STACK.z]}
                    font={BODY_FONT}
                    fontSize={0.12}
                    color={COLORS.inkSoft}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.6}
                    textAlign="center"
                >
                    No posters yet
                </Text>
            )}

            <Text
                position={[STACK.x, STACK.y + STACK.h / 2 + 0.2, STACK.z]}
                font={LABEL_FONT}
                fontSize={0.13}
                color={COLORS.inkSoft}
                anchorX="center"
                anchorY="middle"
            >
                {`${printed.length} / ${STUDIO_REELS.length} printed`}
            </Text>
        </group>
    );
};

export default PosterStack;
