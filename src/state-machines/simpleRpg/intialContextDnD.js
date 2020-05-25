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
            text1: {
                type: "text",
                text:["Once...", "there was nothing..",""],
                goTo: ["music1","text2"]
            },
            text2: {
                type: "text",
                text:["Then...", "there was the grid.",""],
                goTo: ["backgroundMountain","music2","option1"]
            },
            winText: {
                type: "text",
                text:["You won the matrix"]
            },
            gameOverText: {
                type: "text",
                text:["You lost the matrix"]
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
            music1: {
                type: "audio",
                assetId: "fariaDemoMP3"
            },
            music2: {
                type: "audio",
                assetId: ""
            },
            music4: {
                type: "audio",
                assetId: "laserShot",
                loop:"true",
            },
            option1: {
                type: "textOption",
                text:["Who are you?"],
                options: [
                    {text:"Man",goTo:["backgroundNone","music1","backgroundWater","backgroundExplode","battle1"]},
                    {text:"Machine",goTo:["music1","backgroundExplode","battle2"]},
                    ],
            },
            battle1: {
                type:"battle",
                enemy: "whiteGreyMouse"
            },
            battle2: {
                type:"battle",
                enemy: "darkMouse"
            }

        },
        player:{
            name: "Blue White Mouse",
            prefab: "CylinderPrefab",
            hp: 300,
            maxHp:300,
            defense:3,
            attack:0,
            // raises level, raises this ones
            maxAttack:14,
            minAttack:1
        },
        enemies:{
            whiteGreyMouse: {
                name: "White Grey Mouse",
                prefab: "SpherePrefab",
                hp: 100,
                defense:2,
                attack:0,
                // raises level, raises this ones
                maxAttack:14,
                minAttack:3
            },
            darkMouse: {
                name: "Dark Mouse",
                prefab: "HeadPrefab",
                hp: 500,
                defense:6,
                attack:0,
                // raises level, raises this ones
                maxAttack:8,
                minAttack:3
            },
            blueWhiteMouse: {
                name: "Blue White Mouse",
                prefab: "ShooterPrefab",
                hp: 1000,
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
                defense:6,
                attack:0,
                // raises level, raises this ones
                maxAttack:12,
                minAttack:6
            }
        },
    }
}