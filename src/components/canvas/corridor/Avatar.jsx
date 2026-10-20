import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import WavingAvatar from '../shared/WavingAvatar';

/**
 * Avatar Component - 3D portfolio character waving.
 *
 * Keeps the original behaviour:
 * - Parallax depth effect on scroll
 * - Dodges sideways when the camera gets close
 * The wave itself is the sprite-sheet flipbook in WavingAvatar
 * (ping-pong at 20 FPS, like the previous hand-drawn frames).
 */
const AVATAR_HEIGHT = 1.18;

const Avatar = ({ position = [10, -20, 30], startFrame = 0 }) => {
    const groupRef = useRef();
    const { camera } = useThree();

    const dodgeX = useRef(0);
    const targetDodgeX = useRef(0);
    const worldPosVec = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!groupRef.current) return;

        // === DODGE LOGIC ===
        groupRef.current.getWorldPosition(worldPosVec.current);
        const distance = camera.position.z - worldPosVec.current.z;

        const DODGE_START = 3;
        const DODGE_PEAK = 0;
        const DODGE_END = -2;
        const DODGE_AMOUNT = 0.45;

        if (distance > DODGE_PEAK && distance < DODGE_START) {
            const t = (DODGE_START - distance) / (DODGE_START - DODGE_PEAK);
            targetDodgeX.current = DODGE_AMOUNT * easeOutQuad(t);
        } else if (distance <= DODGE_PEAK && distance > DODGE_END) {
            const t = (distance - DODGE_END) / (DODGE_PEAK - DODGE_END);
            targetDodgeX.current = DODGE_AMOUNT * easeOutQuad(t);
        } else {
            targetDodgeX.current = 0;
        }

        dodgeX.current = THREE.MathUtils.lerp(dodgeX.current, targetDodgeX.current, 0.08);

        groupRef.current.position.x = position[0] + dodgeX.current;
        groupRef.current.position.y = position[1];
    });

    return (
        <group ref={groupRef} position={position}>
            <WavingAvatar height={AVATAR_HEIGHT} renderOrder={2} startFrame={startFrame} />
        </group>
    );
};

const easeOutQuad = (t) => t * (2 - t);

export default Avatar;
