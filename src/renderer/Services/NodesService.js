import React, { Component } from "react";

import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";

import { nodes } from "../Core/Nodes";

export class NodesService extends Component {

    premades = nodes;

    getTextureFromPremade = (premade) => {

        const { renderer } = this.props.availableComponent;

        renderer.tetsuoRenderer.connectNonRootNode(premade.getNode());

        const texture = premade.getNode().output.value;
        return texture;
    }

    getMaterialFromPremade = (premade) => {

        const materialNode = new TETSUO.MaterialNode();
        const { renderer } = this.props.availableComponent;


        premade.getNode().connectTo(materialNode, "inputTex");
        renderer.tetsuoRenderer.connectNonRootNode(materialNode);

        return materialNode.material;
    }

    update = time => {
    };


    render() {
        return null;
    }
}