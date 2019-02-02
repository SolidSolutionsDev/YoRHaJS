import React, { Component } from "react";
import { GameObject } from "../GameObject";

import { isTraveler } from "../components/TravelerComponent";
import { isBall } from "../components/BallComponent";
// import { hasCollisions } from '../components/CollisionComponent';

export class BallPrefab extends GameObject {
  buildComponents = () => {
    this.parameters = this.props.parameters ? this.props.parameters : {};
    this.parameters = Object.assign({ ball: {} }, this.parameters);
    Object.assign(this, isTraveler(this.mesh));
    //Object.assign( this, hasCollisions( this, "sphere" ) );
    Object.assign(this.components, isBall(this, this.parameters.ball));
  };

  render() {
    return null;
  }
}

export default BallPrefab;
