import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water";

export class WaterComponent extends React.Component {
  waterGeometry;
  water;
  start = () => {
    const { availableComponent } = this.props;
      const { scene } = availableComponent;
      const lightPosition= this.props.gameObjects["directionalLight1"].transform.position;
      const normalizedLightPosition = new THREE.Vector3(lightPosition.x,lightPosition.y,lightPosition.z).normalize();
      this.waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
    this.water = new Water(
        this.waterGeometry,
        {
          time:0,
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load( './assets/textures/waternormals.jpg', function ( texture ) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          } ),
          alpha: 1.0,
          sunDirection: normalizedLightPosition,
          sunColor: 0xaa0000,
          waterColor: 0x0000aa,
          distortionScale: 1.7,
          fog: scene.scene.fog !== undefined
        }
    );

    // this.water.rotation.x = - Math.PI / 2;

    // this.water.position.z+=.2;
    // this.water.material.wireframe = true;
    this.props.transform.add( this.water );

  };

  update = () => {
    this.water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
  };

  render() {
    return null;
  }
}

WaterComponent.propTypes = {
  transform: PropTypes.object.isRequired
};
