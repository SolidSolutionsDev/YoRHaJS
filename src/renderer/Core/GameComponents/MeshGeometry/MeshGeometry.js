import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class MeshGeometry extends React.Component {
  modelToUse;

  //TODO: export this to a generic acessible enum
  materialTypes = {
    basic: THREE.MeshBasicMaterial,
    standard: THREE.MeshStandardMaterial
  };

  materialType = "basic";
  materialToUse;
  materialInstance;

  modelLoad = () => {
    const {
      transform,
      scale,
      materialType,
      materialParameters,
      availableService,
      assetId,
      doubleSide
    } = this.props;
    const { assetsProvider } = availableService;
    this.modelToUse = assetsProvider.getAssetById(assetId);

    if (scale) {
      this.modelToUse.scale.set(scale, scale, scale);
    }
    if (this.modelToUse.geometry) {
      if (materialType || materialParameters) {
        this.materialType = materialType || this.materialType;
        this.materialToUse = this.materialTypes[this.materialType];
        this.materialInstance = new this.materialToUse(materialParameters);

        this.modelToUse.material = this.materialInstance;
      }

      this.modelToUse.material.side = this.props.doubleSide
        ? THREE.DoubleSide
        : this.modelToUse.material.side;
      this.modelToUse.material.transparent = this.props.transparent
        ? THREE.DoubleSide
        : this.modelToUse.material.transparent;
      this.modelToUse.material.needsUpdate = true;
      // console.log(this.modelToUse);

      this.modelToUse.geometry.center();
    }
    transform.add(this.modelToUse);
    // console.log("\nthis:",this,"\ntransform:",transform,"\nthis.modelToUse:",this.modelToUse,"\nthis.modelToUse.parent:",this.modelToUse.parent);

    this.modelToUse.position.set(0, 0, 0);
  };

  start = () => {
    this.modelLoad();
  };

  update = (time, delta) => {
    // if (this.modelToUse && this.modelToUse.skeleton){
    //   this.modelToUse.skeleton.bones.forEach((bone,index)=> {
    //     const ind= index+1;
    //     // bone.rotation.x = Math.sin(time / (1000*ind)) * (Math.cos(ind) / 10);
    //     bone.rotation.y = Math.cos(time / (100000/ind)) * (Math.sin(ind/20));
    //   })
    //   }
  };

  render() {
    return null;
  }
}

MeshGeometry.propTypes = {
  assetId: PropTypes.string.isRequired,
  scale: PropTypes.number,
  materialParameters: PropTypes.object,
  materialType: PropTypes.string
};
