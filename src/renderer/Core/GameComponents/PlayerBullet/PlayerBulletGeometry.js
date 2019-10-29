import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
import * as CANNON from "cannon";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class PlayerBulletGeometry extends React.Component {
  cube;
  selfDestructTime=2000;

  initBulletGeometry = () => {
    const { transform, opacity } = this.props;
    const geometry = new THREE.BoxGeometry( 1, 3, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0xf8f9e7} );
    opacity && (material.opacity = opacity);
    // material.transparent = true;
    this.cube = new THREE.Mesh( geometry, material );
    transform.add(this.cube);
  };

  initPhysics = ()=> {

      const {transform, gameObject, availableService} = this.props;

      availableService.physics
          .addNewBoxBody(gameObject.transform, {
            ...this.props, 
            position: transform.position,
            collisionFilterGroup: 1,
            linearFactor: new CANNON.Vec3(1, 1, 0),
            angularFactor: new CANNON.Vec3(0, 0, 0),
          }, 
          this
          );
      transform.physicsBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(0,0,1), gameObject.transform.rotation.z);

      // transform.physicsBody.velocity.set(gameObject.transform.rotation.x*10,gameObject.transform.rotation.y*10,0);
  }

    selfDestruct =()=> {
        const { destroyGameObjectById, _parentId} = this.props;
        destroyGameObjectById(_parentId);
        this.currentTestInstanceId = null;
        // console.log("selfDestruct",_parentId);
    }

  start = () => {
    this.initBulletGeometry();
    this.initPhysics();
  };

  // TODO: move this to physics?
    //TODO2: make move in any direction?
  moveForward =() => {
      const {transform, gameObject, speed} = this.props;
      // transform.physicsBody.velocity.set(gameObject.transform.rotation.x*10,gameObject.transform.rotation.y*10,0);
      const localForward = new CANNON.Vec3(0,1,0); // correct?
      const worldForward = new CANNON.Vec3();
      transform.physicsBody.vectorToWorldFrame(localForward, worldForward);
      const _speed = speed || 80;
    
      const velocity = new CANNON.Vec3();
      worldForward.z = 0; // don't need up velocity, so clamp it
      worldForward.normalize();
      worldForward.scale(_speed, transform.physicsBody.velocity);
  }


  update = (time) => {
      const {transform, gameObject} = this.props;
    if (transform.physicsBody){
      this.moveForward();
    }
    this.timeToEnd = !this.timeToEnd ?  time+this.selfDestructTime : this.timeToEnd;
    if (this.timeToEnd < time) {
        this.selfDestruct();
    }

  };

  onDestroy =() =>{

  }

  render() {
    return null;
  }
}

PlayerBulletGeometry.propTypes = {
  transform: PropTypes.object.isRequired,
};
