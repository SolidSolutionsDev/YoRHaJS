import TWEEN from "@tweenjs/tween.js";
import { dimensions } from "../../settings";

import * as THREE from "three";

export const isShooter = (object, parameters) => {
  const _object = object;

  let _parameters = {
    shooterType: "arrow",
    modelPath: "./assets/models/pointer.obj",
    mesh: null,
    color: 0x332211,
    rotation: {
      initial: Math.PI,
      speed: 0.03,
      limit: Math.PI / 2
    },
    outline: {
      scale: 1.1,
      color: 0xffffff
    },
    backGroundMusicPath: "./assets/music/inducedgame.mp3"
    // backGroundMusicPath: '/assets/music/po.mp3',
  };

  const _audioService = object.props.getAudioService();
  const sound = _audioService.buildNonPositionalSound(
    _parameters.backGroundMusicPath
  );

  const analyser = _audioService.buildAnalyserFromSound(sound, 32);

  this.THREE = THREE;
  this.mesh;
  this.outline;
  const loader = new this.THREE.OBJLoader();

  this.update = () => {
    if (this.outline) {
      const newScale = //_parameters.outline.scale +
        1 + Math.cos((analyser.getAverageFrequency() - 125) / 10) * 0.2;
      this.outline.scale.set(newScale, newScale, newScale);
    }
  };

  loader.load(
    _parameters.modelPath,
    obj => {
      _object.mesh.add(obj);
      changeObjectChildrenMaterialTo(
        obj,
        new THREE.MeshLambertMaterial({ color: _parameters.color })
      );
      computeChildrenNormals(obj);
      const _objOutline = obj.clone();
      _objOutline.scale.set(
        _parameters.outline.scale,
        _parameters.outline.scale,
        _parameters.outline.scale
      );

      changeObjectChildrenMaterialTo(
        _objOutline,
        new THREE.MeshBasicMaterial({
          color: _parameters.outline.color,
          side: THREE.BackSide
        })
      );
      obj.add(_objOutline);
      state.mesh = obj;
      this.mesh = obj;
      this.outline = _objOutline;
    },
    function(xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function(error) {
      console.log("An error happened");
    }
  );

  initEventListeners(object, _parameters);
  setParentGameObjectTransforms(object, _parameters);

  let state = {
    mesh: _parameters.mesh,
    update: this.update
  };

  return {
    shooter: state
  };
};

function changeObjectChildrenMaterialTo(object, material) {
  object.children.forEach(childObject => {
    childObject.material = material;
  });
}

function computeChildrenNormals(object) {
  object.children.forEach(childObject => {
    const _oldGufferGeometry = childObject.geometry;
    const _geometry = new THREE.Geometry().fromBufferGeometry(
      _oldGufferGeometry
    );
    childObject.geometry = _geometry;
    childObject.geometry.mergeVertices();
    childObject.geometry.computeVertexNormals(true);
    childObject.geometry.needsUpdate = true;
    _oldGufferGeometry.dispose();
  });
}

function getLowerHeightPositionFromBoardDimensions(settings) {
  const _lines = settings.lines / 2 + 1;
  const height = -_lines * settings.scale;
  return new THREE.Vector3(0, height, 0);
}

let animateShoot = function(object) {
  let scale = { scale: dimensions.scale + 0 };

  let target = { scale: dimensions.scale * 1.05 };

  const tweenA = new TWEEN.Tween(scale).to(target, 100);
  const tweenB = new TWEEN.Tween(target).to(dimensions, 100);
  tweenA.onUpdate(() => {
    object.mesh.scale.set(scale.scale, scale.scale, scale.scale);
  });
  tweenB.onUpdate(() => {
    object.mesh.scale.set(target.scale, target.scale, target.scale);
  });

  tweenA.chain(tweenB);

  tweenA.start();
};

function initEventListeners(object, parameters) {
  document.addEventListener("moveright", function() {
    if (
      object.mesh.rotation.z - parameters.rotation.initial <
      -parameters.rotation.limit
    ) {
      return;
    }
    object.mesh.rotation.z -= parameters.rotation.speed;
    emitRotation(object.mesh.rotation.z);
  });
  document.addEventListener("moveleft", function() {
    if (
      object.mesh.rotation.z - parameters.rotation.initial >
      parameters.rotation.limit
    ) {
      return;
    }
    object.mesh.rotation.z += parameters.rotation.speed;
    emitRotation(object.mesh.rotation.z);
  });

  document.addEventListener("shoot", function() {
    animateShoot(object);
  });
}

function emitRotation(rotationValue) {
  document.dispatchEvent(
    new CustomEvent("shooterRotation", { detail: { rotation: rotationValue } })
  );
}

let setParentGameObjectTransforms = function(object, _parameters) {
  object.mesh.position.copy(
    getLowerHeightPositionFromBoardDimensions(dimensions)
  );
  object.mesh.rotation.z = _parameters.rotation.initial;
  object.mesh.scale.set(dimensions.scale, dimensions.scale, dimensions.scale);
};
