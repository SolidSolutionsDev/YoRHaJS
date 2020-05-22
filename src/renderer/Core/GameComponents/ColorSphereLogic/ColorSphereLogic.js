import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";
import {sphereOptions} from "../../../../solid-solutions-backend/constants/states";
import {destroyGameObjectById} from "../../../../stores/scene/actions";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class ColorSphereLogic extends React.Component {

    sphereMeshComponent;
    sphereMesh;
    opponent;

    start = () => {
        this.sphereMeshComponent = this.props.gameObject.getComponent(this.props.meshComponentName);
        this.opponent = this.props.parent.getComponent("ColorPokemonLogic").pokemonOpponent;
        this.opponentTransform = this.opponent.props.transform;
        this.opponentPosition = this.opponent.props.transform.position;
        this.sphereMesh = this.sphereMeshComponent.mesh;
        const {transform} = this.props;
        transform.position.set(0, 0, 0);
    }

    moveSphere = (speedIndex) => {
        const {enqueueUpdateSelf,parent, transform} = this.props;
        let error = 0.1;

        //TODO: replace this by the correct method
        // alert("dont forget this");
        // reparentObject3D(this.sphereMesh, parent.opponent.mesh);


        const directionToTarget = new THREE.Vector3();
            directionToTarget.subVectors(transform.getWorldPosition(),this.opponentTransform.getWorldPosition()).normalize();

        const speed2target = new THREE.Vector3();
        speed2target.x = (Math.abs(directionToTarget.x) * speedIndex);
        speed2target.y = (Math.abs(directionToTarget.y) * speedIndex);
        speed2target.z = (Math.abs(directionToTarget.z) * speedIndex);

        const distanceToTarget = transform.getWorldPosition().distanceTo(this.opponentTransform.getWorldPosition());
        // console.log(directionToTarget,distanceToTarget,transform.rotation);
        if (Math.abs(distanceToTarget) > error) {
            transform.position.add(speed2target);
            if (this.sphereMesh.position.z>=0){
                    this.sphereMesh.position.z -= 0.1;
            }

        }
        else {
            console.log("collidded in x");
            enqueueUpdateSelf({exploding: true});
        }

    }

    scaleCheck = () => {
        const {size, sizeChangeRatio, transform} = this.props;
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
        const {rotating, attacking,  transform} = this.props;
        if (rotating && !attacking) {
            transform.rotation.y += 0.1;
        }
    }

    attackingCheck = () => {
        const { attacking, exploding, sphereSpeedIndex} = this.props;
    if (attacking && !exploding) {
            this.moveSphere(sphereSpeedIndex);
        }
    }

    addColorToOpponent = () => {
        const {color, size, parent} = this.props;
        console.log("addColorToOpponent",this.props);
        const _colorToPaint = {
            r: color.r * size,
            g: color.g * size,
            b: color.b * size,
        }
        this.opponent.addColor(_colorToPaint);

        console.log("Color added: ", {
            r: _colorToPaint.r,
            g: _colorToPaint.g,
            b: _colorToPaint.b,
        });
    }

    explodingCheck = () => {
        const {exploding, enqueueUpdateSelf, availableComponent} = this.props;
        const {scene} = availableComponent;
        if (exploding) {
            this.addColorToOpponent();
            enqueueUpdateSelf({rotating:false,exploding:false,dead: true});
            scene.enqueueAction(destroyGameObjectById(this.props.gameObject.id,this.props.parent.id));
        }
    }

    setMeshColor = () => {
        // console.log("setMeshColor");
        const color = this.props.color || sphereOptions.colors[this.props.playerNumber];
        this.props.updateGameObjectComponent(
            this.props.gameObject.id,
            [this.props.meshComponentName], {
                color:color,
            });
    }

    componentDidMount() {
        this.setMeshColor()
    }

    rgbColorDiff = (
        color1, color2
    )=> {
        if (!color1 || !color2) { return false;}
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
        this.attackingCheck();
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
    // color: PropTypes.object.isRequired,
};
