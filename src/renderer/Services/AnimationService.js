import React, { Component } from "react";

import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";

export class AnimationService extends Component {
  Easing = TWEEN.Easing;

  // TODO: add tweening register of what objects are travellng

  // TODO: make function parameters an object and use proptypes or alternative to specify mandatory fields and have auto complete.
  travelTo(gameObjectTravelling, finalPosition, time, parameters) {
    const _from = {
      x: gameObjectTravelling.position.x,
      y: gameObjectTravelling.position.y,
      z: gameObjectTravelling.position.z
    };

    const _to = {
      x: finalPosition.x,
      y: finalPosition.y,
      z: finalPosition.z
    };

    const _easing =
      parameters && parameters.easing
        ? parameters.easing
        : TWEEN.Easing.Linear.None;
    const _target = parameters && parameters.target ? parameters.target : false;
    const _onStart =
      parameters && parameters.onStart ? parameters.onStart : null;

    const tween = new TWEEN.Tween(_from)
      .to(_to, time)
      .easing(_easing)
      .onStart(() => {
        if (_onStart) {
          _onStart();
        }
      })
      .onUpdate(function() {
        gameObjectTravelling.position.set(_from.x, _from.y, _from.z);
        if (_target) {
          gameObjectTravelling.lookAt(_target);
        }
      })
      .onComplete(function() {
        // TODO: emit event or dispatch to redux
      });
    if (parameters.autoStart) {
      tween.start();
    }
  }

  lookAt(gameObjectlooking, targetPosition, time, parameters) {
    // backup original rotation
    const startRotation = new THREE.Euler().copy(gameObjectlooking.rotation);

    // final rotation (with lookAt)
    const _finalPosition =
      parameters && parameters.finalPosition
        ? parameters.finalPosition
        : gameObjectlooking.position.clone();
    const _initialPosition = gameObjectlooking.position.clone();
    gameObjectlooking.position.set(
      _finalPosition.x,
      _finalPosition.y,
      _finalPosition.z
    );
    gameObjectlooking.lookAt(targetPosition);
    const endRotation = new THREE.Euler().copy(gameObjectlooking.rotation);
    gameObjectlooking.position.set(
      _initialPosition.x,
      _initialPosition.y,
      _initialPosition.z
    );

    // revert to original rotation
    gameObjectlooking.rotation.copy(startRotation);

    const _from = {
      x: startRotation._x,
      y: startRotation._y,
      z: startRotation._z
    };

    const _to = {
      x: endRotation._x,
      y: endRotation._y,
      z: endRotation._z
    };

    const tween = new TWEEN.Tween(_from)
      .to(_to, time)
      .onUpdate(function() {
        gameObjectlooking.rotation._x = _from.x;
        gameObjectlooking.rotation._y = _from.y;
        gameObjectlooking.rotation._z = _from.z;
        gameObjectlooking.rotation.fromArray([_from.x, _from.y, _from.z]);
      })
      .onComplete(function() {
        // TODO: emit event or dispatch to redux
      })
      .start();
  }

  update = time => {
    TWEEN.update(time);
  };

  render() {
    return null;
  }
}
