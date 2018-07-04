import React, {Component} from 'react';

import * as THREE from 'three';

export class Camera extends Component {

  sound;
  attribs = {
    fov: 45,
    aspect: window.innerWidth / window.innerHeight,
    near: .1,
    far: 10000,
    cameraSoundPath: './assets/sound/camera_change.mp3',
  };
  mesh = new THREE.PerspectiveCamera( this.attribs.fov, this.attribs.aspect,
      this.attribs.near, this.attribs.far );

  componentDidMount()
    {
      this.setupInitialValues();
      this.setupResize();
    };

  initCameraSound = ( sound ) => {
    this.mesh.add( sound );
    this.sound = sound;
  };

  playSound = () => {
    if ( !this.sound )
      {
        return;
      }
    if ( this.sound.isPlaying )
      {
        this.sound.stop();
      }
    this.sound.play();
  };

  setupInitialValues()
    {
      this.mesh.position.set( 1, 1, 70 );
      //TODO - remove later - debug

      window.camera = this;
      window.THREE = THREE;
    }

  setupResize()
    {
      window.addEventListener( 'resize', () => {
        // console.log( "adjusting camera", this.camera );
        this.mesh.aspect = window.innerWidth / window.innerHeight;
        this.mesh.updateProjectionMatrix();
      } );
    }

  render()
    {
      return <div>Camera</div>;
    }
}