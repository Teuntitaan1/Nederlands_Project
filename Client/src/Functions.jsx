export function lerp( a, b, alpha ) {
    return a + alpha * ( b - a );
}

export function clamp(min, max, value) {
    return Math.min(Math.max(value, min), max)
}