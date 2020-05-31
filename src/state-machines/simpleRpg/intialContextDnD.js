export const initialContext = {
    initialStep:"backgroundCityIntro",
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
                    text:[-.5,.5,.21],
                    model: [-.5,0.,0.3],
                    counter:[-.2,-.5,.21],
                },
                enemy: {
                    text:[.5,.5,.21],
                    model: [.5,0. ,0.3],
                    counter:[.2,-.5,.21],
                },
                gameMessages:{
                    text:[0,0,0.21]
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
            title: "L0n3 M4tr1x",
            subTitle: "SPACE to get in"
        },
        steps: {
            emptyText: {
                type: "text",
                text:[],
            },

            backgroundCityIntro: {
                type: "backgroundChange",
                backGroundPrefabs: ["TETSUOCityPrefab"],
                goTo: ["text1"]
            },
            text0: {
                type: "text",
                text:[""],
                goTo: ["backgroundCity","text1"]
            },
            textApproaches: {
                type: "text",
                text:["An enemy approaches"],
            },
            text1: {
                type: "text",
                text:["Once...", "there was nothing..",""],
                goTo: ["musicFariaDemo","text2"]
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
                text:["You won the matrix","A Game POC by SOLID:","J.Faria","R.Esteves","R.Orey"]
            },
            gameOverText: {
                type: "text",
                text:["You lost the matrix","A Game POC by SOLID:\n"]
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
                assetId: "fariaDemoMP3",
                loop:"true",
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
                    {text:"Man",goTo:["backgroundNone","musicFariaDemo","backgroundWater","backgroundExplode","enemyCylinderBattle"]},
                    {text:"Machine",goTo:["battle1"]},
                    ],
            },
            option2: {
                type: "textOption",
                question:{text:["Bad data: This system is ours. Are you with or without us?\n"],questionStyle:{fill:0xdc1111}},
                options: [
                    {text:"With, of course",goTo:["backgroundNone","musicFariaDemo","backgroundWater","backgroundExplode","enemyShooterBattle"]},
                    {text:"Without. Prepare for deletion.",goTo:["emptyText","enemyHeadBattle","textApproaches","enemyCylinderBattle","textApproaches"]},
                    ],
            },
            enemyHeadBattle: {
                type:"battle",
                enemy: "enemyHead"
            },
            enemyCylinderBattle: {
                type:"battle",
                enemy: "enemyCylinder"
            },

        },
        player:{
            name: "Blue White Mouse",
            prefab: "TestCube",
            hp: 300,
            maxHp:300,
            defense:4,
            attack:0,
            // raises level, raises this ones
            maxAttack:10,
            minAttack:3
        },
        enemies:{
            enemyHead: {
                introMessage:"Rogues will face immediate deletion.",
                winMessage:"The AI has been defeated.",
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
            enemyCylinder: {
                introMessage:"Rogues will face immediate deletion.",
                winMessage:"The AI has been destroyed.",
                loseMessage:"You've been destroyed.",
                name: "Dark Mouse",
                prefab: "CylinderPrefab",
                hp: 30,
                maxHp: 30,
                defense:6,
                attack:0,
                // raises level, raises this ones
                maxAttack:8,
                minAttack:3
            },
        },
    }
}