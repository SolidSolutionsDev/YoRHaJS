import React, { Component } from "react";

import * as THREE from "three";

export class UtilsService extends Component {

  shaderLoad(ShaderURL, onLoad, onProgress, onError) {
      const loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
      loader.setResponseType('text');
      loader.load(ShaderURL, function (shaderText) {
        onLoad(shaderText);
      }, onProgress, onError);
  }

  update = time => {
  };


  render() {
    return null;
  }
}
