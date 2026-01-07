import React from "react";
import * as THREE from "three";

interface SpriteComponentProps {
  spriteUrl: string;
  transform: any; // THREE.Object3D
}

export class SpriteComponent extends React.Component<SpriteComponentProps> {
  sprite: THREE.Sprite | undefined;

  loadSprite = () => {
    const { spriteUrl, transform } = this.props;

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

  update = () => { };

  render() {
    return null;
  }
}

