export const awesomeLines = [
  "Awesome! Just awesome.",
  "Sincerely, I was not expecting that...",
  "Things are just starting to warm up.",
  "I think he will be back!",
  "Just another ordinary day at the park",
];

export const sphereOptions = {
  colors: [
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
    { r: 255, g: 255, b: 25 },
  ],
  startingSize: 0.2,
};

export const pokeList = [
  {
    name: "Blue White Mouse",
    frontAsset: "../../images/solid1_front_nb_s.gif",
    backAsset: "../../images/solid1_back_nb_s.gif",
    initColor: {
      r: 200,
      g: 200,
      b: 40,
    },
    attacks: [
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 0, b: 255 },
        dialog: " hmmm hmmm hmmm",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 0, g: 255, b: 255 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 255, b: 0 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: "Focus",
        type: "recharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " is feeling a surge of color!",
      },
      {
        label: "Release",
        type: "discharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " realeases every color on the enemy!",
      },
    ],
  },
  {
    name: "White Grey Mouse",
    frontAsset: "../../images/solid1_front_nb_s.gif",
    backAsset: "../../images/solid1_back_nb_s.gif",
    initColor: {
      r: 200,
      g: 200,
      b: 40,
    },
    attacks: [
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 0, b: 255 },
        dialog: " hmmm hmmm hmmm",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 0, g: 255, b: 255 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 255, b: 0 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: "Focus",
        type: "recharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " is feeling a surge of color!",
      },
      {
        label: "Release",
        type: "discharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " realeases every color on the enemy!",
      },
    ],
  },
];

export const playerStats = [
  {
    name: "Blue White Mouse",
    isBot: false,
    initColor: {
      r: 200,
      g: 200,
      b: 40,
    },
    position: {
      x: -3,
      y: -2,
      z: 25,
    },
    rotation: {
      x: 0.1,
      y: -0.4,
      z: 0.4,
    },
    attacks: [
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 0, b: 255 },
        dialog: " hmmm hmmm hmmm",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 0, g: 255, b: 255 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 255, b: 0 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: "Focus",
        type: "recharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " is feeling a surge of color!",
      },
      {
        label: "Release",
        type: "discharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " realeases every color on the enemy!",
      },
    ],
  },
  {
    name: "BEAUTIFUL CUBE",
    isBot: true,
    initColor: {
      r: 40,
      g: 200,
      b: 40,
    },
    position: {
      x: 6,
      y: 6,
      z: 10,
    },
    rotation: {
      x: 0.3,
      y: -0.4,
      z: 0.3,
    },
    attacks: [
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 0, b: 255 },
        dialog: " hmmm hmmm hmmm",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 0, g: 255, b: 255 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: ".",
        type: "absorb",
        damage: { r: 255, g: 255, b: 0 },
        dialog: " 'bytes' the enemy!",
      },
      {
        label: "Focus",
        type: "recharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " is feeling a surge of color!",
      },
      {
        label: "Release",
        type: "discharge",
        damage: { r: 0, g: 0, b: 0 },
        dialog: " realeases every color on the enemy!",
      },
    ],
  },
];
