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


  modelLoadedCallback = loadedModel => {
    const { normalizeSize, centerGeometry, emitLoadingAsset, availableService } = this.props;
    const { geometry } = availableService;
    const modelsToUse = loadedModel.children;
    let models = normalizeSize
      ? modelsToUse.map(geometry.resetGeometryScale)
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
