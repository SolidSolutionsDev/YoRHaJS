import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class PlaneShaderMaterial extends React.Component {

  // TODO: add shadertoy headers and main so shader does not to be edited

  SHADER_PLAY_STATES = {
    PLAY:0,
    STOP:1,
    PAUSE:2
  };

  SHADER_DIRECTION = {
    FORWARD:0,
    BACKWARD:1
  };

  SHADER_TIME_COUNT = {
    DELTA_TIME:0,
    TIME:1,
    FRAME:2
  };

  speed = 1;
  time = 10;
  direction = this.SHADER_DIRECTION.FORWARD;
  shaderTimeCount = this.SHADER_TIME_COUNT.DELTA_TIME;
  playState = this.SHADER_PLAY_STATES.STOP;
  loop = false;
  ready = false;
  shaderText;



  //   Shader Inputs
  uniforms = {
    iResolution: { type: "v3", value: new THREE.Vector3() },                                        // viewport resolution (in pixels)
    iTime: { type: "f", value: 0 },                                                                 // shader playback time (in seconds)

    /* to confirm:
    iTimeDelta: { type: "f", value: 0 },                                                           // render time (in seconds)
    iFrame: { type: "i", value: 0 },                                                                // shader playback frame
    // how to setup the next two?
    //iChannelTime: { type: "i", value: 0 },                                                       // channel playback time (in seconds) -> uniform float iChannelTime[4]; - not a vec4 but an array of 4 floats
    //iChannelResolution: { type: "t", new THREE.Vector3();},                                       // channel resolution (in pixels) ->  uniform vec3      iChannelResolution[4]; // channel resolution (in pixels) - not a vec4 but an array of 4 floats
    */

    iMouse: { type: "v4", value: new THREE.Vector4() },                                             // mouse pixel coords. xy: current (if MLB down), zw: click
    /* to confirm:
    //how to setup next?
    //samplerXX: { type: "t", new THREE.DataTexture(data, N, N, THREE.RGBAFormat);},                // input channel. XX = 2D/Cube ->  uniform samplerXX iChannel0..3;
    iDate: { type: "v4", value: new THREE.Vector4() },
    // understand the next?
    iSampleRate: { type: "f", value: 0 },                                                           // sound sample rate (i.e., 44100)
     */
  };

  material;
  geometry;
  shaderMesh;

  start = () => {
    this.loadShader();
  };

  loadShader = ()=> {
    const { availableService,shaderURL } = this.props;
    availableService.utils.shaderLoad(shaderURL, this.shaderLoaded)
  };

  shaderLoaded = (shaderText) => {
    this.shaderText = shaderText;
    this.startShader();
  };

  startShader = (sh)=> {
    this.updateUniforms({time:10});
    this.initMaterial();
    this.initGeometry();
    this.initShaderMesh();
    this.ready = true;
  };

  stopShader = ()=> {

  };

  pauseShader = () => {

  };

  initMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: this.shaderText //pixel
    });

    this.material.transparent = true;
  };

  initGeometry = ()=> {
    this.geometry = new THREE.PlaneBufferGeometry(100, 100);
  };

  initShaderMesh = () => {
    this.shaderMesh = new THREE.Mesh(this.geometry, this.material);
    this.props.transform.add(this.shaderMesh);
  };

  updateUniforms = (time) => {
    // console.log(this.uniforms);
    this.uniforms.iTime.value =10+ time/1000;
    this.uniforms.iResolution.value.x = window.innerWidth;
    this.uniforms.iResolution.value.y = window.innerHeight;
  };

  updateMesh = () => {
    const { availableComponent } = this.props;
    const camera = availableComponent.scene.camera._main;
    this.shaderMesh.lookAt(camera.position);
  };

  update = (time) => {
    if (this.ready) {
      this.updateUniforms(time);
      this.updateMesh(time);
    }
  };

  render() {
    return null;
  }
}

PlaneShaderMaterial.propTypes = {
  transform: PropTypes.object.isRequired,
  shaderURL:PropTypes.string.isRequired,
};
