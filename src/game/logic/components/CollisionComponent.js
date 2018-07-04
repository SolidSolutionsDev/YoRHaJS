import TWEEN from '@tweenjs/tween.js';

import { dimensions } from '../../settings';
import * as THREE from 'three';

export const hasCollisions = ( gameObject, shape, opts ) => {

    // checkBoxWithBoxCollision
    let config = Object.assign( {

        height: 500,
        width: 500,
        space: 10,
        color: 0x0000ff,
    }, opts );

    ColliderType = {
        // sphere:
    }
    const step = config.space;
    const gridGeoRadius = (step - 0.1) / 2;

    const _physicsRepresentation = gameObject.props.getPhysicsManager().addNewSphereBody( gameObject.mesh, {
            radius: config.space,
            position: getLowerHeightPositionFromBoardDimensions( dimensions ),
            mass: Math.random() > 0.2 ? 50 : 0

        } )
        ;


    function getLowerHeightPositionFromBoardDimensions( settings ) {
        const _lines = settings.lines / 2 + 1;
        const height = -_lines * settings.scale;
        return new THREE.Vector3( 0, height, 0 );
    };


    let state = {
        // type:
        physics: _physicsRepresentation
    };

    return { collision: state };
};