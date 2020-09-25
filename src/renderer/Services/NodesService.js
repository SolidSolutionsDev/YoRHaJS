import React, { Component } from "react";

import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";

import { nodes } from "../Core/Nodes";

export class NodesService extends Component {

    nodes = nodes;

    getTextureFromPremade = (node) => {

        const { renderer } = this.props.availableComponent;

        renderer.tetsuoRenderer.connectNonRootNode(node.getNode());

        const texture = node.getNode().output.value;
        return texture;
    }

    getMaterialFromPremade = (node) => {

        const materialNode = new TETSUO.MaterialNode();
        const { renderer } = this.props.availableComponent;


        node.getNode().connectTo(materialNode, "inputTex");
        renderer.tetsuoRenderer.connectNonRootNode(materialNode);

        return materialNode.material;
    }

    update = time => {
    };


    render() {
        return null;
    }
}