import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";
import {uniqueId} from "lodash";
import {instantiateFromPrefab} from "../../../../stores/scene/actions";

export class TETSUOTextComponent extends React.Component {

    tetsuoObject = new window.TETSUO.Premade.TextScreen({
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

            this.props.transform.add(this.tetsuoObject.quad);

            this.tetsuoObject.quad.material.transparent = true;

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
            }, {framesPerChar: this.props.framesPerChar});
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
