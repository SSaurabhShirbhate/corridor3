import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * WavingAvatar
 *
 * Flat cartoon avatar rebuilt as a small two-bone rig so the wave is
 * perfectly smooth (no sprite flipbook). The silhouettes and ratios are
 * matched to the original ITOM avatar: head ≈ 25% of the height, torso
 * ≈ 40%, legs + shoes ≈ 33%, and the hand sweeps sideways at head height
 * from the temple out to the side and back.
 *
 * Textures are drawn in a normalised space where the character is 1 unit
 * tall and the body is 0.5 units wide. The arm pivots are expressed in the
 * same space, so scaling the group scales the whole character.
 */
const CYCLE = 2.8;

// Body proportions (normalised, origin at the character's centre)
const SHOULDER = [0.145, 0.15];
const L1 = 0.12; // shoulder -> elbow
const L2 = 0.1; // elbow -> wrist

// Texture planes (width, height, distance of the pivot from the top edge)
const UPPER = { w: 0.086, h: 0.204, pivot: 0.041 };
const FORE = { w: 0.08, h: 0.168, pivot: 0.038 };
const HAND = { w: 0.125, h: 0.12, margin: 0.012 };

// Hand target (wrist position) at the temple and at full extension.
const NEAR = [0.13, 0.29];
const FAR = [0.315, 0.282];

const WavingAvatar = ({
    height = 1,
    startFrame = 0,
    renderOrder = 2,
    opacity = 1,
    color = '#ffffff',
}) => {
    const [bodyMap, upperMap, foreMap, handMap] = useTexture([
        '/textures/avatar/body.webp',
        '/textures/avatar/upper_arm.webp',
        '/textures/avatar/forearm.webp',
        '/textures/avatar/hand.webp',
    ]);

    const shoulderRef = useRef();
    const elbowRef = useRef();
    const handRef = useRef();

    const phaseOffset = useMemo(
        () => (((startFrame % 9) + 9) % 9) / 9 * CYCLE,
        [startFrame]
    );

    useEffect(() => {
        [bodyMap, upperMap, foreMap, handMap].forEach((map) => {
            if (!map) return;
            map.colorSpace = THREE.SRGBColorSpace;
            map.anisotropy = 4;
            map.needsUpdate = true;
        });
    }, [bodyMap, upperMap, foreMap, handMap]);

    useFrame((state) => {
        const t = state.clock.elapsedTime + phaseOffset;
        const phase = (t % CYCLE) / CYCLE;
        // 0 at the temple, 1 at full extension, smooth at both ends.
        const sweep = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);

        const tx = NEAR[0] + (FAR[0] - NEAR[0]) * sweep;
        const ty = NEAR[1] + (FAR[1] - NEAR[1]) * sweep + 0.006 * Math.sin(Math.PI * sweep);

        // Two-bone IK: solve the shoulder and elbow angles for the wrist target.
        const dx = tx - SHOULDER[0];
        const dy = ty - SHOULDER[1];
        const dist = THREE.MathUtils.clamp(
            Math.hypot(dx, dy),
            Math.abs(L1 - L2) + 0.001,
            L1 + L2 - 0.001
        );
        const base = Math.atan2(dy, dx);
        const cosAlpha = (L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist);
        const alpha = Math.acos(THREE.MathUtils.clamp(cosAlpha, -1, 1));
        const upperAngle = base - alpha;

        const elbowX = SHOULDER[0] + L1 * Math.cos(upperAngle);
        const elbowY = SHOULDER[1] + L1 * Math.sin(upperAngle);
        const foreAngle = Math.atan2(ty - elbowY, tx - elbowX);

        const shoulderRot = upperAngle + Math.PI / 2;
        const elbowRot = foreAngle + Math.PI / 2 - shoulderRot;

        if (shoulderRef.current) shoulderRef.current.rotation.z = shoulderRot;
        if (elbowRef.current) elbowRef.current.rotation.z = elbowRot;
        if (handRef.current) {
            // Keep the palm upright while the arm sweeps, then rock the wrist.
            handRef.current.rotation.z = -(shoulderRot + elbowRot) + Math.sin(t * 2.1) * 0.1;
        }
    });

    const mat = {
        transparent: true,
        alphaTest: 0.45,
        depthWrite: false,
        opacity,
        color,
        side: THREE.DoubleSide,
    };

    return (
        <group scale={height}>
            <mesh renderOrder={renderOrder}>
                <planeGeometry args={[0.5, 1]} />
                <meshBasicMaterial map={bodyMap} {...mat} />
            </mesh>

            <group ref={shoulderRef} position={[SHOULDER[0], SHOULDER[1], 0.03]}>
                <mesh
                    position={[0, UPPER.pivot - UPPER.h / 2, 0.002]}
                    renderOrder={renderOrder + 2}
                >
                    <planeGeometry args={[UPPER.w, UPPER.h]} />
                    <meshBasicMaterial map={upperMap} {...mat} />
                </mesh>

                <group ref={elbowRef} position={[0, -L1, 0]}>
                    <mesh
                        position={[0, FORE.pivot - FORE.h / 2, 0.001]}
                        renderOrder={renderOrder + 2}
                    >
                        <planeGeometry args={[FORE.w, FORE.h]} />
                        <meshBasicMaterial map={foreMap} {...mat} />
                    </mesh>

                    <group ref={handRef} position={[0, -L2, 0.003]}>
                        <mesh
                            position={[0, HAND.h / 2 - HAND.margin, 0]}
                            renderOrder={renderOrder + 3}
                        >
                            <planeGeometry args={[HAND.w, HAND.h]} />
                            <meshBasicMaterial map={handMap} {...mat} />
                        </mesh>
                    </group>
                </group>
            </group>
        </group>
    );
};

export default WavingAvatar;
