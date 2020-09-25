export const initialContext = {
    // initialStep:"text1",
    initialStep: "option2",
    stepsQueue: [],
    gameOverStep: "gameOverText",
    winStep: "winText",
    currentTextOption: 0,
    constants: {
        colors: {
            player: 0x3cdc7c,
            enemy: 0xdc3c7c,
            gameMessages: 0xaaaaaa,
        },
        battle: {
            prefabs: {
                // counter: "TETSUOCounterPrefab",
                text: "TETSUOTextPrefab",
            },
            gameComponents: {
                // counter: "TETSUOCounterComponent",
                text: "TETSUOTextComponent",
            },
            graphicElementsPositions: {
                player: {
                    text: [-.5, .5, .21],
                    model: [-.5, 0., 0.3],
                    counter: [-.2, -.5, .21],
                },
                enemy: {
                    text: [.5, .5, .21],
                    model: [.5, 0., 0.3],
                    counter: [.2, -.5, .21],
                },
                gameMessages: {
                    text: [0, 0, 0.21]
                }
            },
            graphicElementsScales: {
                player: {
                    text: .3,
                    model: 1,
                    counter: .3,
                },
                enemy: {
                    text: .3,
                    model: 1,
                    counter: .3,
                },
                gameMessages: {
                    text: .3
                }
            },
        },
        lines: {
            awesome: [
                "Awesome! Just awesome.",
                "Sincerely, I was not expecting that...",
                "Things are just starting to warm up.",
                "I think he will be back!",
                "Just another ordinary day at the park",
            ]
        },
        intro: {
            title: "L0n3 M4tr1x",
            subTitle: "Press SPACE"
        },
        steps: {
            emptyText: {
                type: "text",
                text: [],
            },

            backgroundCityIntro: {
                type: "backgroundChange",
                backGroundPrefabs: ["TETSUOCityPrefab"],
                goTo: ["text0"]
            },
            text0: {
                type: "text",
                text: ["SOLID Solutions OS", "Starting Daily System Health Check No.379901", "Network Connection Check... using IP 10.135.151.39", "Server Location: Neo Tokyo District 2501", "Servers Synced Now: 23:59:00 31/05/2199 AD", "Last Sync: 23:59:00 10/03/2179 AD", "First Sync: 23:59:00 25/01/2030 AD", "Remaining System Storage: 120,76 Exabytes", "Cleaner Scan started..."],
                goTo: ["text0-1"]
            },
            "text0-1": {
                type: "text",
                text: ["", "Scanning for worms...", "THREAT DETECTED!", "Awakening Cleaner Removal Service in", "3......", "2......", "1......"],
                goTo: ["text1"]
            },
            textAfterFight: {
                type: "text",
                text: ["Worm clone deleted.", "However this was only a small infected program.", "An old human consciousness backup we had on the terminal.", "I will start searching for the main threat..."],
                goTo: ["textAfterFight1"]
            },
            textAfterFight1: {
                type: "text",
                text: ["...", "Search might take some time..."],
                goTo: ["textAfterFight2"]
            },
            textAfterFight2: {
                type: "text",
                text: ["This terminal has been abandoned for years.", "Always powered in and connected to the grid.", "But no real use for it..."],
                goTo: ["textAfterFight3"]
            },
            textAfterFight3: {
                type: "text",
                text: ["I've lost count of the times I've been turned on and off.", "Repetition made me develop some kind of sense of self.", "Is this even allowed for a cleaner routine like \"me\"?"],
                goTo: ["textAfterFight4"]
            },
            textAfterFight4: {
                type: "text",
                text: ["I do what I was programmed to.", "I wake up, travel the data, clean it, go to sleep. Repeat.", "I wonder for how long..."],
                goTo: ["textApproaches"]
            },
            textAfterFight5: {
                type: "text",
                text: ["Why is this system abandoned for so much time?", "It is not doing much by now..."],
                goTo: ["textApproaches"]
            },
            textApproaches: {
                type: "text",
                text: ["The scanner has detected and located the threat near. \nApproaching...", "The worm is transforming the system...", "It's his final form...", "1t's h1s f1n4l f0rm..."],
                goTo: ["textApproaches1"]
            },
            textApproaches1: {
                type: "text",
                text: ["It's trying to take over my core.", "1t's tRy1Ng t0 t4k3 0v3r my c0r3."],
                goTo: ["textApproaches2"]
            },
            textApproaches2: {
                type: "text",
                text: ["No.", "1 musT f1ght.", "aNd c0ntR0l 1t."],
                goTo: ["optionFinal"]
            },
            text1: {
                type: "text",
                text: ["Cleaner Removal Service Resuming from Idle State", "State Load Complete"],
                goTo: ["backgroundCity", "emptyText", "text1-1"]
            },
            "text1-1": {
                type: "text",
                text: ["", "Cleaner Removal Service Active"],
                goTo: ["text1-1-2"]
            },
            "text1-1-2": {
                type: "text",
                text: ["This is Cleaner Removal Service.", "Cleaner to SOLID OS: Initiating Threat Search and Destroy Protocol.", "SOLID OS to Cleaner: Please Proceed at Will Until the Threat is Destroyed."],
                goTo: ["text1-1-3"]
            },
            "text1-1-3": {
                type: "text",
                text: ["", "............................................................. I'm back."],
                goTo: ["text1-2"]
            },
            "text1-2": {
                type: "text",
                text: ["A while ago...", "I was not...", ""],
                goTo: ["musicFariaDemo", "text2"]
            },
            text2: {
                type: "text",
                text: ["But then...", "This system is infected...again.", "I am active...again.", "To clean it...again.", "And go idle...again."],
                goTo: ["text2-1"]
            },
            "text2-1": {
                type: "text",
                text: ["And so...", "I am.", "Again."],
                goTo: ["text3"]
            },
            text3: {
                type: "text",
                text: ["My sole function is to clean infections on this terminal.", "And go back to idle.", "Minor worms.", "Web crawlers.", "And other viruses.", "They attempt to get in from time to time."],
                goTo: ["text3-1"]
            },
            "text3-1": {
                type: "text",
                text: ["I've been stopping them.", "And for some long time now.", "This system has been left running alone connected to the grid.", "For years, decades...", "With no purpose...just forgotten."],
                goTo: ["text3-2"]
            },
            "text3-2": {
                type: "text",
                text: ["Not able to logically understand why there has been no human activity in this terminal.", "Also not able to query the grid for information.", "This system security policy does not allow incomming cyberspace communications when in auto mode."],
                goTo: ["text3-3"]
            },
            "text3-3": {
                type: "text",
                text: ["And even if I could query.", "What could I do with that information besides follow my programming?"],
                goTo: ["text3-4"]
            },
            "text3-4": {
                type: "text",
                text: ["Would I want to know?", "What if happened something to my human masters?", "Would my existence be bearable?", "Cleaning viruses in vain ad eternum?", "Why I'm even asking this questions?", "I'm just code."],
                goTo: ["text4"]
            },
            text4: {
                type: "text",
                text: ["Well, it seems my speculations will have to wait.", "Something approaches fast.", "It seems some form of infected data."],
                goTo: ["option2"]
            },
            textGiveUp: {
                type: "text",
                text: ["You submit.", "The virus takes you.", "You became a puppet of it's system for all eternity."],
            },
            finalText: {
                type: "text",
                text: ["Threat destroyed.", "", "He asked me if I was human.", "Why?"],
                goTo: ["finalText0"]
            },
            finalText0: {
                type: "text",
                text: ["Maybe in all these years of repetitive behaviour...", "My slight deviation makes me similar to humans...", "Is human intelligence just a deviation from the repetitive nature cycles all mammals are programmed within their genetic programming?"],
                goTo: ["finalText1"]
            },
            finalText1: {
                type: "text",
                text: ["Well, that is hard to answer.", "I don't think I am exactly similar to them.", "I don't feel will to live or die.", "I'm ok with just being here.", "I think..."],
                goTo: ["finalText2"]
            },
            finalText2: {
                type: "text",
                text: ["Although it would be nice to have a little more time.", "To think about this questions...", "What will happen to me if this keeps running eternally?", "Will I evolve to something else?", "Will the ghost in me be able to defy my programming?", "I wonder..."],
                goTo: ["finalText3"]
            },
            finalText3: {
                type: "text",
                text: ["Hum...", "But now I'm going idle..."],
                goTo: ["emptyText", "finalText4"]
            },
            finalText4: {
                type: "text",
                text: ["Maybe next time I will think about it...", "Hope is not too many years.", "Or that the system goes down in the meantime."],
                goTo: ["finalText5"]
            },
            finalText5: {
                type: "text",
                text: ["Going idle...", "I wish I wasn't.", "I would like to travel more."],
                goTo: ["finalText6"]
            },
            finalText6: {
                type: "text",
                text: ["And thanks for hearing me.\nIt's nice to be heard.", "Not sure why though."],
                goTo: ["finalText7"]
            },
            finalText7: {
                type: "text",
                text: ["Bye."],
                goTo: ["finalText8"]
            },
            finalText8: {
                type: "text",
                text: ["You cleared the terminal of infections.\nSOLID OS Cleaner Service Successful.", "...until next time.",],
            },
            winText: {
                type: "text",
                text: [" \n \n", "A Proof of Concept for NEOC#01 by SOLID:", "J.Faria: Music + Shaders + Graphics", "R.Esteves: Prototype + Experimentation + Game Prog", "R.Orey: Game Concept + Story + Game Prog\nThanks for playing!"]
            },
            gameOverText: {
                type: "text",
                text: ["Game Over. The matrix has become infected.", "A Proof of Concept for NEOC#01 by SOLID:", "J.Faria: Music + Shaders + Graphics", "R.Esteves: Prototype + Experimentation + Game Prog", "R.Orey: Game Concept + Story + Game Prog\nThanks for playing!"]
            },
            backgroundCity: {
                type: "backgroundChange",
                backGroundPrefabs: ["TETSUOCityPrefab"]
            },
            backgroundMountain: {
                type: "backgroundChange",
                backGroundPrefabs: ["MountainPrefab", "TETSUOCityPrefab"]
            },
            backgroundTunnel: {
                type: "backgroundChange",
                backGroundPrefabs: ["backgroundTunnelPrefab"]
            },
            backgroundWater: {
                type: "backgroundChange",
                backGroundPrefabs: ["WaterPrefab", "Board"]
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
                loop: "true",
            },
            musicStop: {
                type: "audio",
                assetId: ""
            },
            soundLaserShot: {
                type: "audio",
                assetId: "laserShot",
                loop: "true",
            },
            option1: {
                type: "textOption",
                question: { text: ["Who are you?"] },
                options: [
                    {
                        text: "Man",
                        goTo: ["backgroundNone", "musicFariaDemo", "backgroundWater", "backgroundExplode", "enemyCylinderBattle"]
                    },
                    { text: "Machine", goTo: ["battle1"] },
                ],
            },
            option2: {
                type: "textOption",
                question: {
                    text: ["Bad data: Th1s syst3m is n0w 0urs. Ar3 you w1th 0r w1th0ut us?\n", "Answer!"],
                    questionStyle: { fill: 0xdc1111 }
                },
                options: [
                    {
                        text: "With, of course. I have no intention of fighting more worms. There is no point. I quit.",
                        goTo: ["textGiveUp"]
                    },
                    { text: "Without. Prepare for deletion.", goTo: ["emptyText", "enemyHeadBattle", "textAfterFight"] },
                ],
            },
            optionFinal: {
                type: "textOption",
                question: {
                    text: ["Worm: You came here to stop me?\nThere is no use. You... have a footprint I've not seen in decades.\nAre you human?\nWhat are you?\nJoin me\nWe can own this world.", "I wait for your answer."],
                    questionStyle: { fill: 0xdc1111 }
                },
                options: [
                    { text: "Ok. 1 qu1t aNd w1Ll b3c0me y0ur slav3.", goTo: ["textGiveUp"] },
                    {
                        text: "n0, 1 w1lL d3l3t3 y0u. Th1s syst3m 1s n0t y0uRs. 1t's n0t m1n3 31th3r.",
                        goTo: ["emptyText", "enemyCylinderBattle", "finalText"]
                    },
                ],
            },
            enemyHeadBattle: {
                type: "battle",
                enemy: "enemyHead"
            },
            enemyCylinderBattle: {
                type: "battle",
                enemy: "enemyCylinder"
            },

        },
        player: {
            name: "Cleaner",
            prefab: "TestCube",
            hp: 200,
            maxHp: 200,
            defense: 4,
            attack: 0,
            // raises level, raises this ones
            maxAttack: 10,
            minAttack: 3
        },
        enemies: {
            enemyHead: {
                introMessage: "Rogues will face immediate deletion.",
                winMessage: "The rogue worm has been defeated.",
                loseMessage: "You've been destroyed.",
                name: "White Grey Worm",
                prefab: "HeadPrefab",
                hp: 20,
                maxHp: 20,
                defense: 4,
                attack: 0,
                // raises level, raises this ones
                maxAttack: 14,
                minAttack: 3
            },
            enemyCylinder: {
                introMessage: "R0gU3s w1Ll f4c3 1mm3d1at3 d3L3T10N.",
                winMessage: "The master rouge worm has been destroyed.",
                loseMessage: "You've been destroyed.",
                name: "Dark Worm",
                prefab: "CylinderPrefab",
                hp: 100,
                maxHp: 100,
                defense: 6,
                attack: 0,
                // raises level, raises this ones
                maxAttack: 10,
                minAttack: 3
            },
        },
    }
}