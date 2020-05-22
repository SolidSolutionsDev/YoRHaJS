import React from "react";
import PropTypes from "prop-types";
import {rgb2xy} from "../../../../utils/unitConvertUtils";
import {drawCircleOnCanvas} from "../../../../utils/canvasUtils";

import "./ColorIndicator.css";

export class ColorIndicator extends React.Component {
    mainDiv;
    canvas;
    indicator;
    inited;

    start = () => {
        this.initMainDiv();
        this.initColorCircleCanvas();
        this.initColorCircleIndicator();
    };

    initMainDiv = () => {
        this.mainDiv = document.createElement("div");
        this.mainDiv.className = "colorCanvas color-battle-player-indicator";
        this.attachMenu(this.mainDiv);
    };

    initColorCircleCanvas = () => {
        const id = this.props.gameObject.id;
        this.canvas =  document.createElement("canvas");
        this.canvas.width ="100";
        this.canvas.height ="100";
        this.canvas.id=`${id}_colorCanvas`;
        this.mainDiv.appendChild(this.canvas);
        this.canvas = drawCircleOnCanvas(this.canvas);
    };

    initColorCircleIndicator = () => {
        const id = this.props.gameObject.id;
        this.indicator =  document.createElement("div");
        this.indicator.id=`${id}indicator`;
        this.indicator.className=`indicator`;
        this.indicator.innerHTML = "O";
        this.mainDiv.appendChild(this.indicator);
        this.updateIndicator();
    };

    attachMenu = (menuDiv) => {
        const {gameObject} = this.props;
        this.cssGameComponent = gameObject.getComponent(
            "CSSLabelTo3D"
        );
        this.cssGameComponent.attachDiv(menuDiv);
    };

    updateIndicator = () => {
        const {color} = this.props;
        if (!color || !this.indicator) {
            return;
        }
        const newPosition = rgb2xy(color.r, color.g, color.b);
        // console.log("new indicator position:",newPosition,this,color,this.indicator);
        this.indicator.style.left = this.canvas.offsetLeft - 4 - newPosition.x + 50 + "px";
        this.indicator.style.top = this.canvas.offsetTop - newPosition.y + 50 + "px";
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateIndicator();
    }

    update = () => {

    }
}

ColorIndicator.propTypes = {
    color:PropTypes.shape({r:PropTypes.number,g:PropTypes.number,b:PropTypes.number}),
};
