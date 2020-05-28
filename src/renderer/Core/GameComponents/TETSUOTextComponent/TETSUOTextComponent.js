import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";
import {uniqueId} from "lodash";
import {instantiateFromPrefab} from "../../../../stores/scene/actions";

export class TETSUOTextComponent extends React.Component {

    tetsuoObject = new window.TETSUO.Premade.TextScreen({
        width: window.screen.width / 4,
        height: window.screen.height / 4,

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


        this.tetsuoObject.prepare();

        this.props.transform.add(this.tetsuoObject.quad);

        this.tetsuoObject.quad.material.transparent = true;

        if (this.props.value){
            this.tetsuoObject.addText(this.props.value);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.value !== prevProps.value){
            this.tetsuoObject.addText(this.props.value);
        }
    }

    start = () => {
        this.initTetsuo();
    };

    update = (time, deltaTime) => {
        this.tetsuoObject.update(deltaTime);
    };

}

TETSUOTextComponent.propTypes = {};
