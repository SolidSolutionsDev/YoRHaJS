import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";
import {uniqueId} from "lodash";
import {instantiateFromPrefab} from "../../../../stores/scene/actions";

export class TETSUOCounterComponent extends React.Component {

    tetsuoObject = new window.TETSUO.Premade.TimeCounter({
        width: window.screen.width / 4,
        height: window.screen.height / 4,

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
        this.tetsuoObject.prepare();
        this.props.transform.add(this.tetsuoObject.quad);
        this.tetsuoObject.quad.material.transparent = true;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.value !== prevProps.value){
            this.tetsuoObject.setTime(this.props.value);
        }
    }

    start = () => {
        this.initTetsuo();
    };

    update = (time, deltaTime) => {
        this.tetsuoObject.update(deltaTime);
    };

}

TETSUOCounterComponent.propTypes = {};
