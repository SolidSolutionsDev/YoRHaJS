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
  startTime = Math.random()*10;
  direction = this.SHADER_DIRECTION.FORWARD;
  shaderTimeCount = this.SHADER_TIME_COUNT.DELTA_TIME;
  playState = this.SHADER_PLAY_STATES.STOP;
  loop = false;
  ready = false;
  fragmentShaderText;
  vertexShaderText;



  //   Shader Inputs
  uniforms = {
    uAspectRatio: {type: "f" , value: new THREE.Vector3()} ,
    uCameraPosition: {type: "v3", value: new THREE.Vector3() } ,
    uCameraOrientation: {type: "m3", value: new THREE.Matrix3() } ,
    uViewDistance: {type: "f" , value: new THREE.Vector3()} ,

    iResolution: { type: "v3", value: new THREE.Vector3() },                                        // viewport resolution (in pixels)
    iTime: { type: "f", value: 0 },                                                                 // shader playback time (in seconds)

    /* to confirm:
    iTimeDelta: { type: "f", value: 0 },                                                           // render time (in seconds)
    iFrame: { type: "i", value: 0 },                                                                // shader playback frame
    // how to setup the next two?
    //iChannelTime: { type: "i", value: 0 },                                                       // channel playback time (in seconds) -> uniform float iChannelTime[4]; - not a vec4 but an array of 4 floats
    //iChannelResolution: { type: "t", new THREE.Vector3();},                                       // channel resolution (in pixels) ->  uniform vec3      iChannelResolution[4]; // channel resolution (in pixels) - not a vec4 but an array of 4 floats
    */
    iChannel0: { type: "sampler2D", value:new THREE.Texture()},                // input channel. XX = 2D/Cube ->  uniform samplerXX iChannel0..3;

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
    const { availableService } = this.props;
    this.vertexShaderText = availableService.utils.basicVertexShader;
    this.fragmentShaderText = shaderText;
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
      vertexShader: this.vertexShaderText, //pixel
      fragmentShader: this.fragmentShaderText, //pixel,
      side: THREE.DoubleSide,
    });

    this.material.transparent = true;
  };

  initGeometry = ()=> {
    const {width, height} = this.props;
    this.geometry = new THREE.PlaneBufferGeometry(width || 100, height || 100);
  };

  initShaderMesh = () => {
    const {position, availableService} = this.props
    this.shaderMesh = new THREE.Mesh(this.geometry, this.material);
    this.props.transform.add(this.shaderMesh);
    if (position) {
        availableService.animation.travelTo(this.shaderMesh,position,2000);
    }
  };

  updateUniforms = (time) => {
    const { availableComponent,transform } = this.props;
    const { scene } = availableComponent;
    const camera = scene.camera._main;
    // console.log(this.uniforms);
    this.uniforms.iTime.value =this.startTime+ time/1000;
    this.uniforms.iResolution.value.x = window.innerWidth;
    this.uniforms.iResolution.value.y = window.innerHeight;

    //
    this.uniforms.uAspectRatio.value = camera.aspect;
    this.uniforms.uCameraPosition.value = camera.position;
    this.uniforms.uCameraOrientation.value = camera.normalMatrix;
    this.uniforms.uViewDistance.value =1;
    // console.log(camera,"\ncamera.position:",camera.position,"\ncamera.rotation:",camera.rotation);

  };

  updateMesh = () => {
    const { availableComponent,transform } = this.props;
    const { scene } = availableComponent;
    const camera = scene.camera._main;
    const sceneThree  = scene.scene;
    this.shaderMesh.rotation.x = camera.rotation.x;
    this.shaderMesh.rotation.z = camera.rotation.z;
    this.shaderMesh.rotation.y = camera.rotation.y;
    // this.shaderMesh.lookAt(camera.position);


  scene.scene.attach(this.shaderMesh);


    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    camera.matrixWorld.decompose( position, quaternion, scale );
    this.shaderMesh.quaternion.copy( quaternion );
    camera.updateMatrixWorld( true );
    this.shaderMesh.updateMatrix();

   transform.attach( this.shaderMesh);


  };


  update = (time) => {
    if (this.ready) {
      this.updateMesh(time);
      this.updateUniforms(time);
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
