import React from "react";
import PropTypes from "prop-types";

import * as THREE from "three";

export class ObjectLoaderMesh extends React.Component {
  transform = new THREE.Object3D();

  startedLoading = false;
  loaded = false;

  // TODO: Create geometry uniformize component
  // TODO2: compute groups scale
  _centerGeometry = modelToResetScale => {
    // Set the current center
    modelToResetScale.geometry.center();

    return modelToResetScale;
  };

  // TODO: Create geometry uniformize component
  // TODO2: compute groups scale
  _resetGeometryScale = modelToResetScale => {
    // Compute and Get the Bounding Box
    modelToResetScale.geometry.computeBoundingBox();
    const boundingBox = modelToResetScale.geometry.boundingBox.clone();

    // Set an array with the distance of each edge
    const edgeSizes = [
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z
    ];

    // Get the bigger edge
    const biggerEdge = Math.max(...edgeSizes);

    // Get the Scale value from the default Box (1, 1, 1) to this Model
    const scaleToSet = 1 / biggerEdge;

    // Do scale!
    modelToResetScale.geometry.scale(scaleToSet, scaleToSet, scaleToSet);

    // Set the current center
    // modelToResetScale.geometry.center();

    return modelToResetScale;
  };

  modelLoadedCallback = loadedModel => {
    const { normalizeSize, centerGeometry, emitLoadingAsset } = this.props;
    const modelsToUse = loadedModel.children;
    let models = normalizeSize
      ? modelsToUse.map(this._resetGeometryScale)
      : modelsToUse;

    models = centerGeometry ? models.map(this._centerGeometry) : models;

    this.transform.add(...models);

    this.loaded = true;
    // eslint-disable-next-line no-unused-expressions
    emitLoadingAsset ? emitLoadingAsset(this.filename, 1.0) : null;
  };

  modelLoadingCallback = xhr => {
    // const { emitLoadingAsset } = this.props;
    // emitLoadingAsset ? emitLoadingAsset(this.filename, xhr.loaded / xhr.total):null ;
    // console.log(`${this.filename} ${(xhr.loaded / xhr.total) * 100}% loaded`);
  };

  modelErrorCallback = err => {
    console.error("An error happened", err);
  };

  _loadObject = assetURL => {
    if (!assetURL) {
      return;
    }

    const loader = new THREE.ObjectLoader();
    loader.load(
      assetURL,
      this.modelLoadedCallback,
      this.modelLoadingCallback,
      this.modelErrorCallback
    );
  };

  loadModel = () => {
    const { assetURL } = this.props;

    if (!assetURL) {
      return;
    }

    const splitedUrl = assetURL && assetURL.split(".");
    const extension = splitedUrl[splitedUrl.length - 1];

    const splitedInBarsUrl = assetURL && assetURL.split("/");
    this.filename = splitedInBarsUrl[splitedInBarsUrl.length - 1];

    if (extension !== "json") {
      alert(
        `ObjectLoaderMesh component error: ${assetURL} is not JSON file. Ignored.`
      );
    }
    this._loadObject(assetURL);
  };

  start = () => {
    const { transform } = this.props;
    transform.add(this.transform);
  };

  update = () => {
    if (!this.startedLoading) {
      this.startedLoading = true;
      this.loadModel();
    }
  };

  render() {
    return null;
  }
}

ObjectLoaderMesh.propTypes = {
  assetURL: PropTypes.string.isRequired,
  transform: PropTypes.object.isRequired,
  normalizeSize: PropTypes.bool,
  centerGeometry: PropTypes.bool,
  emitLoadingAsset: PropTypes.func
};
