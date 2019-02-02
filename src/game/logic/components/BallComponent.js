import * as _ from "lodash";

import { dimensions } from "../../settings";
import * as THREE from "three";

// remove this
import * as CANNON from "cannon";
import TWEEN from "@tweenjs/tween.js/src/Tween";

export const isBall = (gameObject, parameters) => {
  const config = Object.assign(
    {
      height: dimensions.lines,
      width: dimensions.columns,
      space: dimensions.scale,
      soundLocation: "./assets/sound/shot.wav",
      color: 0x00ff00
    },
    {}
  );

  const _audioService = gameObject.props.getAudioService();
  this.sound = _audioService.buildPositionalSound(config.soundLocation);
  this.bodiesInContact = [];

  const linearDamping = 0.0;
  const angularDamping = 0.0;

  const step = config.space;
  const gridGeoRadius = (step - 0.1) / 2;

  this.colliding = false;

  const gridGeo = new THREE.SphereGeometry(gridGeoRadius);
  const material = new THREE.MeshPhongMaterial({
    color: config.color,
    opacity: 1.0,
    transparent: true
  });
  this.mesh = new THREE.Mesh(gridGeo, material);
  this.mesh.name = _.uniqueId("Ball");

  let _parameters = {
    skyboxType: "sphere",
    texture: "./assets/img/sky.png",
    radius: 100
  };

  let _texture;

  const loader = new THREE.TextureLoader();

  loader.load(
    _parameters.texture,

    texture => {
      _texture = texture;
      // _texture.minFilter = THREE.LinearFilter;
      // _texture.magFilter = THREE.LinearFilter;
      // _texture.repeat.set( 1, 1 );

      // _texture.wrapS = THREE.MirroredRepeatWrapping;
      // _texture.wrapT = THREE.MirroredRepeatWrapping;

      if (material) {
        material.color = new THREE.Color(1, 1, 1);
        // material.envMap = texture;

        this.mesh.material.map = texture;
        this.mesh.material.needsUpdate = true;
      }
    }
  );

  let shooterRotation = 3.14;
  this.mesh.add(this.sound);
  gameObject.mesh.add(this.mesh);
  //
  // this.mesh.position.copy(
  //     getLowerHeightPositionFromBoardDimensions( dimensions ) );
  //this.mesh.scale.set( dimensions.scale, dimensions.scale, dimensions.scale );

  const _physicsService = gameObject.props.getPhysicsService();
  this.physicsRepresentation = _physicsService.addNewSphereBody(
    this.mesh,
    {
      radius: gridGeoRadius,
      position: getLowerHeightPositionFromBoardDimensions(dimensions),
      mass: 0,
      type: CANNON.Body.DYNAMIC,
      linearFactor: new _physicsService.Vec3(1, 1, 0),
      angularFactor: new _physicsService.Vec3(1, 1, 0),
      linearDamping: linearDamping,
      angularDamping: angularDamping,
      beginContactFunction: body2 => {
        this.bodiesInContact.push(body2.instance);
      },
      endContactFunction: body2 => {
        this.bodiesInContact = this.bodiesInContact.filter(
          bodyCollided => bodyCollided !== body2.instance
        );
      }
    },
    gameObject
  );

  console.log(this.physicsRepresentation.body);

  document.addEventListener("shooterRotation", e => {
    shooterRotation = e.detail.rotation;
  });

  this.physicsRepresentation.body.addEventListener("collide", e => {
    document.dispatchEvent(
      new CustomEvent("ballCollided", {
        detail: {
          originalEvent: e,
          object: this
        }
      })
    );
  });

  document.addEventListener("shoot", () => {
    const _ballIsMoving = this.physicsRepresentation.body.mass === 1;

    if (_ballIsMoving) {
      // this.returnToShooter();
    } else {
      this.shoot();
    }
  });

  this.shoot = () => {
    this.physicsRepresentation.body.mass = 1;
    this.physicsRepresentation.body.type = CANNON.Body.DYNAMIC;

    this.physicsRepresentation.body.updateMassProperties();

    // _physicsRepresentation.body.invMass=5;
    const rotation = shooterRotation;
    applyForce(rotation, 30);
  };

  this.returnToShooter = color => {
    this.mesh.material.color.setHex(color);
    this.physicsRepresentation.body.position.copy(
      this.physicsRepresentation.body.initPosition
    );
    this.physicsRepresentation.body.mass = 0;
    this.physicsRepresentation.body.type = CANNON.Body.STATIC;
    this.physicsRepresentation.body.updateMassProperties();
  };

  function getLowerHeightPositionFromBoardDimensions(settings) {
    const _lines = settings.lines / 2 + 1;
    const height = -_lines * settings.scale;
    return new THREE.Vector3(0, height, 0);
  }

  function attachTo(object) {}

  function detachFromCurrentObject() {}

  const update = id => {
    // console.log(bodiesInContact);
    this.physicsRepresentation.update();
  };

  const applyForce = (angle, velocity = 1) => {
    console.log(this.physicsRepresentation.body);
    this.physicsRepresentation.body.velocity.y = velocity * -Math.cos(angle);
    this.physicsRepresentation.body.velocity.x = velocity * Math.sin(angle);

    // _physicsRepresentation.body.velocity.y += 0.3;
  };

  let state = {
    update: update
  };

  return { ball: state };
};
