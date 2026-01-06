import PropTypes from "prop-types";

export const initialScene = {
  title: {
    color: "#000000",
    subText: "SPACE to select and move forward. W and Z for selecting options.",
    subTextColor: "#ffffff"
  },
  // TODO: split data in a better high level state strucuture (game, engine)
  game: {
    settings: {
      speed: 1,
      current_level: 0
    },
    activeScenes: ["main"],
    preloadWaitToStart: true,
    assets: {
      // sephirothPMXModel:
      //   "./assets/models/SAFER Sephiroth/SAFER Sephiroth V.01.pmx",
      // everestOBJ: "./assets/models/64-everest/everest.obj",
      // TETSUOHeadModel: "./assets/models/head/face.json",
      // TETSUOMonitor: "./assets/models/monitor/monitor.mesh.json",
      // solidLogo: "./assets/models/logo/logo.glb",
      // worleyTunnelVertShader:
      //   "./assets/shaders/fragment/anticore_worley_tunnel.glsl",
      // sandsFragShader:
      //   "./assets/shaders/fragment/anticore_raymarching_sands.glsl",
      // marchingCubesSpheresFragShader:
      //   "./assets/shaders/fragment/anticore_raymarching_cubes_spheres.glsl",
      // menuMove: "./assets/sounds/The Legend of Zelda Cartoon Sound Effects Health Heart.wav",
      // menuSelect: "./assets/sounds/The Legend of Zelda Cartoon Sound Effects Power Zap.wav",
      // fariaDemoMP3:
      //   "./assets/sounds/demo_  [demo] - Ableton Live 9 Suite 2020-04-10 15-00-21.mp3",
      fariaDemoMP3: "./assets/sounds/01 City Ruins - Ding.mp3",
      laserShot: "./assets/sounds/348162__djfroyd__laser-one-shot-3.wav"
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
      // antialias: true,
      postprocessing: false,
      backgroundColor: {
        clearColor: 0x222222,
        alpha: 0
      }
    },

    allCameras: []
  },

  scenes: {
    main: {
      fog: {
        color: 0x222222,
        far: 4000
      },
      camera: {
        main: null,
        allCameras: []
      },
      children: [
        "lightGroup",
        "board1",
        "testShooter1",
        "testBoss1",
        "testEnemy2",
        "camera1",
        "backgroundMusicPlayer1"
      ]
    }
  },
  gameObjects: {
    byId: {
      backgroundMusicPlayer1: {
        components: {
          SoundPlayer: {
            positional: false,
            assetId: "fariaDemoMP3",
            tag: "backgroundMusic",
            analyser: true,
            autoPlay: true,
            loop: true
          }
        }
      },
      camera1: {
        prefab: "DynamicCamera"
      },
      testCubeGameObject1: {
        debug: true,
        prefab: "TestCube",
        transform: {
          position: { x: 10, y: 0, z: 4 }
        }
      },
      testShooter1: {
        debug: false,
        transform: {
          position: { x: 0, y: 0, z: 4 }
        },
        tags: ["playerShooter"],
        prefab: "TestShooter"
      },
      testBoss1: {
        debug: false,
        transform: {
          position: { x: -30, y: 30, z: 3 }
        },
        prefab: "EnemySphereBoss"
      },
      testEnemy2: {
        debug: false,
        transform: {
          position: { x: 12, y: -12, z: 3 }
        },
        prefab: "EnemyFollower"
      },
      board1: {
        debug: false,
        components: {
          BoardPlaneGeometry: {
            rotationX: 0.01,
            dimensions: { x: 100, y: 100, z: 2 },
            mass: 0,
            color: 0xe5e1d1,
            emissive: 0x111108
          }
        },
        prefab: "Board"
      },
      lightGroup: {
        transform: {},
        components: {},
        children: [
          "directionalLight1",
          "ambientLight1"
        ]
      },
      directionalLight1: {
        transform: {},
        components: {},
        prefab: "DirectionalLight",
        parentId: "lightGroup"
      },
      ambientLight1: {
        transform: {},
        components: {},
        prefab: "AmbientLight",
        parentId: "lightGroup"
      }
    },
    allIds: [
      "testCubeGameObject1",
      "testShooter1",
      "testEnemy2",
      "board1",
      "lightGroup",
      "directionalLight1",
      "ambientLight1"
    ]
  },
  prefabs: {
    byId: {
      DynamicCamera: {
        components: {
          // perspectiveCamera:{
          //     fov: 45,
          //     near: 0.1,
          //     far: 10000,
          //     position:{x:0,y: -55,z: 35},
          //     lookAt:{x:0,y: 0,z: 0},
          // },
          Camera: {
            cameraSoundPath: "./assets/sound/camera_change.mp3",
            cameraAngle: "nier",
            cameraAutoRotate: false,
            cameraMinDistance: 10,
            cameraPanLock: true,
            lookAt: { x: 0, y: 0, z: 0 },
            animatedTransformations: true,
            near: 0.1,
            far: 10000,
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
                position: { x: 0, y: 10, z: 0 }
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
                position: { x: 0, y: -550, z: 350 }
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
        debug: false,
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
        debug: false,
        transform: {},
        components: {
          PlayerBulletGeometry: {
            color: 0xffffee,
            dimensions: [0.5, 2, 0.5]
          },
          BulletMovement: {
            // debug: true
          }
        },
        children: []
      },
      EnemyBullet: {
        debug: false,
        transform: {},
        components: {
          SphereGeometry: {
            color: 0xfa7911,
            basicMaterial: true,
            castShadow: false
          }
        },
        children: []
      },
      TestShooter: {
        debug: false,
        components: {
          PlayerControls: {},
          Shooter: {
            // soundLocation:
            //   "./assets/sounds/348162__djfroyd__laser-one-shot-3.wav",
            soundId: "laserShot",
            moveRatio: 7,
            displacementRatio: 5,
            bulletPrefab: "PlayerBullet",
            selfDestructTime: 2000
          },
          PlayerShooterGeometry: {
            dimensions: { x: 2, y: 2, z: 2 },
            // position:{ x: 0, y: 0, z: 4 },
            mass: 1
          },
          RingGeometry: {
            innerRadius: 4,
            outerRadius: 4.1,
            color: 0x000000,
            opacity: 0.3,
            rotation: { x: -Math.PI / 2 }
          }
        },
        children: []
      },
      EnemyFollower: {
        debug: false,
        components: {
          EnemyMovementControls: {
            type: "follow",
            speed: 50,
            rotationSpeed: 10
          },
          Shooter: {
            shooting: true,
            moveRatio: 2,
            bulletPrefab: "EnemyBullet",
            shootTimeInterval: 2000,
            aroundBullets: 1,
            soundId: "laserShot",
            bulletColorArray: [0xfa7911, 0x290642]
          },
          EnemyCubeGeometry: {
            dimensions: { x: 2, y: 2, z: 2 },
            // position:{ x: 0, y: 0, z: 4 },
            color: 0xfa7911,
            mass: 1,
            tip: true
          }
        },
        children: []
      },
      EnemySphereBoss: {
        debug: false,
        components: {
          EnemyMovementControls: {
            type: "rotate",
            speed: 50,
            rotationSpeed: 2
          },
          Shooter: {
            shooting: true,
            moveRatio: 2,
            displacementRatio: 1,
            bulletPrefab: "EnemyBullet",
            shootTimeInterval: 50,
            aroundBullets: 1,
            soundId: "laserShot",
            bulletColorArray: [0xfa7911, 0x290642]
          },
          SphereGeometry: {
            radius: 1.4,
            // position:{ x: 0, y: 0, z: 4 },
            color: 0x111111,
            castShadow: true,
            dualShell: true,
            shellColor: 0xeeeeee
          }
        },
        children: []
      },
      Board: {
        debug: false,
        transform: {},
        components: {
          BoardPlaneGeometry: {}
        },
        children: []
      },
      DirectionalLight: {
        transform: {},
        components: {
          DirectionalLight: {
            castShadow: true,
            color: 0xffffff,
            intensity: 1.2,
            position: {
              x: 0,
              y: 7,
              z: 10
            }
          }
        }
      },
      PointLight: {
        transform: {
          position: {
            x: 10,
            y: 7,
            z: 5
          }
        },
        components: {
          PointLight: {
            castShadow: true,
            color: 0xffffff,
            intensity: 0.5,
            distance: 50
          }
        }
      },
      AmbientLight: {
        transform: {},
        components: {
          AmbientLight: {
            color: 0xaaaaaa
          }
        },
        children: []
      }
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
      "DynamicCamera"
    ]
  }
};
