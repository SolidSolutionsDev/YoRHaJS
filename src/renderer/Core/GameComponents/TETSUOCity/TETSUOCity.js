import React from "react";
import * as THREE from "three";

import { BackgroundCity } from "../../TETSUOComponents/backgroundCity";
import TETSUO from "@SolidSolutionsDev/tetsuo";

export class TETSUOCity extends React.Component {

    materialNode = new TETSUO.MaterialNode();
    tetsuoBackgroundObject = new BackgroundCity({
        width: 1280,
        height: 1280,
    });
    mesh;
    geometry = new THREE.PlaneBufferGeometry(2,2);
    ready = false;

    initTetsuoBackground = () => {

        const {transform} = this.props;
        this.tetsuoBackgroundObject.prepare().then(mesh => {
            const { renderer } = this.props.availableComponent;
            // this.materialNode.addItem("textScreen", this.textScreen.getNode());
            this.tetsuoBackgroundObject.getNode().connectTo(this.materialNode, "inputTex");
            renderer.tetsuoRenderer.connectNonRootNode(this.materialNode);

            // this.material = new THREE.MeshBasicMaterial({
            //     transparent: true,
            //     map: new THREE.Texture(this.tetsuoBackgroundObject.texture),
            //     // side: THREE.DoubleSide
            // });
            this.mesh = new THREE.Mesh(this.geometry, this.materialNode.material);
        
            transform.add(this.mesh);
            this.mesh.material.transparent = false;
            // this.mesh.position.x += 2;
            console.log(this.mesh);
            this.ready = true;
        });
    }

    start = () => {
        this.initTetsuoBackground();
    };

    update = (time, deltaTime) => {
        if (this.ready) {
            this.tetsuoBackgroundObject.update(deltaTime);

            // if (this.tetsuoBackgroundObject) {
            //     this.mesh.material.map = new THREE.CanvasTexture(this.tetsuoBackgroundObject._renderer.renderer.domElement);
            // }
        }
    };

}

TETSUOCity.propTypes = {};
