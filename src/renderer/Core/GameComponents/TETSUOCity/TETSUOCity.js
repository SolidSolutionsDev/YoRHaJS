import React from "react";
import * as THREE from "three";

import TETSUO from "@SolidSolutionsDev/tetsuo";

export class TETSUOCity extends React.Component {

    tetsuoBackgroundObject;
    mesh;
    geometry = new THREE.PlaneBufferGeometry(1.9, 1.9);
    ready = false;

    initTetsuoBackground = () => {
        const { BackgroundCity } = this.props.availableService.nodeService.nodes;
        this.tetsuoBackgroundObject = new BackgroundCity({
            width: 1280,
            height: 720,
        });
        const { transform } = this.props;
        this.tetsuoBackgroundObject.prepare().then(mesh => {

            const { getMaterialFromPremade } = this.props.availableService.nodeService;
            const material = getMaterialFromPremade(this.tetsuoBackgroundObject);

            this.mesh = new THREE.Mesh(this.geometry, material);
            material.color = 0xaaaaaa;
            transform.add(this.mesh);
            this.mesh.material.transparent = false;
            console.log(this.mesh);
            this.ready = true;
        });
    }

    start = () => {
        this.initTetsuoBackground();
    };

    update = (time, deltaTime) => {
        if (this.ready) {
            //  console.log(deltaTime/1000);
            // this.tetsuoBackgroundObject.update(deltaTime/1000);

            // if (this.tetsuoBackgroundObject) {
            //     this.mesh.material.map = new THREE.CanvasTexture(this.tetsuoBackgroundObject._renderer.renderer.domElement);
            // }
        }
    };

}

TETSUOCity.propTypes = {};
