import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";
import { uniqueId } from "lodash";
import { instantiateFromPrefab } from "../../../../stores/scene/actions";


export class TETSUOTextComponent extends React.Component {

    tetsuoObject;

    initTetsuo = () => {

        //END
        const { TextScreen } = this.props.availableService.nodeService.nodes;
        this.tetsuoObject = new TextScreen({
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
        })

        this.tetsuoObject.prepare().then(mesh => {
            const { getTextureFromPremade } = this.props.availableService.nodeService;
            const texture = getTextureFromPremade(this.tetsuoObject);

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
