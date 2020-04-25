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
const attackData = {
    mainAttack: {
        label: "Color Attack",
        castingCost: 0,
        type: attackTypes.colorAttack,
        animation: "mainAttackAnimation",
        targets: [targetTypes.enemies],
        all: false,
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
        defaultEntry:"start",
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
    moduleScenes
};