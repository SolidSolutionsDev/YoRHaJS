const moduleTypes = {
    kernel: "kernel",
    menu: "menu",
    battle: "battle",
    field: "field",
};
const menuCommands = {
    Attack: ["mainAttack"],
    Absorb: ["mainAbsorb"],
    Defense: ["mainDefense"],
};

// ATTACKS
const attackTypes = {
    colorAttack: 0,
    colorDefense: 1,
    colorAbsorb: 2,
};
const targetTypes = {
    enemies: 0,
    party: 1,
    self: 2
};


const battleCharacterState = {
    ready: 0,
    action: 1,
    idle: 2,
    dead: 3,
    stopped:4
};


const effects = {
    colorAttack: {
        attackerPrepare: "energyCast",
        attackExecute:"energyBlast"
    },
};

const attackData = {
    mainAttack: {
        label: "Color Attack",
        castingCost: 0,
        type: attackTypes.colorAttack,
        animation: animations.mainAttackAnimation,
        targets: [targetTypes.enemies],
        all: false,
        priority: 0,
    },
    mainAbsorb: {
        label: "Color Absorb",
        castingCost: 0,
        type: attackTypes.colorAbsorb,
        // animation: animations.mainAbsorbAnimation,
        targets: [targetTypes.enemies],
        all: false,
        priority: 0,
    },
    mainDefense: {
        label: "Defend",
        castingCost: 0,
        type: attackTypes.colorDefense,
        // animation: animations.mainDefenseAnimation,
        targets: [targetTypes.self],
        all: false,
        priority: 0,
    },
};


const moduleScenes = {
    battle1: {
        type: "battle",
        enemies: ["enemy1"],
        ai: true,
    },
    menuScene1: {
        type: "menu",
        defaultEntry: "start",
        entries: [{id: "start", label: "Start", goTo: "battle1"}, {
            id: "continue",
            label: "Continue",
            goTo: "fieldScene1"
        }],
        ai: true,
    },
    fieldScene1: {
        type: "field",
        scenario: "scenario1",
        availableBattles: {
            battle1: {}
        },
        triggers: {
            entrance: {
                x: 10,
                y: 2,
                goTo: {
                    scene: "battle1"
                }
            },
            exit: {
                x: 30,
                y: 2,
                goTo: {
                    scene: "fieldScene1",
                    connection: "entrance"
                }
            },
        },
        defaultConnection: "entrance",
    }
};

export const kernelConstants = {
    menuCommands,
    attackData,
    attackTypes,
    targetTypes,
    moduleTypes,
    moduleScenes,
    effects,
    battleCharacterState
};