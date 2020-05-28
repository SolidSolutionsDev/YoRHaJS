export const initialContext = {
    initialStep:"text1",
    stepsQueue:[],
    gameOverStep:"gameOverText",
    winStep:"winText",
    currentTextOption:0,
    constants: {
        colors:{
            player:0x3cdc7c,
            enemy:0xdc3c7c,
            gameMessages:0xaaaaaa,
        },
        battle:{
            prefabs:{
                counter: "TETSUOCounterPrefab",
                text: "TETSUOTextPrefab",
            },
            gameComponents:{
                counter: "TETSUOCounterComponent",
                text: "TETSUOTextComponent",
            },
            graphicElementsPositions: {
                player: {
                    text:[-.5,.5,0.00],
                    model: [-.5,0.,0.5],
                    counter:[-.2,-.5,0.00],
                },
                enemy: {
                    text:[.5,.5,0.00],
                    model: [.5,0. ,0.5],
                    counter:[.2,-.5,0.00],
                },
                gameMessages:{
                    text:[0,0,0]
                }
            },
            graphicElementsScales: {
                player: {
                    text:.3,
                    model: 1,
                    counter:.3,
                },
                enemy: {
                    text:.3,
                    model: 1,
                    counter:.3,
                },
                gameMessages:{
                    text:.3
                }
            },
            },
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
            defense:4,
            attack:0,
            // raises level, raises this ones
            maxAttack:6,
            minAttack:0
        },
        enemies:{
            whiteGreyMouse: {
                introMessage:"Rogues will face immediate deletion.",
                winMessage:"The AI has been zeroed. Die Motherfucker.",
                loseMessage:"You've been destroyed.",
                name: "White Grey Mouse",
                prefab: "HeadPrefab",
                hp: 20,
                maxHp: 20,
                defense:4,
                attack:0,
                // raises level, raises this ones
                maxAttack:14,
                minAttack:3
            },
            darkMouse: {
                introMessage:"Rogues will face immediate deletion.",
                winMessage:"The AI has been zeroed. Die Motherfucker.",
                loseMessage:"You've been destroyed.",
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
                introMessage:"Rogues will face immediate deletion.",
                winMessage:"The AI has been zeroed. Die Motherfucker.",
                loseMessage:"You've been destroyed.",
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
                introMessage:"Rogues will face immediate deletion.",
                winMessage:"The AI has been zeroed. Die Motherfucker.",
                loseMessage:"You've been destroyed.",
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