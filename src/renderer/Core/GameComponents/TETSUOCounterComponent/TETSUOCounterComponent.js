import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";
import {uniqueId} from "lodash";
import {instantiateFromPrefab} from "../../../../stores/scene/actions";

export class TETSUOCounterComponent extends React.Component {
    ready = false;
    tetsuoObject = new window.TETSUO.Premade.TimeCounter({
        width: 860,
        height: 360,

        // // optional options
        // backgroundColor: 0x1c1e1c,
        // marginTop: 0,
        // marginLeft: 0,
        // paddingBottom: 0,
        // paddingLeft: 0,
        opacity: .01,
        //
        defaultTextStyle: {
            fontSize: 128,
            fill: this.props.fill || 0x3cdc7c,
        },
    });

    initTetsuo = () => {
        this.tetsuoObject.prepare().then(mesh => {
            this.props.transform.add(this.tetsuoObject.quad);
            this.tetsuoObject.quad.material.transparent = true;
            this.ready = true;
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.value !== prevProps.value) {

            if (this.ready) {
                this.tetsuoObject.setTime(this.props.value);
            }
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

TETSUOCounterComponent.propTypes = {};
