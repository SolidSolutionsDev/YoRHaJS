import React, {Component} from 'react';
// import * as WHS from 'whs';
// import * as THREE from 'three';
import {
    App,
    DefineModule,
    ElementModule,
    OrbitControlsModule,
    PerspectiveCamera,
    Plane,
    RenderingModule,
    SceneModule,
    ResizeModule
} from 'whs';
// import * as WHS from 'whs/build/whs.module';
import * as THREE from 'three';

export class YoRHa extends Component {

    componentWillMount = () => {
        console.log(document.getElementById('app'));
        const app = new App([
            new ElementModule(document.getElementById('app')),
            new SceneModule(),
            new DefineModule('camera', new PerspectiveCamera({
                position: {
                    z: -15
                }
            })),
            new RenderingModule({bgColor: 0x000001}),
            new OrbitControlsModule(),
            new ResizeModule(),

        ]);

        app.start();
    }
  render()
    {
      return (null);
    }
}

export default YoRHa;