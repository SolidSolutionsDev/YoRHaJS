const moduleTypes = {
    kernel: "kernel",
    menu: "menu",
    battle: "battle",
    field: "field",
};

const battleModuleConstituentTypes = {
    ui: "ui",
    scenario: "scenario",
    party: "party",
};

const battleUIConstituentTypes = {
    overview: "overview",
    playerControls: "playerControls",
};

const menuCommands = {
    Attack: ["mainAttack"],
    Absorb: ["mainAbsorb"],
    Defense: ["mainDefense"],
};


const battleCharacterState = {
    ready: 0,
    action: 1,
    idle: 2,
    dead: 3,
    stopped: 4
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

const players = {
    esteves: {
        prefab: "player1",
        defaultName: "Esteves",
        maxHp: 1001,
        hp: 200,
        level: 2,
        exp: 22322,
        magic: 101,
        maxMagic: 200,
        time: .5,
        defaultSpeed: 0.4,
        speed: 0.2,
        currentStatus: battleCharacterState.ready,
    },
    faria: {
        prefab: "player2",
        defaultName: "Faria",
        maxHp: 1002,
        hp: 50,
        level: 3,
        exp: 22322,
        magic: 101,
        maxMagic: 200,
        time: .5,
        defaultSpeed: 0.4,
        speed: 0.2,
        currentStatus: battleCharacterState.ready,


    },
    orey: {
        prefab: "player3",
        defaultName: "Orey",
        maxHp: 1003,
        hp: 25,
        level: 4,
        exp: 22322,
        status: ["poison"],
        magic: 101,
        maxMagic: 200,
        time: .5,
        defaultSpeed: 0.4,
        speed: 0.2,
        currentStatus: battleCharacterState.dead,
    }
};

const party = ["esteves", "faria", "dorey"];

const enemies = {
    carlos: {
        prefab: "carlos",
        defaultName: "Carlos",
        maxHp: 100,
        hp: 200,
        level: 1,

        exp: 22322,
        magic: 101,
        maxMagic: 200,
        time: .5,
        defaultSpeed: 0.4,
        speed: 0.2,
        currentStatus: battleCharacterState.ready,
    },
    sousa: {
        prefab: "enemy2",
        defaultName: "Sousa",
        maxHp: 1002,
        hp: 50,
        level: 3,

        exp: 22322,
        magic: 101,
        maxMagic: 200,
        time: .5,
        defaultSpeed: 0.4,
        speed: 0.2,
        currentStatus: battleCharacterState.ready,
    },
    neves: {
        prefab: "enemy3",
        defaultName: "Neves",
        maxHp: 1003,
        hp: 25,
        level: 4,

        exp: 22322,
        magic: 101,
        maxMagic: 200,
        time: .5,
        defaultSpeed: 0.4,
        speed: 0.2,
        currentStatus: battleCharacterState.ready,
    }
};

const enemiesParties = {
    enemyParty1: ["carlos", "enemy1"],
    enemyParty2: ["carlos", "enemy2", "enemy3"],
};

const sounds = {
    menuMoveSoundId: "menuMove",
    menuSelectSoundId: "menuSelect",
};


const animations = {
    mainAttackAnimation: (attackerComponent, targetComponent, camera, animationService) => {
        const _playerFront = attackerComponent.props.transform.position.clone();
        _playerFront.x += 10;
        _playerFront.y += 10;
        _playerFront.z += 10;
        animationService.travelTo(camera, _playerFront, 2000, {
            target: _playerFront.position,
            autoStart: false,
            onStart: attackerComponent.startAttack
        });
    },
};

const effects = {
    colorAttack: {
        attackerPrepare: "energyCast",
        attackExecute: "energyBlast"
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
        enemiesParty: ["enemyParty1"],
        ai: true,
    },
    menuScene1: {
        type: "menu",
        defaultEntry: "start",
        entries: [
            {
                id: "start",
                label: "Start",
                goTo: "battle1"
            },
            {
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
    animations,
    effects,
    battleCharacterState,
    players,
    party,
    enemies,
    enemiesParties,
    sounds,
    battleModuleConstituentTypes,
    battleUIConstituentTypes,
};

//todo:
//storyPoints - points of the story passed
//events - events to trigger - animations, damage,etc