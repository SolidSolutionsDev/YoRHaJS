import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";

export class TETSUOCity extends React.Component {

    tetsuoBackgroundObject = new window.TETSUO.Premade.BackgroundCity({
        width: 1280,
        height: 720,
    });
    mesh;
    geometry = new THREE.PlaneGeometry(2, 2, 32);

    initTetsuoBackground = () => {

        const {transform} = this.props;
        this.tetsuoBackgroundObject.prepare();
        this.material = new THREE.MeshBasicMaterial({
            transparent:true,
            map: new THREE.Texture(this.tetsuoBackgroundObject.texture),
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.quadToUse =  this.tetsuoBackgroundObject.quad.clone();
        transform.add(this.mesh);
        this.mesh.position.x += 2;
    }

    start = () => {
        this.initTetsuoBackground();
    };

    update = (time, deltaTime) => {
        this.tetsuoBackgroundObject.update(deltaTime);

        if (this.tetsuoBackgroundObject) {
            this.mesh.material.map = new THREE.CanvasTexture(this.tetsuoBackgroundObject._renderer.renderer.domElement);
        }
    };

}

TETSUOCity.propTypes = {};
