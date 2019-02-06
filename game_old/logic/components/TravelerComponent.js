import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
export const isTraveler = object => {
  const _object = object;

  function travelTo(finalPosition, time, parameters) {
    const _from = {
      x: _object.position.x,
      y: _object.position.y,
      z: _object.position.z
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

    const tween = new TWEEN.Tween(_from)
      .to(_to, time)
      .easing(_easing)
      .onUpdate(function() {
        _object.position.set(_from.x, _from.y, _from.z);
        if (_target) {
          _object.lookAt(_target);
        }
      })
      .onComplete(function() {
        // TODO: emit event or dispatch to redux_old
      })
      .start();
  }

  function lookAt(target, time, parameters) {
    // backup original rotation
    const startRotation = new THREE.Euler().copy(_object.rotation);

    // final rotation (with lookAt)
    const _finalPosition =
      parameters && parameters.finalPosition
        ? parameters.finalPosition
        : _object.position.clone();
    const _initialPosition = _object.position.clone();
    _object.position.set(_finalPosition.x, _finalPosition.y, _finalPosition.z);
    _object.lookAt(target);
    const endRotation = new THREE.Euler().copy(_object.rotation);
    _object.position.set(
      _initialPosition.x,
      _initialPosition.y,
      _initialPosition.z
    );

    // revert to original rotation
    _object.rotation.copy(startRotation);

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
        _object.rotation._x = _from.x;
        _object.rotation._y = _from.y;
        _object.rotation._z = _from.z;
        _object.rotation.fromArray([_from.x, _from.y, _from.z]);
      })
      .onComplete(function() {
        // TODO: emit event or dispatch to redux_old
      })
      .start();
  }

  const state = {
    travelTo: travelTo,
    lookAt: lookAt
  };

  return {
    travel: state
  };
};
