export const initialContext = {
    initialStep:"text1",
    stepsQueue:[],
    gameOverStep:"gameOverText",
    winStep:"winText",
    currentTextOption:0,
    constants: {
        lines:{
            awesome: [
                "Awesome! Just awesome.",
                "Sincerely, I was not expecting that...",
                "Things are just starting to warm up.",
                "I think he will be back!",
                "Just another ordinary day at the park",
            ]
        },
        intro:{
            title: "Wire",
            subTitle: "SPACE to get in"
        },
        steps: {
            emptyText: {
                type: "text",
                text:[],
            },
            text1: {
                type: "text",
                text:["Once...", "there was nothing..",""],
                goTo: ["musicFariaDemo","backgroundCity","text2"]
            },
            text2: {
                type: "text",
                text:["Then...", "there was the grid.",""],
                goTo: ["text3"]
            },
            text3: {
                type: "text",
                text:["Something approaches.", "It seems some form of bad data."],
                goTo: ["option2"]
            },
            winText: {
                type: "text",
                text:["You won the matrix"]
            },
            gameOverText: {
                type: "text",
                text:["You lost the matrix"]
            },
            backgroundCity: {
                type: "backgroundChange",
                backGroundPrefabs: ["TETSUOCityPrefab"]
            },
            backgroundMountain: {
                type: "backgroundChange",
                backGroundPrefabs: ["MountainPrefab","TETSUOCityPrefab"]
            },
            backgroundTunnel: {
                type: "backgroundChange",
                backGroundPrefabs: ["backgroundTunnelPrefab"]
            },
            backgroundWater: {
                type: "backgroundChange",
                backGroundPrefabs: ["WaterPrefab","Board"]
            },
            backgroundExplode: {
                type: "backgroundChange",
                backGroundPrefabs: ["ExplodeShaderPlanePrefab"]
            },
            backgroundNone: {
                type: "backgroundChange",
                backGroundPrefabs: []
            },
            musicFariaDemo: {
                type: "audio",
                assetId: "fariaDemoMP3"
            },
            musicStop: {
                type: "audio",
                assetId: ""
            },
            soundLaserShot: {
                type: "audio",
                assetId: "laserShot",
                loop:"true",
            },
            option1: {
                type: "textOption",
                question:{text:["Who are you?"]},
                options: [
                    {text:"Man",goTo:["backgroundNone","musicFariaDemo","backgroundWater","backgroundExplode","battle1"]},
                    {text:"Machine",goTo:["battle1"]},
                    ],
            },
            option2: {
                type: "textOption",
                question:{text:["Bad data: This system is ours. Are you with or without us?"],questionStyle:{fill:0xdc3c7c}},
                options: [
                    {text:"With, of course",goTo:["backgroundNone","musicFariaDemo","backgroundWater","backgroundExplode","battle1"]},
                    {text:"Without. Prepare for deletion.",goTo:["emptyText","battle1","option1"]},
                    ],
            },
            battle1: {
                type:"battle",
                enemy: "whiteGreyMouse"
            },
            battle2: {
                type:"battle",
                enemy: "blueWhiteMouse"
            }

        },
        player:{
            name: "Blue White Mouse",
            prefab: "TestCube",
            hp: 300,
            maxHp:300,
            defense:3,
            attack:0,
            // raises level, raises this ones
            maxAttack:14,
            minAttack:3
        },
        enemies:{
            whiteGreyMouse: {
                name: "White Grey Mouse",
                prefab: "HeadPrefab",
                hp: 20,
                maxHp: 100,
                defense:2,
                attack:0,
                // raises level, raises this ones
                maxAttack:14,
                minAttack:3
            },
            darkMouse: {
                name: "Dark Mouse",
                prefab: "CylinderPrefab",
                hp: 500,
                maxHp: 500,
                defense:6,
                attack:0,
                // raises level, raises this ones
                maxAttack:8,
                minAttack:3
            },
            blueWhiteMouse: {
                name: "Blue White Mouse",
                prefab: "SephirothPrefab",
                hp: 1000,
                maxHp: 1000,
                defense:6,
                attack:0,
                // raises level, raises this ones
                maxAttack:12,
                minAttack:6
            },
            beautifulCube: {
                name: "BEAUTIFUL CUBE",
                prefab: "ShooterPrefab",
                hp: 1200,
                maxHp: 1200,
                defense:6,
                attack:0,
                // raises level, raises this ones
                maxAttack:12,
                minAttack:6
            }
        },
    }
}