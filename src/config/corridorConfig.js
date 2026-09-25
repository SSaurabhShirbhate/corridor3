/**
 * Shared corridor geometry configuration.
 *
 * Single source of truth for the infinite-corridor layout so that
 * CorridorSegment, DoorSection, CorridorWalls, InfiniteCorridorManager
 * and related components never drift out of sync.
 */

// Length of one repeatable corridor chunk (units along Z)
export const SEGMENT_LENGTH = 80;

// Z position where segment 0 starts (camera begins at Z=28, ends at Z=8)
export const START_Z = 10;

// Sawtooth wall geometry
// Outer wall x-distance from corridor center
export const WALL_X_OUTER = 3.5;
// Inner wall x-distance from corridor center (door recess)
export const WALL_X_INNER = 1.7;
// Z-depth of the angled door wall (projection onto corridor axis)
export const DOOR_Z_SPAN = 4;
// Total corridor height
export const CORRIDOR_HEIGHT = 3.5;

// Angle of the wall relative to the corridor axis
export const WALL_ANGLE = Math.atan2(WALL_X_OUTER - WALL_X_INNER, DOOR_Z_SPAN);

// Door wall segment derived constants
export const WALL_DX = WALL_X_OUTER - WALL_X_INNER;
export const WALL_DZ = DOOR_Z_SPAN;
export const WALL_LENGTH = Math.sqrt(WALL_DX * WALL_DX + WALL_DZ * WALL_DZ);
export const BASE_WALL_ANGLE = Math.atan2(WALL_DX, WALL_DZ);

// Door positions within each segment (relative to segment start Z).
// Left and right alternate to repeat Origins/Gallery -> Foundry/Studio ->
// The Pipeline/About -> Engine Room/Contact for every segment.
export const DOOR_OFFSETS = [
    { roomId: 'gallery', relativeZ: -18, side: 'left' },
    { roomId: 'studio', relativeZ: -32, side: 'right' },
    { roomId: 'about', relativeZ: -48, side: 'left' },
    { roomId: 'contact', relativeZ: -62, side: 'right' },
];

// Segment-relative door Z positions used by the room-entry camera
// (start Z + relativeZ + door offset of 2)
export const DOOR_POSITIONS_Z = {
    gallery: START_Z + DOOR_OFFSETS[0].relativeZ + 2,
    studio: START_Z + DOOR_OFFSETS[1].relativeZ + 2,
    about: START_Z + DOOR_OFFSETS[2].relativeZ + 2,
    contact: START_Z + DOOR_OFFSETS[3].relativeZ + 2,
};
