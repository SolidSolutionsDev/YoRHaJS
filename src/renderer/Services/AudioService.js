import React, { Component } from "react";

import * as THREE from "three";

export class AudioService extends Component {
  attribs = {
    distance: 10,
    backgroundMusic: {}
  };
  // mesh = new THREE.PerspectiveCamera( this.attribs.fov, this.attribs.aspect, this.attribs.near, this.attribs.far );

    listener = new THREE.AudioListener();
    audioLoader = new THREE.AudioLoader();
    cameraWithListener;
    availableAudio = {};

  componentDidMount() {}

  componentDidUpdate = () => {
    this.setupListenerOnCamera();
  };

  setupListenerOnCamera = () => {
    const { availableComponent } = this.props;
    const { scene } = availableComponent;
    if (
      scene.camera &&
      scene.camera._main &&
      this.cameraWithListener !== scene.camera._main
    ) {
      scene.camera._main.add(this.listener);
      this.cameraWithListener = scene.camera._main;
    }
  };

  buildPositionalSound = (assetId, tagName, analyser) => {
    const { assetsProvider } = this.props.availableService;
    const sound = new THREE.PositionalAudio(this.listener);
    const buffer = assetsProvider.getAssetById(assetId);
      sound.setBuffer(buffer);
      sound.setRefDistance(20);

    this.availableAudio[tagName] = { sound: sound };
    if (analyser) {
      this.buildAnalyserFromSound(tagName);
    }
    return this.availableAudio[tagName];
  };

  buildNonPositionalSound = (assetId, tagName, analyser) => {
    const { assetsProvider } = this.props.availableService;
    const sound = new THREE.Audio(this.listener);
    const buffer = assetsProvider.getAssetById(assetId);
    // console.log(this,sound,buffer);
    sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.play();

    this.availableAudio[tagName] = { sound: sound };
    if (analyser) {
      this.buildAnalyserFromSound(tagName);
    }
    return this.availableAudio[tagName];
  };

  buildAnalyserFromSound = tagName => {
    const sound = this.availableAudio[tagName].sound;
    const analyser = new THREE.AudioAnalyser(sound, 32);

    this.availableAudio[tagName].analyser = analyser;
    return analyser;
  };

  update = time => {};

  render() {
    return null;
  }
}
