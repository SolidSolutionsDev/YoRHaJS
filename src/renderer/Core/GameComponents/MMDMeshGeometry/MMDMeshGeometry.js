import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

// import OBJLoader from "three-obj-loader";
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader.js';


export class MMDMeshGeometry extends React.Component {
  modelToUse;

  //TODO: export this to a generic acessible enum
  materialTypes = {
    basic: THREE.MeshBasicMaterial,
    standard: THREE.MeshStandardMaterial
  };

  materialType = "basic";
  materialToUse;
  materialInstance;

  modelLoadedCallback = loadedModel => {
    const {transform, scale, materialType, materialParameters } = this.props;
    this.modelToUse = loadedModel;

    // this.modelToUse.rotateX(Math.PI/2);
    console.log(this);

    // this.transform.add(modelToUse);
    transform.add(this.modelToUse);

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

    return;
  };

  _loadMMD = assetURL => {
    const loader = new MMDLoader();
    loader.load(assetURL, this.modelLoadedCallback);
  };

  loadModel = () => {
    const { modelInputData, assetURL } = this.props;
    const splittedUrl = assetURL.split(".");
    const extension = splittedUrl[splittedUrl.length - 1];

    this._loadMMD(assetURL)
  };

  start = () => {
    const { transform } = this.props;
    this.loadModel();
    transform.add(this.transform);
  };

  update = () => {};

  render() {
    return null;
  }
}

MMDMeshGeometry.propTypes = {
  assetURL: PropTypes.string.isRequired,
  scale: PropTypes.number,
  materialParameters:PropTypes.object,
  materialType:PropTypes.string
};
