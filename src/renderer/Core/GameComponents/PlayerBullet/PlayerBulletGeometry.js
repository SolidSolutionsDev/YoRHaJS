import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

// TODO: split into components to travel, create geometry, play sound, self destroy, etc (take init functions as hints)
export class PlayerBulletGeometry extends React.Component {
    cube;

    defaults = {
        color: 0xf8f9e7,
        dimensions: [1, 3, 1]
    }

    initBulletGeometry = () => {
        const {transform, opacity, color, dimensions} = this.props;
        const _dimensions = dimensions || this.defaults.dimensions
        const geometry = new THREE.BoxGeometry(..._dimensions);
        const material = new THREE.MeshBasicMaterial({color: color || this.defaults.color});
        opacity && (material.opacity = opacity);
        // material.transparent = true;
        this.cube = new THREE.Mesh(geometry, material);
        transform.add(this.cube);
    };


    start = () => {
        this.initBulletGeometry();
    };

    render() {
        return null;
    }
}

PlayerBulletGeometry.propTypes = {
    transform: PropTypes.object.isRequired,
    color: PropTypes.number,
    dimensions: PropTypes.array
};
