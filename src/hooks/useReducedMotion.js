import { useEffect, useState } from 'react';

/**
 * useReducedMotion - tracks the `prefers-reduced-motion` media query.
 *
 * Used to disable non-essential motion (auto belt drift, dust, shakes)
 * while keeping user-driven scrubbing fully functional.
 */
export const useReducedMotion = () => {
    const [reduced, setReduced] = useState(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return undefined;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (event) => setReduced(event.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return reduced;
};

export default useReducedMotion;
