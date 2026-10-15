import { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { PRESS, PLATEN, WHEEL, COLORS, LABEL_FONT } from './pressConfig';

/**
 * Press - the hand-drawn letterpress.
 *
 * The frame is a static backdrop; the platen clamps down over the poster and
 * the flywheel spins. The orchestrator calls `apiRef.current.pull()` to run a
 * print cycle; `onImpact` fires at the moment the platen hits the sheet.
 */
const Press = ({ apiRef, interactive, reducedMotion, showHint, onImpact }) => {
    const [pressTex, pressPainted, platenTex, platenPainted, wheelTex, wheelPainted] = useTexture([
        '/textures/studio/press.webp',
        '/textures/studio/press_painted.webp',
        '/textures/studio/platen.webp',
        '/textures/studio/platen_painted.webp',
        '/textures/studio/flywheel.webp',
        '/textures/studio/flywheel_painted.webp',
    ]);

    const platenRef = useRef();
    const wheelRef = useRef();
    const spin = useRef(reducedMotion ? 0 : 0.35);
    const printing = useRef(false);

    const pull = useCallback(() => {
        if (printing.current || !platenRef.current) return;
        printing.current = true;
        // spin the wheel up
        spin.current = 9;

        const tl = gsap.timeline({
            onComplete: () => {
                printing.current = false;
            },
        });

        // platen slams down
        tl.to(platenRef.current.position, {
            y: PLATEN.downY,
            duration: reducedMotion ? 0.12 : 0.24,
            ease: 'power3.in',
        });
        // squash + impact
        tl.to(
            platenRef.current.scale,
            { y: 0.93, duration: 0.06, ease: 'power2.out' },
            '-=0.02'
        );
        tl.add(() => onImpact?.());
        tl.to(platenRef.current.scale, { y: 1, duration: 0.12, ease: 'back.out(3)' });
        // lift back up
        tl.to(platenRef.current.position, {
            y: PLATEN.upY,
            duration: reducedMotion ? 0.2 : 0.55,
            ease: 'power2.out',
        });
    }, [onImpact, reducedMotion]);

    useEffect(() => {
        if (!apiRef) return undefined;
        apiRef.current = { pull, isPrinting: () => printing.current };
        return () => {
            apiRef.current = null;
        };
    }, [apiRef, pull]);

    useFrame((_, delta) => {
        // wheel idle spin, decaying from a pull
        const target = reducedMotion ? 0 : 0.35;
        spin.current = THREE.MathUtils.damp(spin.current, target, 1.6, delta);
        if (wheelRef.current) wheelRef.current.rotation.z -= spin.current * delta;
    });

    const pullHit = useCallback(
        (e) => {
            e?.stopPropagation?.();
            if (!interactive) return;
            pull();
        },
        [interactive, pull]
    );

    return (
        <group>
            {/* machine backdrop (sketch + painted pass) */}
            <mesh position={[PRESS.x, PRESS.y, PRESS.z]}>
                <planeGeometry args={[PRESS.w, PRESS.h]} />
                <meshBasicMaterial map={pressTex} transparent alphaTest={0.05} toneMapped={false} />
            </mesh>
            <mesh position={[PRESS.x, PRESS.y, PRESS.z + 0.01]}>
                <planeGeometry args={[PRESS.w, PRESS.h]} />
                <meshBasicMaterial map={pressPainted} transparent alphaTest={0.05} toneMapped={false} opacity={0.9} />
            </mesh>

            {/* flywheel */}
            <group position={[WHEEL.x, WHEEL.y, WHEEL.z]}>
                <group ref={wheelRef}>
                    <mesh>
                        <planeGeometry args={[WHEEL.r * 2, WHEEL.r * 2]} />
                        <meshBasicMaterial map={wheelTex} transparent alphaTest={0.05} toneMapped={false} />
                    </mesh>
                    <mesh position={[0, 0, 0.002]}>
                        <planeGeometry args={[WHEEL.r * 2, WHEEL.r * 2]} />
                        <meshBasicMaterial map={wheelPainted} transparent alphaTest={0.05} toneMapped={false} opacity={0.92} />
                    </mesh>
                </group>
                {/* enlarged hitbox over the wheel to pull */}
                <mesh position={[0, 0, 0.05]} onClick={pullHit}>
                    <circleGeometry args={[WHEEL.r * 1.25, 32]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>
            </group>

            {/* platen (clamps down) */}
            <group ref={platenRef} position={[PLATEN.x, PLATEN.upY, PLATEN.z]}>
                <mesh>
                    <planeGeometry args={[PLATEN.w, PLATEN.h]} />
                    <meshBasicMaterial map={platenTex} transparent alphaTest={0.05} toneMapped={false} />
                </mesh>
                <mesh position={[0, 0, 0.002]}>
                    <planeGeometry args={[PLATEN.w, PLATEN.h]} />
                    <meshBasicMaterial map={platenPainted} transparent alphaTest={0.05} toneMapped={false} opacity={0.95} />
                </mesh>
                {/* ink-filled face, faintly visible */}
                <mesh position={[0, -0.1, 0.004]}>
                    <planeGeometry args={[PLATEN.w * 0.86, PLATEN.h * 0.8]} />
                    <meshBasicMaterial color={COLORS.ink} transparent opacity={0.12} toneMapped={false} />
                </mesh>
            </group>

            {/* pull-the-wheel hint ring */}
            <mesh position={[WHEEL.x, WHEEL.y, WHEEL.z + 0.04]}>
                <ringGeometry args={[WHEEL.r * 1.06, WHEEL.r * 1.14, 48]} />
                <meshBasicMaterial color={COLORS.brass} transparent opacity={0.6} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>

            {showHint && (
                <Text
                    position={[WHEEL.x, WHEEL.y - WHEEL.r - 0.3, WHEEL.z + 0.06]}
                    font={LABEL_FONT}
                    fontSize={0.17}
                    color={COLORS.highlight}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.8}
                    textAlign="center"
                >
                    Pull to print
                </Text>
            )}
        </group>
    );
};

export default Press;
