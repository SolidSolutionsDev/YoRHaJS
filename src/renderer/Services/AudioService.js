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

  buildPositionalSound = soundPath => {
    const sound = new THREE.PositionalAudio(this.listener);
    this.audioLoader.load(soundPath, function(buffer) {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
    });
    return sound;
  };

  buildNonPositionalSound = soundPath => {
    const sound = new THREE.Audio(this.listener);
    this.audioLoader.load(soundPath, function(buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.play();
    });
    return sound;
  };

  buildAnalyserFromSound = sound => {
    const analyser = new THREE.AudioAnalyser(sound, 32);
    return analyser;
  };

  update = time => {};

  render() {
    return <div>Audio</div>;
  }
}
