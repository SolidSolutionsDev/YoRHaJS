import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import * as _ from "lodash";

export class AutoRotate extends React.Component {

    speed= {
        x:0,
        y:0,
        z:0
    };

    acceleration= {
        x:0,
        y:0,
        z:0
    };

    updateSpeed = () => {
        const {speed} = this.props;
        if (!speed) {return};
        Object.keys(speed).forEach((key) => {
            this.speed[key] = speed[key];
        })
    };

    updateAcceleration = () => {
        const {acceleration} = this.props;
      if (!acceleration) {return};
        Object.keys(acceleration).forEach((key) => {
            this.acceleration[key] = acceleration[key];
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(this.props.speed, prevProps.speed)) {
            this.updateSpeed();
        }
        if (!_.isEqual(this.props.acceleration, prevProps.acceleration)) {
            this.updateAcceleration();
        }
    }

    updateVariables = () => {
        const {transform} = this.props;
        //updates speed if there is acceleration
        Object.keys(this.acceleration)
            .filter((accelerationCoordinate) => {
                return this.acceleration[accelerationCoordinate] !== 0;
            })
            .forEach((accelerationCoordinate) => {
                this.speed[accelerationCoordinate] += this.acceleration[accelerationCoordinate];
            });

        //updates object rotation
        Object.keys(this.speed)
            .filter((speedCoordinate) => {
                return this.speed[speedCoordinate] !== 0;
            })
            .forEach((speedCoordinate) => {
                transform.rotation[speedCoordinate] += this.speed[speedCoordinate];
            });

    };

    start = () => {
      this.updateSpeed();
      this.updateAcceleration();
    };

    update = () => {
        this.updateVariables();
    };

    render() {
        return null;
    }
}

AutoRotate.propTypes = {
    transform: PropTypes.object.isRequired,
    speed: PropTypes.object,
    acceleration: PropTypes.object
};
