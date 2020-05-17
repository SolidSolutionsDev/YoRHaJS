import React from "react";
import PropTypes from "prop-types";

import * as CANNON from "cannon";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class ColorSphereLogic extends React.Component {

    sphereMeshComponent;
    sphereMesh;
    speed2target = {};

    start = () => {
        this.sphereMeshComponent = this.props.gameObject.getComponent(this.props.meshComponentName);
        this.sphereMesh = this.sphereMeshComponent.mesh;
        const {transform} = this.props;
        transform.position.set(0, 0, 0);
    }

    moveSphere = (speedIndex) => {
        const {enqueueUpdateSelf,parent} = this.props;
        let error = 0.01;

        //TODO: replace this by the correct method
        alert("dont forget this");
        // reparentObject3D(this.sphereMesh, parent.opponent.mesh);

        if (!this.speed2target.x) {
            let max = Math.max(
                Math.abs(this.sphereMesh.position.x),
                Math.abs(this.sphereMesh.position.y),
                Math.abs(this.sphereMesh.position.z)
            );
            this.speed2target.x = (Math.abs(this.sphereMesh.position.x) * speedIndex) / max;
            this.speed2target.y = (Math.abs(this.sphereMesh.position.y) * speedIndex) / max;
            this.speed2target.z = (Math.abs(this.sphereMesh.position.z) * speedIndex) / max;
        }

        if (this.sphereMesh.position.x > error) {
            this.sphereMesh.position.x -= this.speed2target.x;
        } else if (this.sphereMesh.position.x < -error) {
            this.sphereMesh.position.x += this.speed2target.x;
        } else {
            console.log("collidded in x");

            enqueueUpdateSelf({exploding: true});
        }

        if (this.sphereMesh.position.y > +error) {
            this.sphereMesh.position.y -= this.speed2target.y;
        } else if (this.sphereMesh.position.y < -error) {
            this.sphereMesh.position.y += this.speed2target.y;
        } else {
            console.log("collidded in y");

            enqueueUpdateSelf({exploding: true});
        }

        if (this.sphereMesh.position.z > +error) {
            this.sphereMesh.position.z -= this.speed2target.z;
        } else if (this.sphereMesh.position.z < -error) {
            this.sphereMesh.position.z += this.speed2target.z;
        } else {
            console.log("collidded in z");

            enqueueUpdateSelf({exploding: true});
        }
    }

    scaleCheck = () => {
        const {size, sizeChangeRatio, transform} = this.props;
        console.log(size);
            transform.scale.set(
                size,
                size,
                size,
            );

    }

    initCheck = () => {
        const {initing, enqueueUpdateSelf} = this.props;
        if (initing) {
            if (this.sphereMesh.position.z < 4) {
                this.sphereMesh.position.z += 0.1;
            } else {
                enqueueUpdateSelf({initing: false});
            }
        }
    }

    rotatingCheck = () => {
        const {rotating, attacking, exploding, transform, sphereSpeedIndex} = this.props;
        if (rotating && !attacking) {
            transform.rotation.y += 0.1;
        } else if (attacking && !exploding) {
            this.moveSphere(sphereSpeedIndex);
        }
    }

    addColorToOpponent = () => {
        const {color, size, parent} = this.props;
        const _colorToPaint = {
            r: color.r * size,
            g: color.g * size,
            b: color.b * size,
        }
        parent.oponentLogic.addColor(_colorToPaint);

        console.log("Color added: ", {
            r: _colorToPaint.r,
            g: _colorToPaint.g,
            b: _colorToPaint.b,
        });
    }

    explodingCheck = () => {
        const {exploding, enqueueUpdateSelf} = this.props;
        if (exploding) {
            this.addColorToOpponent();
            enqueueUpdateSelf({dead: true});
        }
    }

    setMeshColor = () => {
        console.log("setMeshColor");
        this.props.updateGameObjectComponent(
            this.props.gameObject.id,
            [this.props.meshComponentName], {
                color:this.props.color,
            });
    }

    componentDidMount() {
        this.setMeshColor()
    }

    rgbColorDiff = (
        color1, color2
    )=> {
        return (color1.r !== color2.r) && (color1.g !== color2.g) &&  (color1.b !== color2.b)
    }

    componentDidUpdate = (prevProps, prevState, snapshot) =>{
        const colorDiff = this.rgbColorDiff(this.props.color, prevProps.color);
        // console.log(this.props.color, prevProps.color,colorDiff,this.props.gameObject.id);
        if (colorDiff) {
            this.setMeshColor();
        }
    }

    update = (time, deltaTime) => {

        const {dead} = this.props;
        if (dead) {
            return;
        }
        this.scaleCheck();
        this.initCheck();
        this.rotatingCheck();
        this.explodingCheck();
    }
}

ColorSphereLogic.propTypes = {
    initing: PropTypes.bool.isRequired,
    rotating: PropTypes.bool.isRequired,
    attacking: PropTypes.bool.isRequired,
    exploding: PropTypes.bool.isRequired,
    dead: PropTypes.bool.isRequired,
    size: PropTypes.number.isRequired,
    sizeChangeRatio: PropTypes.number.isRequired,
    meshComponentName: PropTypes.string.isRequired,
    sphereSpeedIndex: PropTypes.number.isRequired,
    opponentId: PropTypes.string.isRequired,
    color: PropTypes.object.isRequired,
};
