import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * WavingAvatar
 *
 * Sprite-sheet flipbook of the 3D portfolio character waving.
 * The sheet is a 5x2 grid (10 frames); the last frame is a rest pose,
 * so the wave loops over the first 9 frames using a ping-pong motion.
 * The frames have been body-stabilised so only the hand/forearm moves.
 *
 * Each instance clones the texture so multiple avatars cannot fight
 * over the shared UV offset.
 */
const COLS = 5;
const ROWS = 2;
const WAVE_FRAMES = 9;

const WavingAvatar = ({
    texturePath = '/textures/shared/avatar_wave_v2.webp',
    height = 1,
    width,
    fps = 8,
    startFrame = 0,
    renderOrder = 0,
    opacity = 1,
    alphaTest = 0.15,
    color = '#ffffff',
    side = THREE.DoubleSide,
    depthWrite = false,
}) => {
    const source = useTexture(texturePath);
    const meshRef = useRef();
    const frame = useRef(startFrame);
    const direction = useRef(1);
    const timer = useRef(0);

    const texture = useMemo(() => {
        const clone = source.clone();
        clone.colorSpace = THREE.SRGBColorSpace;
        clone.wrapS = THREE.ClampToEdgeWrapping;
        clone.wrapT = THREE.ClampToEdgeWrapping;
        clone.generateMipmaps = false;
        clone.minFilter = THREE.LinearFilter;
        clone.magFilter = THREE.LinearFilter;
        clone.repeat.set(1 / COLS, 1 / ROWS);
        clone.needsUpdate = true;
        return clone;
    }, [source]);

    useEffect(() => () => texture.dispose(), [texture]);

    const cellAspect = useMemo(() => {
        const img = source.image;
        if (!img) return 265 / 593;
        return (img.width / COLS) / (img.height / ROWS);
    }, [source]);

    const planeWidth = width ?? height * cellAspect;

    const applyFrame = (index) => {
        const clamped = Math.max(0, Math.min(WAVE_FRAMES - 1, index));
        const col = clamped % COLS;
        const row = Math.floor(clamped / COLS);
        texture.offset.set(col / COLS, 1 - (row + 1) / ROWS);
    };

    useEffect(() => {
        applyFrame(startFrame);
        // Re-upload if StrictMode disposed the clone during its double-mount.
        texture.needsUpdate = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [texture]);

    useFrame((_, delta) => {
        const frameDuration = 1 / fps;
        // Clamp the delta so a stalled tab doesn't skip half the wave.
        timer.current += Math.min(delta, 0.1);
        if (timer.current < frameDuration) return;
        timer.current -= frameDuration;

        if (frame.current >= WAVE_FRAMES - 1) {
            direction.current = -1;
            timer.current = -frameDuration * 0.5; // brief rest at the top
        } else if (frame.current <= 0) {
            direction.current = 1;
            timer.current = -frameDuration * 0.5; // brief rest at the bottom
        }

        frame.current += direction.current;
        applyFrame(frame.current);
    });

    return (
        <mesh ref={meshRef} renderOrder={renderOrder}>
            <planeGeometry args={[planeWidth, height]} />
            <meshBasicMaterial
                color={color}
                map={texture}
                transparent
                opacity={opacity}
                side={side}
                depthWrite={depthWrite}
                alphaTest={alphaTest}
            />
        </mesh>
    );
};

export default WavingAvatar;
