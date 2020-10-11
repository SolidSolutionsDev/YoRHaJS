import PropTypes from "prop-types";

export const initialScene = {
  title: {
    color: "#000000",
    subText: "SPACE to select and move forward. W and Z for selecting options.",
    subTextColor: "#ffffff",
  },
  // TODO: split data in a better high level state strucuture (game, engine)
  game: {
    settings: {
      speed: 1,
      current_level: 0,
    },
    activeScenes: ["main"],
    preloadWaitToStart: false,
    assets: {},
    levels: {
      byId: {
        zero: {
          walls: {},
          groups: {},
        },
      },
      allIds: ["zero"],
    },
    renderer: {
      alpha: true,
      antialias: false,
      //    postprocessing: true,
      backgroundColor: {
        clearColor: 0x222222,
        alpha: 0,
      },
    },

    allCameras: [],
  },

  scenes: {
    main: {
      fog: {
        color: 0x222222,
        // near: 10,
        far: 4000,
      },
      camera: {
        main: null,
        allCameras: [],
      },
      children: [
        "lightGroup",
        "board1",
        // "testCubeGameObject1",
        "testShooter1",
        // "testBoss0",
        "testBoss1",
        "testEnemy2",
        // "testEnemy3",
        // "testEnemy4",
        "camera1",
      ],
    },
  },
  gameObjects: {
    byId: {
      camera1: {
        prefab: "DynamicCamera",
      },
      testCubeGameObject1: {
        debug: true,
        prefab: "TestCube",
        transform: {
          position: { x: 10, y: 0, z: 4 },
        },
      },
      testShooter1: {
        debug: true,
        transform: {
          position: { x: 0, y: 0, z: 4 },
        },
        components: {
          /*   TextGeometry: {
            randomColors: false,
            colors: [0xffaaaa],
            text: "SOLID",
            height: 2,
            size: 7,
            hover: 30,
            curveSegments: 4,
            bevelThickness: 0.2,
            bevelSize: 0.15,
            bevelEnabled: true,
            fontName: "opensans", // helvetiker, optimer, gentilis, droid sans, droid seri,
            fontWeight: "bold", // normal bol,
            mirror: false,
          }, */
        },
        tags: ["playerShooter"],
        prefab: "TestShooter",
      },
      testBoss0: {
        debug: true,
        transform: {
          position: { x: 30, y: -30, z: 3 },
        },
        prefab: "EnemySphereBoss",
      },
      testBoss1: {
        debug: true,
        transform: {
          position: { x: -30, y: 30, z: 10 },
        },
        /// sprefab: "EnemySphereBoss"
      },
      testEnemy2: {
        debug: true,
        transform: {
          position: { x: 12, y: -12, z: 3 },
        },
        prefab: "EnemyFollower",
      },
      testEnemy3: {
        debug: true,
        transform: {
          position: { x: -12, y: -12, z: 3 },
        },
        prefab: "EnemyFollower",
      },
      testEnemy4: {
        debug: true,
        transform: {
          position: { x: 12, y: 12, z: 3 },
        },
        prefab: "EnemyFollower",
      },
      board1: {
        debug: true,
        components: {
          BoardPlaneGeometry: {
            rotationX: 0.01,
            dimensions: { x: 100, y: 100, z: 2 },
            mass: 0,
          },
        },
        prefab: "Board",
      },
      lightGroup: {
        transform: {},
        components: {},
        children: [
          "directionalLight1",
          "ambientLight1",
          // "pointLight1"
        ],
      },
      directionalLight1: {
        transform: {},
        components: {},
        prefab: "DirectionalLight",
        parentId: "lightGroup",
      },
      ambientLight1: {
        transform: {},
        components: {},
        prefab: "AmbientLight",
        parentId: "lightGroup",
      },
      pointLight1: {
        transform: {},
        components: {},
        prefab: "PointLight",
        parentId: "lightGroup",
      },
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
    ],
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
              "nier",
            ],
            cameraAllowedPositions: {
              left: {
                position: { x: -10, y: 0, z: 0 },
              },
              right: {
                position: { x: 10, y: 0, z: 0 },
              },
              front: {
                position: { x: 0, y: 0, z: 10 },
              },
              back: {
                position: { x: 0, y: 0, z: -10 },
              },
              top: {
                position: { x: 0, y: 10, z: 0 },
              },
              bottom: {
                position: { x: 0, y: -10, z: 0 },
              },
              isometric: {
                position: { x: 10, y: 10, z: 10 },
              },
              "top-front": {
                position: { x: 0, y: 10, z: 10 },
              },
              "top-right": {
                position: { x: 10, y: 10, z: 0 },
              },
              "top-back": {
                position: { x: 0, y: 10, z: -10 },
              },
              "top-left": {
                position: { x: -10, y: 10, z: 0 },
              },
              nier: {
                position: { x: 0, y: -550, z: 350 },
              },
              custom: {
                position: {
                  x: 21.57972466572975,
                  y: 21.0286001424227,
                  z: 84.80632912348827,
                },
              },
            },
          },
        },
        children: [],
      },
      TestCube: {
        debug: true,
        transform: {},
        components: {
          testCube: {
            rotationX: 0.01,
            opacity: 0.9,
          },
        },
        children: [],
      },
      PlayerBullet: {
        debug: true,
        transform: {},
        components: {
          PlayerBulletGeometry: {},
          BulletMovement: {
            debug: true,
          },
        },
        children: [],
      },
      EnemyBullet: {
        debug: true,
        transform: {},
        components: {
          SphereGeometry: {
            basicMaterial: true,
            castShadow: false,
          },
        },
        children: [],
      },
      TestShooter: {
        debug: true,
        components: {
          PlayerControls: {},
          Shooter: {
            soundLocation:
              "./assets/sounds/348162__djfroyd__laser-one-shot-3.wav",
            moveRatio: 7,
            displacementRatio: 5,
            bulletPrefab: "PlayerBullet",
            selfDestructTime: 2000,
          },
          PlayerShooterGeometry: {
            dimensions: { x: 2, y: 2, z: 2 },
            // position:{ x: 0, y: 0, z: 4 },
            mass: 1,
          },
        },
        children: [],
      },
      EnemyFollower: {
        debug: true,
        components: {
          EnemyMovementControls: {
            type: "follow",
            speed: 50,
            rotationSpeed: 10,
          },
          Shooter: {
            shooting: true,
            moveRatio: 2,
            bulletPrefab: "EnemyBullet",
            shootTimeInterval: 2000,
            aroundBullets: 1,
          },
          EnemyCubeGeometry: {
            dimensions: { x: 2, y: 2, z: 2 },
            // position:{ x: 0, y: 0, z: 4 },
            color: 0xaaaaaa,
            mass: 1,
            tip: true,
          },
        },
        children: [],
      },
      EnemySphereBoss: {
        debug: true,
        components: {
          EnemyMovementControls: {
            type: "rotate",
            speed: 50,
            rotationSpeed: 2,
          },
          Shooter: {
            shooting: true,
            moveRatio: 2,
            displacementRatio: 1,
            bulletPrefab: "EnemyBullet",
            shootTimeInterval: 50,
            aroundBullets: 1,
          },
          SphereGeometry: {
            radius: 1.4,
            // position:{ x: 0, y: 0, z: 4 },
            color: 0xaaaaaa,
            castShadow: true,
          },
        },
        children: [],
      },
      Board: {
        debug: true,
        transform: {},
        components: {
          BoardPlaneGeometry: {},
        },
        children: [],
      },
      DirectionalLight: {
        transform: {},
        components: {
          DirectionalLight: {
            castShadow: true,
            color: 0xffffff,
            intensity: 0.9,
            position: {
              x: 0,
              y: -70,
              z: 100,
            },
          },
        },
      },
      PointLight: {
        transform: {
          position: {
            x: 10,
            y: 7,
            z: 5,
          },
        },
        components: {
          PointLight: {
            castShadow: true,
            color: 0xffffff,
            intensity: 1,
            distance: 100,
          },
        },
      },
      AmbientLight: {
        transform: {},
        components: {
          AmbientLight: {
            color: 0x222222,
          },
        },
        children: [],
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
      "DynamicCamera",
    ],
  },
};
