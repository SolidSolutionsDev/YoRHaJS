import React, { Component } from "react";

import * as THREE from "three";

export class UtilsService extends Component {



  shaderLoad(ShaderURL, onLoad, onProgress, onError) {

      const shaderToyHeader =
          //"#version 300 es\n" +
          // "#ifdef GL_ES\n" +
          // "    precision highp float;\n" +
          // "    precision highp int;\n" +
          // "    precision mediump sampler3D;\n" +
          // "#endif\n" +
          "#define HW_PERFORMANCE 1\n" +
          "uniform vec3      iResolution;\n" +
          "uniform float     iTime;\n" +
          "uniform float     iChannelTime[4];\n" +
          "uniform vec4      iMouse;\n" +
          "uniform vec4      iDate;\n" +
          "uniform float     iSampleRate;\n" +
          "uniform vec3      iChannelResolution[4];\n" +
          "uniform int       iFrame;\n" +
          "uniform float     iTimeDelta;\n" +
          "uniform float     iFrameRate;\n" +
          "uniform sampler2D iChannel0;\n" +
          "uniform struct {\n" +
          "    sampler2D sampler;\n" +
          "    vec3  size;\n" +
          "    float time;\n" +
          "    int   loaded;\n" +
          "}\n" +
          "iCh0;\n" +
          "uniform sampler2D iChannel1;\n" +
          "uniform struct {\n" +
          "    sampler2D sampler;\n" +
          "    vec3  size;\n" +
          "    float time;\n" +
          "    int   loaded;\n" +
          "}\n" +
          "iCh1;\n" +
          "uniform sampler2D iChannel2;\n" +
          "uniform struct {\n" +
          "    sampler2D sampler;\n" +
          "    vec3  size;\n" +
          "    float time;\n" +
          "    int   loaded;\n" +
          "}\n" +
          "iCh2;\n" +
          "uniform sampler2D iChannel3;\n" +
          "uniform struct {\n" +
          "    sampler2D sampler;\n" +
          "    vec3  size;\n" +
          "    float time;\n" +
          "    int   loaded;\n" +
          "}\n" +
          "iCh3;\n" +
          "void mainImage( out vec4 c, in vec2 f );\n";

      const shaderToyFooter = "\n" +
          // "out vec4 outColor;\n" +
          "void main( void ) {\n" +
          "    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n" +
          "    mainImage( color, gl_FragCoord.xy );\n" +
          "    color.w = 1.0;\n" +
          "    gl_FragColor = color;\n" +
          "     if(gl_FragColor == vec4 (0.0,0.0,0.0,1.0)) {\n" +
          "        gl_FragColor.a = 0.5;\n" +
          "    } \n" +
          "}\n";

      const loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
      loader.setResponseType('text');
      loader.load(ShaderURL, function (shaderText) {
          const composedShaderText = shaderToyHeader + shaderToyFooter + shaderText ;
        onLoad(composedShaderText);
      }, onProgress, onError);
  }

  update = time => {
  };


  render() {
    return null;
  }
}
