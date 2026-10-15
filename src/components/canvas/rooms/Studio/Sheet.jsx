import { useRef, useMemo, useEffect, useState } from 'react';
import { Text, useTexture, useCursor } from '@react-three/drei';
import gsap from 'gsap';
import { SHEET, TEXTURES, COLORS, LABEL_FONT, BODY_FONT, LEVELS } from './pressConfig';

const ROW_TOP = 0.15;
const ROW_STEP = 0.235;

/** Five brass pips showing a skill level. */
const LevelPips = ({ level, accent }) => {
    const pips = [];
    for (let i = 0; i < LEVELS.max; i += 1) {
        pips.push(
            <mesh key={i} position={[-i * 0.11, 0, 0]}>
                <planeGeometry args={[0.07, 0.07]} />
                <meshBasicMaterial
                    color={i < level ? accent : COLORS.inkSoft}
                    transparent
                    opacity={i < level ? 1 : 0.28}
                    toneMapped={false}
                />
            </mesh>
        );
    }
    return <group>{pips}</group>;
};

const SkillRow = ({ skill, y, accent, interactive, onOpen }) => {
    const [cursorHover, setCursorHover] = useState(false);
    useCursor(cursorHover && skill.projects.length > 0);
    const openable = skill.projects.length > 0;

    return (
        <group position={[0, y, 0.01]}>
            <Text
                position={[-SHEET.w / 2 + 0.35, 0, 0]}
                font={BODY_FONT}
                fontSize={0.145}
                color={COLORS.ink}
                anchorX="left"
                anchorY="middle"
                maxWidth={SHEET.w - 1.9}
            >
                {skill.name}
            </Text>
            <group position={[SHEET.w / 2 - 0.5, 0, 0]}>
                <LevelPips level={skill.level} accent={accent} />
            </group>
            {openable && (
                <Text
                    position={[SHEET.w / 2 - 0.22, 0, 0]}
                    font={LABEL_FONT}
                    fontSize={0.16}
                    color={COLORS.highlight}
                    anchorX="center"
                    anchorY="middle"
                >
                    +
                </Text>
            )}
            {interactive && openable && (
                <mesh
                    position={[0, 0, 0.02]}
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen?.(skill);
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        setCursorHover(true);
                    }}
                    onPointerOut={() => setCursorHover(false)}
                >
                    <planeGeometry args={[SHEET.w - 0.2, ROW_STEP * 0.8]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>
            )}
        </group>
    );
};

/**
 * Sheet - the poster currently on the press bed. When a reel has been printed it
 * shows the category title and its skills; each skill (with a linked project)
 * opens the overlay document.
 */
const Sheet = ({ reel, printed, interactive, onOpenSkill }) => {
    const [sheetTex] = useTexture([TEXTURES.sheet]);
    const contentRef = useRef();
    const active = reel;

    const skills = useMemo(() => (active ? active.skills : []), [active]);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return undefined;
        gsap.killTweensOf(el.scale);
        if (reel) {
            el.scale.set(0.96, 0.96, 1);
            gsap.to(el.scale, { x: 1, y: 1, duration: 0.4, ease: 'back.out(1.8)' });
        }
        return () => {
            gsap.killTweensOf(el.scale);
        };
    }, [reel]);

    return (
        <group position={[SHEET.x, SHEET.y, SHEET.z]}>
            {/* the paper */}
            <mesh>
                <planeGeometry args={[SHEET.w, SHEET.h]} />
                <meshBasicMaterial map={sheetTex} transparent alphaTest={0.05} toneMapped={false} />
            </mesh>

            {active ? (
                <group ref={contentRef} position={[0, 0, 0.02]}>
                    {/* category header */}
                    <Text
                        position={[0, SHEET.h / 2 - 0.34, 0]}
                        font={LABEL_FONT}
                        fontSize={0.34}
                        color={COLORS.ink}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={SHEET.w - 0.5}
                        textAlign="center"
                    >
                        {active.label}
                    </Text>
                    <mesh position={[0, SHEET.h / 2 - 0.56, 0]}>
                        <planeGeometry args={[SHEET.w * 0.5, 0.03]} />
                        <meshBasicMaterial color={active.accent} toneMapped={false} />
                    </mesh>
                    <Text
                        position={[0, SHEET.h / 2 - 0.72, 0]}
                        font={BODY_FONT}
                        fontSize={0.135}
                        color={COLORS.inkSoft}
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={SHEET.w - 0.6}
                        textAlign="center"
                    >
                        {active.subtitle}
                    </Text>

                    {skills.map((skill, i) => (
                        <SkillRow
                            key={skill.id}
                            skill={skill}
                            y={ROW_TOP - i * ROW_STEP}
                            accent={active.accent}
                            interactive={interactive}
                            onOpen={onOpenSkill}
                        />
                    ))}

                    {!printed && (
                        <Text
                            position={[SHEET.w / 2 - 0.55, SHEET.h / 2 - 0.34, 0]}
                            font={LABEL_FONT}
                            fontSize={0.16}
                            color={COLORS.highlight}
                            anchorX="center"
                            anchorY="middle"
                            rotation={[0, 0, -0.18]}
                        >
                            PROOF
                        </Text>
                    )}
                </group>
            ) : (
                <Text
                    position={[0, 0, 0.02]}
                    font={LABEL_FONT}
                    fontSize={0.2}
                    color={COLORS.inkSoft}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={SHEET.w - 0.6}
                    textAlign="center"
                >
                    Load a type form
                </Text>
            )}
        </group>
    );
};

export default Sheet;
