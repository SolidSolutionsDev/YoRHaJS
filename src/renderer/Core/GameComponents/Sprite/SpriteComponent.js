import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class SpriteComponent extends React.Component {
    sprite;

    loadSprite = () => {
        const {spriteUrl, transform} = this.props;

        const spriteMap = new THREE.TextureLoader().load(spriteUrl);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
            color: 0xffffff
        });
        this.sprite = new THREE.Sprite(spriteMaterial);
        transform.add(this.sprite);
    };

    start = () => {
        this.loadSprite();
    };

    update = () => {
    };

    render() {
        return null;
    }
}

SpriteComponent.propTypes = {
    spriteUrl: PropTypes.string.isRequired,
    transform: PropTypes.object.isRequired
};
