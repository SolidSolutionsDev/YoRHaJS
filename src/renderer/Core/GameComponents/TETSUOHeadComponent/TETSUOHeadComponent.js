import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";

export class TETSUOHeadComponent extends React.Component {

    tetsuoObject = new window.TETSUO.Premade.Face({
        geometryPath: "./assets/models/head/face.json",
    });
    mesh;

    initTetsuo = () => {

        const {transform} = this.props;
        this.tetsuoObject.prepare().then(mesh => {
            console.log(mesh);
            this.mesh = mesh;
            mesh.rotation.x = Math.PI;
            transform.add(mesh)
        });
        console.log(this);
    }

    start = () => {
        this.initTetsuo();
    };

    update = (time, deltaTime) => {
        this.tetsuoObject.update(deltaTime, {
            // color: new THREE.Vector3(Math.cos(time * 2), 1, Math.sin(time * 2)),
            color: new THREE.Vector3(1, Math.cos(time * 2), Math.sin(time * 2)),
        });
    };

}

TETSUOHeadComponent.propTypes = {};
