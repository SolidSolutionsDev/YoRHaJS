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
            directionalLight:{
                components:{},
                children:{},
            },
            pointLight:{
                components:{},
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