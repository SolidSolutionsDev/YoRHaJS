import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";
import { uniqueId } from "lodash";
import { instantiateFromPrefab } from "../../../../stores/scene/actions";
import { TextScreen } from "../../TETSUOComponents/textScreen";

export class TETSUOTextComponent extends React.Component {

    tetsuoObject = new TextScreen({
        width: 860,
        height: 360,

        // optional options
        backgroundColor: 0x1c1e1c,
        marginTop: 0,
        marginLeft: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        opacity: .01,
        //
        defaultTextStyle: {
            fontSize: 32,
            fill: this.props.fill || 0x3cdc7c,
        },
    });

    initTetsuo = () => {

        //END


        this.tetsuoObject.prepare().then(mesh => {
            const { renderer } = this.props.availableComponent;

            renderer.tetsuoRenderer.connectNonRootNode(this.tetsuoObject.getNode());
            const texture = this.tetsuoObject.getNode().output.value;

            this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshLambertMaterial({ map: texture }));
            this.mesh.material.transparent = true;

            // this.mesh.material.opacity = 0.1;

            this.props.transform.add(this.mesh);


            if (this.props.value) {
                this.tetsuoObject.addText(this.props.value);
            }
            this.ready = true;
        });

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.value !== prevProps.value && this.ready) {
            this.tetsuoObject.addText(this.props.value, {
                fontSize: 32,
                fill: this.props.fill || 0x3cdc7c,
            }, { framesPerChar: this.props.framesPerChar });
        }
    }

    start = () => {
        this.initTetsuo();
    };

    update = (time, deltaTime) => {
        if (this.ready) {
            this.tetsuoObject.update(deltaTime);
        }
    };

}

TETSUOTextComponent.propTypes = {};
