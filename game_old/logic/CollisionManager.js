import React, { Component } from "react";
import * as THREE from "three";

THREE.Sphere.__closest = new THREE.Vector3();
THREE.Sphere.prototype.intersectsBox = function(box) {
  // get box closest point to sphere center by clamping
  THREE.Sphere.__closest.set(this.center.x, this.center.y, this.center.z);
  THREE.Sphere.__closest.clamp(box.min, box.max);

  var distance = this.center.distanceToSquared(THREE.Sphere.__closest);
  return distance < this.radius * this.radius;
};

export class CollisionManager extends Component {
  colliders = [];

  componentDidMount() {
    document.addEventListener("registerCollider", function(event) {});
  }

  registerCollider(collider) {
    this.colliders.push(collider);
  }

  getColliders() {
    return this.colliders;
  }

  removeCollider(collider) {
    this.colliders = this.colliders.filter(colliderElement => {
      return collider !== colliderElement;
    });
  }

  cleanColliders() {
    this.colliders = [];
  }
}
