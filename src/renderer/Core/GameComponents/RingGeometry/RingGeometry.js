import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class RingGeometry extends React.Component {
    mesh;

    initRing = () => {
        const { transform, innerRadius, outerRadius, thetaSegments, color, opacity, rotation } = this.props;
        const geometry = new THREE.RingGeometry(
            innerRadius || 4,
            outerRadius || 4.2,
            thetaSegments || 64
        );
        const material = new THREE.MeshBasicMaterial({
            color: color || 0x000000,
            transparent: true,
            opacity: opacity !== undefined ? opacity : 0.5,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(geometry, material);

        if (rotation) {
            if (rotation.x) this.mesh.rotation.x = rotation.x;
            if (rotation.y) this.mesh.rotation.y = rotation.y;
            if (rotation.z) this.mesh.rotation.z = rotation.z;
        }

        transform.add(this.mesh);
    };

    start = () => {
        this.initRing();
    };

    render() {
        return null;
    }
}

RingGeometry.propTypes = {
    transform: PropTypes.object.isRequired
};
