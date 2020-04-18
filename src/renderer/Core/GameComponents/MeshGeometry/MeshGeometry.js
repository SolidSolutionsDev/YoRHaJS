import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

// import OBJLoader from "three-obj-loader";
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js';


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
    const {transform, scale, materialType, materialParameters, availableService,assetId } = this.props;
    const {assetsProvider} = availableService;
    this.modelToUse = assetsProvider.getAssetById(assetId);

    if (scale) {
      this.modelToUse.scale.set(scale,scale,scale);
    }

    if (materialType || materialParameters) {
    this.materialType = materialType || this.materialType;
    this.materialToUse = this.materialTypes[this.materialType];
    this.materialInstance = new this.materialToUse(materialParameters) ;

    this.modelToUse.material = this.materialInstance;
    this.modelToUse.material.needsUpdate = true;
    }

    transform.add(this.modelToUse);
    // console.log("\nthis:",this,"\ntransform:",transform,"\nthis.modelToUse:",this.modelToUse,"\nthis.modelToUse.parent:",this.modelToUse.parent);
    this.modelToUse.position.set(0,0,0);
    return;
  };


  start = () => {
    this.modelLoad();
  };

  update = () => {};

  render() {
    return null;
  }
}

MeshGeometry.propTypes = {
  assetId: PropTypes.string.isRequired,
  scale: PropTypes.number,
  materialParameters:PropTypes.object,
  materialType:PropTypes.string
};
