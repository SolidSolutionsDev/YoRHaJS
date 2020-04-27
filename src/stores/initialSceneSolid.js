import PropTypes from "prop-types";
import {kernelConstants} from "./constants";

export const initialScene = {
  title:{
    color:"#000000",
    subText:"We build epic, realtime interactive experiences to blow people's minds",
    subTextColor:"#ffffff"
  },
  // TODO: split data in a better high level state strucuture (game, engine)
  game: {
    settings: {
      speed: 1,
      current_level: 0
    },
    preloadWaitToStart:true,
    assets: {
      sephirothPMXModel:"./assets/models/SAFER Sephiroth/SAFER Sephiroth V.01.pmx",
      fariaDemoMP3:"./assets/sounds/demo_  [demo] - Ableton Live 9 Suite 2020-04-10 15-00-21.mp3",
      everestOBJ: "./assets/models/64-everest/everest.obj",
      worleyTunnelVertShader:"./assets/shaders/fragment/anticore_worley_tunnel.glsl",
      sandsFragShader:"./assets/shaders/fragment/anticore_raymarching_sands.glsl",
      marchingCubesSpheresFragShader:"./assets/shaders/fragment/anticore_raymarching_cubes_spheres.glsl",
      laserShot:"./assets/sounds/348162__djfroyd__laser-one-shot-3.wav",
      menuMove:"./assets/sounds/The Legend of Zelda Cartoon Sound Effects Health Heart.wav",
      menuSelect:"./assets/sounds/The Legend of Zelda Cartoon Sound Effects Power Zap.wav",
    },
    levels: {
      byId: {
        zero: {
          walls: {},
          groups: {}
        }
      },
      allIds: ["zero"]
    },
    renderer: {
      alpha: true,
      antialias: false,
      postprocessing: true,
      backgroundColor: {
        clearColor:0x222222,
        alpha:1.0
      }
    }
  },
  scene: {
    // fog :{
    //   color:0x222222,
    //   near:105,
    //   far: 400
    // },
    camera: {
      main: null,
      allCameras: []
    },
    children: [
      "lightGroup",
      // "board1",
      // "testCubeGameObject1",
      // "testShooter1",
      // "testBoss0",
      "testBoss1",
      // "testEnemy2",
      // "testEnemy3",
      // "testEnemy4",
      "camera1",
      "mountainSolid",
      // "water1",
      "sephiroth1",
      // "shaderPlane1",
      "backgroundMusicPlayer1",
      "rpgGame",
      "rpgTestPlayer1"
    ]
  },
  gameObjects: {
    byId: {
      // rpgGame: {},
      rpgGame: {
        prefab: "RPGGamePrefab",
      },
      rpgTestPlayer1: {
        transform: {
          scale:{x:100,y:100,z:100},
          position: { x: 10, y: 10, z: 1390},
        },
        prefab:"TestRPGPlayer"
      },
      camera1: {
        prefab: "DynamicCameraPrefab"
      },
      sephiroth1: {
        transform: {
          scale:{x:10,y:10,z:10},
          position: { x: 220, y: -120, z: 990},
        },
        components:{
          meshGeometryLoader:{
            assetId:"sephirothPMXModel"
          },
        }
      },
      backgroundMusicPlayer1: {
        components:{
          soundPlayer: {
            positional: false,
            // path: "./assets/sounds/demo_  [demo] - Ableton Live 9 Suite 2020-04-10 15-00-21.mp3",
            assetId: "fariaDemoMP3",
            tag: "backgroundMusic",
            analyser:true,
            // path: "./assets/sounds/stereo-left-and-right-test.mp3",
          },
        }
      },
      mountainSolid: {
        debug: true,
        components: {
          audioScale: {
            audioTag: "backgroundMusic"
          },
          autoRotate:{
            speed: {
              z:0.001
            }
          },
          meshGeometryLoader:{
            // assetURL: "./assets/models/64-everest/everest.obj",
            assetId:"everestOBJ",
            scale: 100,
            materialParameters:{
              color: 0x777777,
              wireframe:true
            },
            materialType: "basic"
          }
        },
        transform: {
          position: { x: 0, y: 0, z: 30},
          rotation:{
            x:Math.PI/2
          }
        }
      },
      testCubeGameObject1: {
        debug: true,
        prefab: "TestCube",
        transform: {
          position: { x: 10, y: 0, z: 4 }
        }
      },
      testShooter1: {
        debug: true,
        transform: {
          position: { x: 0, y: 0, z: 4 }
        },
        components:{
          textGeometry: {
            randomColors:false,
            colors:[0xff1111],
            text: "SOLID",
            height: 2,
            size: 20,
            hover: 30,
            curveSegments:  4,
            bevelThickness: .2,
            bevelSize: .15,
            bevelEnabled: true,
            fontName: "opensans", // helvetiker, optimer, gentilis, droid sans, droid seri,
            fontWeight: "bold",// normal bol,
            mirror:  false,
          },
        },
        tags: ["playerShooter"],
        prefab: "TestShooter",
      },
      testBoss0: {
        debug: true,
        transform: {
          position: { x: 30, y: -30, z: 3 }
        },
        prefab: "EnemySphereBoss"
      },
      testBoss1: {
        debug: true,
        transform: {
          position: { x: -30, y: 30, z: 10 }
        },
        /// sprefab: "EnemySphereBoss"
      },
      testEnemy2: {
        debug: true,
        transform: {
          position: { x: 12, y: -12, z: 3 }
        },
        prefab: "EnemyFollower"
      },
      testEnemy3: {
        debug: true,
        transform: {
          position: { x: -12, y: -12, z: 3 }
        },
        prefab: "EnemyFollower"
      },
      testEnemy4: {
        debug: true,
        transform: {
          position: { x: 12, y: 12, z: 3 }
        },
        prefab: "EnemyFollower"
      },
      board1: {
        debug: true,
        components: {
          boardPlaneGeometry: {
            rotationX: 0.01,
            dimensions: { x: 500, y: 500, z: .1 },
            position: {z:-3},
            mass: 0
          }
        },
        prefab: "Board"
      },
      water1: {
        transform:{
          rotation: { x:-Math.PI/2 },
          position: {y:-300}
        },
        debug: true,
        components: {
          water:{},
        }
      },
      shaderPlane1: {
        debug: true,
        transform: {
          position: { x: 5, y: 5, z: -10 },
        },
        components: {
          planeShader:{
            explode: {
              directionFunction:"random",
              distance:200.0,
              timeScale: 0.0005,
              audioTag:"backgroundMusic",
              maxEdgeLength:5,
              tessellateIterations:12,

            },
            hardLookAtCamera:false,
            width:2900,
            height:2600,
            audioTag: "backgroundMusic",
            shaderAssetID:"worleyTunnelVertShader",
            // shaderURL:"./assets/shaders/fragment/anticore_raymarching_sands_sound_test.glsl",
             // shaderURL:"./assets/shaders/fragment/anticore_raymarching_cubes_spheres.glsl"
          },
        }
      },
      lightGroup: {
        transform: {},
        components: {},
        children: [
          "directionalLight1",
          "ambientLight1"
          // "pointLight1"
        ]
      },
      directionalLight1: {
        transform: {position: {
            x: 10,
            y: -70,
            z:100
          }},
        components: {},
        prefab: "DirectionalLight",
        parentId: "lightGroup"
      },
      ambientLight1: {
        transform: {},
        components: {},
        prefab: "AmbientLight",
        parentId: "lightGroup"
      },
      pointLight1: {
        transform: {position: {
          x:10,
            y:7,
            z:5
          }},
        components: {},
        prefab: "PointLight",
        parentId: "lightGroup"
      }
    },
    allIds: [
      // "Camera",
      "testCubeGameObject1",
      "testShooter1",
      "testEnemy1",
      "board1",
      "lightGroup",
      "directionalLight1",
      "ambientLight1",
      "mountainSolid",
      "water1",
      "shaderPlane1",
      "sephiroth1",
    ]
  },
  prefabs: {
    byId: {
      DynamicCameraPrefab: {
        components: {
          // perspectiveCamera:{
          //     fov: 45,
          //     near: 0.1,
          //     far: 10000,
          //     position:{x:0,y: -55,z: 35},
          //     lookAt:{x:0,y: 0,z: 0},
          // },
          dynamicCameraManager: {
            // cameraSoundPath: "./assets/sound/camera_change.mp3",
            cameraAngle: "top",
            // cameraAutoRotate: true,
            cameraAutoRotateSpeed:3,
            cameraMinDistance: 10,
            cameraPanLock: false,
            // lookAt: { x: 0, y: 0, z: 0 },
            animatedTransformations: true,
            animatedIntroTime: 3000,
            animatedRegularTransitionTime: 1000,
            near: 0.1,
            far: 5000,
            fov: 45,
            unspecified_supportedCameraAngles: [
              "",
              "left",
              "right",
              "front",
              "back",
              "top",
              "bottom",
              "isometric",
              "nier"
            ],
            cameraAllowedPositions: {
              left: {
                position: { x: -10, y: 0, z: 0 }
              },
              right: {
                position: { x: 10, y: 0, z: 0 }
              },
              front: {
                position: { x: 0, y: 0, z: 10 }
              },
              back: {
                position: { x: 0, y: 0, z: -10 }
              },
              top: {
                position: { x: 0, y: 0, z: 2000 }
              },
              bottom: {
                position: { x: 0, y: -10, z: 0 }
              },
              isometric: {
                position: { x: 10, y: 10, z: 10 }
              },
              "top-front": {
                position: { x: 0, y: 10, z: 10 }
              },
              "top-right": {
                position: { x: 10, y: 10, z: 0 }
              },
              "top-back": {
                position: { x: 0, y: 10, z: -10 }
              },
              "top-left": {
                position: { x: -10, y: 10, z: 0 }
              },
              nier: {
                position: { x: 0, y: -55, z: 35 }
              },
              solid: {
                position: { x: 0, y: -155, z: 35 }
              },
              custom: {
                position: {
                  x: 21.57972466572975,
                  y: 21.0286001424227,
                  z: 84.80632912348827
                }
              }
            }
          }
        },
        children: []
      },
      TestCube: {
        debug: true,
        transform: {},
        components: {
          testCube: {
            rotationX: 0.01,
            opacity: 0.9
          }
        },
        children: []
      },
      PlayerBullet: {
        debug: true,
        transform: {},
        components: {
          playerBulletGeometry: {
            dimensions: [5,5,5],
            color:0xff2222
          },
          bulletMovement: {
            // debug:true,
          }
        },
        children: []
      },
      EnemyBullet: {
        debug: true,
        transform: {},
        components: {
          sphereGeometry: {
            basicMaterial: true,
            castShadow:false,
          },
        },
        children: []
      },
      TestShooter: {
        debug: true,
        components: {
          planeShader:{
            position:{x:0,y:0,z:100},
            // shaderURL:"./assets/shaders/fragment/anticore_raymarching_sands.glsl",
            // shaderURL:"./assets/shaders/fragment/anticore_raymarching_cubes_spheres.glsl"
            shaderId:"marchingCubesSpheresFragShader"
          },
          playerControls: {
          },
          shooter: {
            // soundLocation:
            //   "./assets/sounds/348162__djfroyd__laser-one-shot-3.wav",
            soundId:"laserShot",
            moveRatio: 7,
            displacementRatio: 5,
            bulletPrefab: "PlayerBullet",
            selfDestructTime: 2000,
          },
          shooterGeometry: {
            dimensions: { x: 2, y: 2, z: 2 },
            // position:{ x: 0, y: 0, z: 4 },
            mass: 1
          }
        },
        children: []
      },



      EnemyFollower: {
        debug: true,
        components: {
          enemyMovementControls: {
            type: "follow",
            speed: 50,
            rotationSpeed: 10,
          },
          shooter: {
            shooting: true,
            moveRatio: 2,
            bulletPrefab: "EnemyBullet",
            shootTimeInterval: 2000,
            aroundBullets: 1
          },
          enemyCubeGeometry: {
            dimensions: { x: 2, y: 2, z: 2 },
            // position:{ x: 0, y: 0, z: 4 },
            color: 0xaaaaaa,
            mass: 1,
            tip: true,
          }
        },
        children: []
      },
      EnemySphereBoss: {
        debug: true,
        components: {
          enemyMovementControls: {
            type: "rotate",
            speed: 50,
            rotationSpeed: 2,
          },
          shooter: {
            shooting: true,
            moveRatio: 2,
            displacementRatio:1,
            bulletPrefab: "EnemyBullet",
            shootTimeInterval: 50,
            aroundBullets: 1,

          },
          sphereGeometry: {
            radius:1.4,
            // position:{ x: 0, y: 0, z: 4 },
            color: 0xaaaaaa,
            castShadow:true,
          }
        },
        children: []
      },
      Board: {
        debug: true,
        transform: {},
        components: {
          boardPlaneGeometry: {}
        },
        children: []
      },
      DirectionalLight: {
        transform: {},
        components: {
          directionalLight: {
            castShadow: true,
            color: 0xffffff,
            intensity: 0.9,
          }
        }
      },
      PointLight: {
        transform: {
          position: {
            x: 0,
            y: 0,
            z: 0
          }
        },
        components: {
          pointLight: {
            castShadow: true,
            color: 0xffffff,
            intensity: 1,
            distance: 100
          }
        }
      },
      AmbientLight: {
        transform: {},
        components: {
          ambientLight: {
            // color: 0x222222
          }
        },
        children: []
      },
      RPGBattleModulePrefab: {
        debug: true,
        components: {
          rpgBattleModuleComponent: {
            type: kernelConstants.moduleTypes.battle,
          },
        },
        children: []
      },
      RPGMenuModulePrefab: {
        debug: true,
        components: {
          rpgMenuModuleComponent: {
            type: kernelConstants.moduleTypes.menu,
          },
        },
        children: []
      },
      RPGKernelModulePrefab: {
        debug: true,
        components: {
          rpgKernelModuleComponent: {
            type: kernelConstants.moduleTypes.kernel,
            currentModuleScene: "menuScene1",
            // currentModuleScene: "battle1",
            currentBattle: null,
            currentField: {
              scene: kernelConstants.moduleScenes.fieldScene1
            }
          },
        },
        children: []
      },
      RPGGamePrefab: {
        debug: true,
        components: {
          rpgGameComponent: {
            modulesPrefabs:{
              [kernelConstants.moduleTypes.kernel]:"RPGKernelModulePrefab",
              [kernelConstants.moduleTypes.menu]:"RPGMenuModulePrefab",
              [kernelConstants.moduleTypes.battle]:"RPGBattleModulePrefab",
              // field:"RPGFieldModule",
              // minigame:"RPGMiniGameModule",
            },
            modules: {},
          },
        },
        children: []
      },

      TestRPGPlayer: {
        debug: true,
        components: {
          cssLabelTo3d:{},
          rpgBattlePlayerControls: {
            menuMoveSoundId: "menuMove",
            menuSelectSoundId: "menuSelect",
          },
          rpgBattleCharacterCore: {
            name:"Carlos"
          },
          tetsuoParticles: {},
          },
        children: []
      },
    },
    allIds: [
      // "Camera",
      "DirectionalLight",
      "PointLight",
      "AmbientLight",
      "LightGroup",
      "Board",
      "TestCube",
      "EnemyFollower",
      "EnemySphereBoss",
      "TestShooter",
      "PlayerBullet",
      "EnemyBullet",
      "DynamicCameraPrefab",
      "RPGGamePrefab",
      "TestRPGPlayer"
    ]
  }
};
