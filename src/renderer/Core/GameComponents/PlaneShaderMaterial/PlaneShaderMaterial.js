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
    uSoundFrequencyMatrix: {type: "m4" , value: new THREE.Matrix4()} ,
    uSoundFrequencyAverage: {type: "f" , value: 0} ,

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
  mesh;

  start = () => {
    this.loadShader();
  };

  loadShader = ()=> {
    const { availableService,shaderURL } = this.props;
    availableService.shader.shaderLoad(shaderURL, this.shaderLoaded)
  };

  shaderLoaded = (shaderText) => {
    const { availableService } = this.props;
    this.vertexShaderText = availableService.shader.basicVertexShader;
    this.fragmentShaderText = shaderText;
    this.startShader();
  };

  startShader = ()=> {
    this.initUniforms();
    this.initMaterial();
    this.initGeometry();
    this.initExplode();
    this.initShaderMesh();
    // this.updateUniforms({time:10});
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
    this.geometry = new THREE.PlaneGeometry(width || 100, height || 100);

  };

  initShaderMesh = () => {
    const {position, availableService} = this.props;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.props.transform.add(this.mesh);
    if (position) {
        availableService.animation.travelTo(this.mesh,position,2000);
    }

  };

  // TODO: extract explode to a GameComponent
  initExplode = ()=> {
      const {explode,availableService } = this.props;
      if ( explode ) {
          this.uniforms.amplitude = {type:"f", value: 0};
          this.geometry = availableService.geometry.generateExplodableBufferGeometryFromGeometry(this.geometry, explode.directionFunction, explode.maxEdgeLength, explode.tessellateIterations);
          this.vertexShaderText = availableService.shader.explosionVertexShader;
          this.initMaterial();
      }
  };

  initUniforms = () => {
    // TODO: to init custom uniforms from state
  }

  updateUniforms = (time) => {
    const { availableComponent, availableService, audioTag, explode } = this.props;
    const { scene } = availableComponent;
    const { audio } = availableService;
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
    const audioObject = audio.availableAudio[audioTag];

      // console.log(audioObject);
    if (audioObject && audioObject.analyser){
        this.uniforms.uSoundFrequencyAverage.value = audioObject.analyser.getAverageFrequency();
        this.uniforms.uSoundFrequencyMatrix.value = audioObject.analyser.getFrequencyData();
    }
      // console.log(audioObject);
    if (explode){
        const audioMultiplier = explode.audioTag ? audio.availableAudio[audioTag].analyser.getAverageFrequency()/255:1.0;
        this.uniforms.amplitude.value = audioMultiplier*Math.sin( time * explode.timeScale)*explode.distance;
    }
  };

  updateMesh = () => {
    const {hardLookAtCamera} = this.props;
    if (hardLookAtCamera) {
      this.hardLookAtCamera();
    }
  };

  hardLookAtCamera() {
    const {availableComponent, availableService} = this.props;
    const {scene} = availableComponent;
    const {geometry} = availableService;
    const camera = scene.camera._main;

    geometry.hardLookAt(this.mesh, camera);
  }

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
