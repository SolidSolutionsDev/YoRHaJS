import React, {Component} from 'react';

import PropTypes from 'prop-types';
import * as THREE from 'three';

export class ShooterGeometry extends React.Component {

  mesh;

  componentWillMount = () => {
    // let geometry = new THREE.PlaneGeometry( 50, 50, 32 );
    // let geometry = new THREE.TetrahedronGeometry( this.props.dimensions.x, 0 );
      let geometry = new THREE.BoxGeometry( this.props.dimensions.x,
          this.props.dimensions.y, this.props.dimensions.z );
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

ShooterGeometry.propTypes = {
  dimensions: PropTypes.object.isRequired,
};