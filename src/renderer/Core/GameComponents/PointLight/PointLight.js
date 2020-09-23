import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class PointLight extends React.Component {
    light;

    initLight = () => {
        const {transform} = this.props;
        this.light = new THREE.PointLight(0xffffff, 1);
        transform.add(this.light);
    };

    start = () => {
        this.initLight();
        this.updateLight();
    };

    updateLight = () => {
        const {castShadow, color, intensity, distance} = this.props;

        if (castShadow) {
            this.light.castShadow = true;
            this.light.shadow.mapSize = new THREE.Vector2(1024, 1024);
        }

        if (color) {
            this.light.color.setHex(color);
        }

        if (intensity) {
            this.light.intensity = intensity;
        }

        if (distance) {
            this.light.distance = distance;
        }
    };

    update = () => {
    };

    render() {
        return null;
    }
}

PointLight.propTypes = {
    transform: PropTypes.object.isRequired
};
