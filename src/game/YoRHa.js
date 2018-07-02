import React, {Component} from 'react';
// import * as WHS from 'whs';
// import * as THREE from 'three';
import {App, Sphere, Plane, DirectionalLight} from 'react-whs';
import * as WHS from 'whs/build/whs.module';
import * as THREE from 'three';

export class YoRHa extends Component {
  render()
    {
      return (
          <App modules={[
            new WHS.ElementModule(),
            new WHS.ElementModule(),
            new WHS.SceneModule(),
            new WHS.DefineModule( 'camera', new WHS.PerspectiveCamera( {
              position: {
                z: 50,
              },
            } ) )
            ,
            new WHS.RenderingModule( {bgColor: 0x162129, bgOpacity: 1} ), // Apply THREE.WebGLRenderer
            // new WHS.ResizeModule( 'a' ),
            new WHS.OrbitControlsModule(),
          ]}>
            <Sphere geometry={[3, 32, 32]}
                    material={new THREE.MeshPhongMaterial(
                        {color: 0xF2F2F2} )}/>
            <Plane geometry={[100, 100]}
                   material={new THREE.MeshPhongMaterial( {color: 0x447F8B} )}
                   rotation={{x: -Math.PI / 2}}/>
            <DirectionalLight light={{
              color: 0xffffff,
              intensity: 0.2,
            }}

                              position={[10, 20, 10]}></DirectionalLight>
          </App>
      );
    }
}

export default YoRHa;