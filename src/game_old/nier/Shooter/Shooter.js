import React, { Component } from "react";
import { ShooterGeometryComponent } from "./ShooterGeometryComponent";
import { ShooterControlsComponent } from "./ShooterControlsComponent";

export default class Shooter extends Component {
  shooter;
  shooterPhysics;

  addShooter = shooter => {
    this.shooter = shooter;
    console.info(shooter.component.mesh);
    this.shooter.physicsObject = this.props
      .getPhysicsService()
      // addNewBoxBody( shooter.component.mesh,
      //     this.props, shooter.component );
      .addNewBoxBody(this.props.pivot, this.props, shooter.component);
  };

  render = () => {
    // return <div key="div">board</div>;
    return (
      <div key="div">
        board
        <ShooterGeometryComponent
          key="shooter"
          ref={this.addShooter}
          {...this.props}
        />
        <ShooterControlsComponent {...this.props} />
      </div>
    );
  };
}
