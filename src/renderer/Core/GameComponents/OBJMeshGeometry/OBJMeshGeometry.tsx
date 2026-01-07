import React from "react";
// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import OBJLoader from "three-obj-loader";
// @ts-ignore
import FBXLoader from "three-fbx-loader";

OBJLoader(THREE);

interface OBJMeshGeometryProps {
  modelInputData: {
    assetURL: string;
  };
  transform: any; // THREE.Object3D
}

export class OBJMeshGeometry extends React.Component<OBJMeshGeometryProps> {
  transform = new THREE.Object3D();

  defaultMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });

  _resetGeometryScale = (modelToResetScale: any) => {
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
    modelToResetScale.geometry.center();

    return modelToResetScale;
  };

  modelLoadedCallback = (loadedModel: any) => {
    // FBX loader returns a Group or Object3D
    // OBJ loader returns a Group
    const modelToUse = loadedModel.children ? loadedModel.children[0] : loadedModel;
    if (modelToUse) {
      if (modelToUse.material) {
        modelToUse.material = this.defaultMaterial;
        modelToUse.material.needsUpdate = true;
      }

      const scaledModel = this._resetGeometryScale(modelToUse);
      this.transform.add(scaledModel);
    } else {
      // Direct geometry from FBX sometimes? 
      // Logic kept from original as much as possible, focusing on children[0]
      // But FBX might just be the object.
      this.transform.add(loadedModel);
    }
  };

  _loadFBX = (assetURL: string) => {
    const loader = new FBXLoader();
    loader.load(assetURL, this.modelLoadedCallback);
  };

  _loadOBJ = (assetURL: string) => {
    // @ts-ignore
    const loader = new THREE.OBJLoader();
    loader.load(assetURL, this.modelLoadedCallback);
  };

  loadModel = () => {
    const { modelInputData } = this.props;
    const splitedUrl = modelInputData.assetURL.split(".");
    const extension = splitedUrl[splitedUrl.length - 1];

    switch (extension) {
      case "fbx":
        this._loadFBX(modelInputData.assetURL);
        break;
      case "obj":
        this._loadOBJ(modelInputData.assetURL);
        break;
      default:
        this._loadOBJ(modelInputData.assetURL);
    }
  };

  start = () => {
    const { transform } = this.props;
    this.loadModel();
    transform.add(this.transform);
  };

  update = () => { };

  render() {
    return null;
  }
}

