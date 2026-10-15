// ============================================
// THE STUDIO — "The Letterpress" layout & tuning
// ============================================
// A hand-drawn letterpress print shop. Each skill *category* is a movable type
// form. You load a form into the press, pull the flywheel, and the platen clamps
// down — inking a fresh poster that lists that category's skills. Printed
// posters stack up as your skillset.
//
// Coordinates are local to the Studio room group (mounted at
// [0, -0.5, -corridorDepth]); the camera rests near (0, 1.25, -1.9) looking -Z.

export const COLORS = {
    ink: '#26221e',
    inkSoft: '#4a443c',
    paper: '#f7f0e0',
    paperEdge: '#e0d4ba',
    wall: '#efe4cf',
    floor: '#e7dcc4',
    wood: '#c49e6c',
    iron: '#606870',
    brass: '#c9a253',
    highlight: '#3f6db4',
};

// The machine backdrop.
export const PRESS = {
    x: 0.5,
    y: 1.9,
    z: -7.2,
    w: 5.6,
    h: 6.7,
    openingY: 0.1, // local centre of the bed opening
};

// The readable poster that floats in front of the press.
export const SHEET = {
    x: 0.2,
    y: 2.2,
    z: -5.5,
    w: 4.0,
    h: 2.2,
};

// The platen (clamps down over the sheet).
export const PLATEN = {
    x: 0.2,
    upY: 5.2,
    downY: 2.2,
    z: -5.42,
    w: 4.5,
    h: 2.6,
};

// The flywheel on the right (pull to print).
export const WHEEL = {
    x: 2.5,
    y: 1.75,
    z: -5.9,
    r: 0.9,
};

// The type case: the row of category forms along the bottom.
export const TYPE_CASE = {
    y: 0.55,
    z: -4.5,
    tileW: 0.82,
    tileH: 0.54,
    span: 3.5, // horizontal spread of the tiles
};

// The stack of finished posters on a sample board (left, above the case).
export const STACK = {
    x: -2.75,
    y: 1.7,
    z: -5.55,
    w: 0.88,
    h: 1.18,
    step: 0.03,
};

// Room shell.
export const SHELL = {
    wall: COLORS.wall,
    wallZ: -8.7,
    wallW: 34,
    wallH: 16,
    wallY: 3.2,
    floorY: 0,
    sideX: 8.5,
};

// Textures.
export const TEXTURES = {
    press: '/textures/studio/press.webp',
    pressPainted: '/textures/studio/press_painted.webp',
    platen: '/textures/studio/platen.webp',
    platenPainted: '/textures/studio/platen_painted.webp',
    wheel: '/textures/studio/flywheel.webp',
    wheelPainted: '/textures/studio/flywheel_painted.webp',
    form: '/textures/studio/type_form.webp',
    formPainted: '/textures/studio/type_form_painted.webp',
    sheet: '/textures/studio/sheet.webp',
    ink: '/textures/studio/ink_pot.webp',
    inkPainted: '/textures/studio/ink_pot_painted.webp',
    dust: '/textures/studio/dust.webp',
};

export const LABEL_FONT = '/fonts/CabinSketch-Bold.ttf';
export const BODY_FONT = '/fonts/CabinSketch-Regular.ttf';

// Small UI tuning.
export const LEVELS = { max: 5 };
