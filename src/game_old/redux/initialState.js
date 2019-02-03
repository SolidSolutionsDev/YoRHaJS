export const initialState = {
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
        renderer: {
            alpha: true,
            antialias: true
        },
        scene:{
            gameObjects: {
                byId: {
                    // Camera: {
                    //     id:"Camera",
                    //     transform:{
                    //     },
                    //     fromPrefab: "dynamicCamera",
                    //     components: {
                    //         perspectiveCamera:{
                    //             fov: 45,
                    //             near: 0.1,
                    //             far: 10000,
                    //             position:{x:0,y: -55,z: 35},
                    //             lookAt:{x:0,y: 0,z: 0},
                    //         },
                    //     },
                    //     children: [],
                    // },
                    KubeGameObject: {
                        id:"KubeGameObject",
                        transform:{
                        },
                        components: {
                            cube:{
                                rotationX:0.01,
                            },
                        },
                        children: [],
                    },
                    DirectionalLight: {
                        id:"DirectionalLight",
                        transform:{
                        },
                        components:{
                            // directionalLight: {
                            //     color: 0xffffff,
                            //     intensity:0.7,
                            //     position: {
                            //         x:0,
                            //         y:0,
                            //         z:1,
                            //     }
                            // }
                        },
                        children: [],
                    },
                },
                allIds: [
                    // "Camera",
                    // "DirectionalLight",
                    "KubeGameObject"
                ],
            }
        }
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
            dynamicCamera: {
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
                        cameraAngle: "isometric",
                        cameraAutoRotate: false,
                        cameraMinDistance: 10,
                        cameraPanLock: true,
                        unspecified_supportedCameraAngles: [
                            "",
                            "left",
                            "right",
                            "front",
                            "back",
                            "top",
                            "bottom",
                            "isometric",
                        ],
                        cameraAllowedPositions: {
                            left: {
                                position: {x: -10, y: 0, z: 0},
                            },
                            right: {
                                position: {x: 10, y: 0, z: 0},
                            },
                            front: {
                                position: {x: 0, y: 0, z: 10},
                            },
                            back: {
                                position: {x: 0, y: 0, z: -10},
                            },
                            top: {
                                position: {x: 0, y: 10, z: 0},
                            },
                            bottom: {
                                position: {x: 0, y: -10, z: 0},
                            },
                            isometric: {
                                position: {x: 10, y: 10, z: 10},
                            },
                            "top-front": {
                                position: {x: 0, y: 10, z: 10},
                            },
                            "top-right": {
                                position: {x: 10, y: 10, z: 0},
                            },
                            "top-back": {
                                position: {x: 0, y: 10, z: -10},
                            },
                            "top-left": {
                                position: {x: -10, y: 10, z: 0},
                            },
                            custom: {
                                position: {
                                    x: 21.57972466572975,
                                    y: 21.0286001424227,
                                    z: 84.80632912348827,
                                },
                            },
                        }
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