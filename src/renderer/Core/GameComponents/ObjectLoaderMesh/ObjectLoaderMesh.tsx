import React from "react";
import * as THREE from "three";

interface ObjectLoaderMeshProps {
  assetURL: string;
  transform: any;
  normalizeSize?: boolean;
  centerGeometry?: boolean;
  emitLoadingAsset?: (filename: string, progress: number) => void;
}

export class ObjectLoaderMesh extends React.Component<ObjectLoaderMeshProps> {
  transform = new THREE.Object3D();

  startedLoading = false;
  loaded = false;
  filename: string = "";

  // TODO: Create geometry uniformize component
  // TODO2: compute groups scale
  _centerGeometry = (modelToResetScale: any) => {
    // Set the current center
    // Check if it's geometry or bufferGeometry
    if (modelToResetScale.geometry) {
      modelToResetScale.geometry.center();
    }
    return modelToResetScale;
  };

  // TODO: Create geometry uniformize component
  // TODO2: compute groups scale
  _resetGeometryScale = (modelToResetScale: any) => {
    if (!modelToResetScale.geometry) return modelToResetScale;

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

  modelLoadedCallback = (loadedModel: THREE.Object3D) => {
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

  modelLoadingCallback = (_xhr: ProgressEvent) => {
    // const { emitLoadingAsset } = this.props;
    // emitLoadingAsset ? emitLoadingAsset(this.filename, xhr.loaded / xhr.total):null ;
    // console.log(`${this.filename} ${(xhr.loaded / xhr.total) * 100}% loaded`);
  };

  modelErrorCallback = (err: any) => {
    console.error("An error happened", err);
  };

  _loadObject = (assetURL: string) => {
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

