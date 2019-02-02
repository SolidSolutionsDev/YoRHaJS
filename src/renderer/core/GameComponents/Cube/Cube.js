import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class Cube extends React.Component {
  cube;

  loadCube = () => {
    const { transform } = this.props;
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    this.cube = new THREE.Mesh( geometry, material );
    transform.add(this.cube);
  };

  start = () => {
    this.loadCube();
  };

  update = () => {
    this.props.gameObject.transform.rotation.x+=this.props.rotationX;
  };

  render() {
    return null;
  }
}

Cube.propTypes = {
  transform: PropTypes.object.isRequired,
};
