const initialState = {
    game: {
        settings: {
            speed: 1,
            current_level: 0
        },
        levels: {
            byId: {
                'zero': {
                    walls: {},
                    groups: {}
                },
            },
            allIds: ['zero']
        },
    },
    //TODO: migrate this to json or static js
    engine: {
        prefabs:{
            inputManager:{
                components:{
                    gameInputDispatcher:{}
                },
                children:{},
            },
            camera: {
                components: {
                    perspectiveCamera:{
                        fov: 45,
                        near: 0.1,
                        far: 10000,
                        position:{x:0,y: -55,z: 35},
                        lookAt:{x:0,y: 0,z: 0},
                    },
                    dynamicCameraManager:{
                        cameraSoundPath: "./assets/sound/camera_change.mp3",
                    },
                },
                children: {
                },
            },
            audio: {
                components: {

                },
                children: {
                },
            },
            gameManager:{
                components:{},
                children:{},
            },
            grid:{
                components:{},
                children:{},
            },
            pointLight:{
                components:{
                    pointLight:{
                        color: 0xffffff,
                        distance:1,
                        decay:100,
                        position: {x:10, y:7, z:5},
                        castShadow:true,
                        shadow:{
                            mapSize:{x:1024, y:1024}
                        }
                    }
                },
                children:{},
            },
            directionalLight:{
                components:{
                    directionalLight: {
                        color: 0xffffff,
                        intensity:0.7,
                        position: {
                            x:0,
                            y:0,
                            z:1,
                        }
                    }
                },
                children:{},
            },
            ambientLight:{
                components:{
                    ambientLight:{
                        color: 0x222222,
                        intensity:1,
                    },
                },
                children:{},
            },
            board: {
                components: {
                    planeGeometry:{},
                    boardManager:{},
                },
                children: {
                },
            },
            shooter: {
                components: {
                    shooterManager:{},
                    shooterGeometry:{},
                    shooterControls:{},
                },
                children: {
                },
            },

        },
    }
}