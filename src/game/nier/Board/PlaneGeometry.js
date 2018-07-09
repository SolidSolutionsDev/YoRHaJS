import React, {Component} from 'react';

import * as THREE from 'three';

export class PlaneGeometry extends React.Component {

  plane;
  componentDidMount = () => {
    let geometry = new THREE.PlaneGeometry( 5, 20, 32 );
    let material = new THREE.MeshBasicMaterial(
        {color: 0xffff00, side: THREE.DoubleSide} );
    this.plane = new THREE.Mesh( geometry, material );
    this.props.pivot.add( this.plane );
  };

  update = () => {
    this.props.pivot.rotation.y += 0.01;
  };

  render()
    {
      // Wraps the input component in a container, without mutating it. Good!
      return null;
    }
}