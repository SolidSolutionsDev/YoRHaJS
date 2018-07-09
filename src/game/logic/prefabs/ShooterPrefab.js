import React, { Component } from 'react';
import { GameObject } from '../GameObject';
import { isShooter } from "../components/ShooterComponent";
import { isTraveler } from "../components/TravelerComponent";

export class ShooterPrefab extends GameObject {


    buildComponents = () => {
        this.parameters = this.props.parameters ? this.props.parameters : {};
        this.parameters = Object.assign( { shooter: {} }, this.parameters );
        Object.assign( this.components, isShooter( this, this.parameters.shooter ) );
        Object.assign( this, isTraveler( this.mesh ) );
    }



    initComponents() {
        //this.mesh.add( this.components.skybox.mesh );
    }

    update = ()=> {
        // this.mesh.rotation.z += 0.1;
    }

    render() {
        return null;
    }
}