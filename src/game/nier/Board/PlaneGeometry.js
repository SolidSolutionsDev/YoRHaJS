import React, {Component} from 'react';

import * as THREE from 'three';

export class PlaneGeometry extends React.Component {

  mesh;

  componentWillMount = () => {
    // let geometry = new THREE.PlaneGeometry( 50, 50, 32 );
    let geometry = new THREE.BoxGeometry( 50, 50, 2 );
    let material = new THREE.MeshLambertMaterial(
        {color: 0xd1cdb7, side: THREE.DoubleSide} );
    this.mesh = new THREE.Mesh( geometry, material );
    this.props.pivot.add( this.mesh );
  };

  update = () => {
    // this.props.pivot.rotation.y += 0.01;
  };

  render()
    {
      // Wraps the input component in a container, without mutating it. Good!
      return null;
    }
}