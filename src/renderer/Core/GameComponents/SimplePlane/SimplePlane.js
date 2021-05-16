import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class SimplePlane extends React.Component {
  material;
  geometry;
  mesh;

  start = () => {
    this.initMaterial();
    this.initGeometry();
    this.initMesh();
    this.ready = true;
  };

  initMaterial() {
    this.material = new THREE.MeshLambertMaterial({
      color: 0x00000,
      side: THREE.DoubleSide
    });

    this.material.transparent = false;
  }

  initGeometry = () => {
    const { width, height } = this.props;
    this.geometry = new THREE.PlaneGeometry(width || 100, height || 100);
  };

  initMesh = () => {
    const { position, availableService } = this.props;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.props.transform.add(this.mesh);
    console.log(this.mesh);
    if (this.props.offSetZ) {
      this.mesh.position.z = this.props.offSetZ;
    }
  };

  render() {
    return null;
  }
}

SimplePlane.propTypes = {};
