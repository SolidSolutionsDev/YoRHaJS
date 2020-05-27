import React from "react";
import * as THREE from "three";
import TETSUO from "@SolidSolutionsDev/tetsuo";

export class TETSUOHeadComponent extends React.Component {

  tetsuoObject = new window.TETSUO.Premade.Face();
  mesh;

  initTetsuo = () => {

    const {transform} = this.props;
    this.mesh = this.tetsuoObject.prepare(mesh=>{
      console.log(mesh);
      transform.add(mesh)});
    console.log(this);
  }

  start = () => {
    this.initTetsuo();
  };

  update = (time, deltaTime) => {
    this.tetsuoObject.update(deltaTime);
  };

}

TETSUOHeadComponent.propTypes = {};
