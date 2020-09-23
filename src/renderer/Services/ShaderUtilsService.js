import React, {Component} from "react";

import * as THREE from "three";

export class ShaderUtilsService extends Component {

    crtShaderPass = "varying vec2 vUv;\n" +
        "uniform sampler2D inputTex;\n" +
        "uniform float iTime;\n" +
        "\n" +
        "float gradient(vec2 p) {\n" +
        "    return 1. - length(p / 3.);\n" +
        "}\n" +
        "\n" +
        "float scanline(vec2 p) {\n" +
        "    float s = 1. - abs(sin(iTime * 2. + p.y * 3.));\n" +
        "    return s > 0.7 ? s : 0.;\n" +
        "}\n" +
        "\n" +
        "float smallline(vec2 p) {\n" +
        "    return abs(sin(iTime * 5. - p.y * 450.) * 0.9);\n" +
        "}\n" +
        "\n" +
        "vec2 curve(vec2 p) {\n" +
        "    p = (p - 0.5) * 2.0;\n" +
        "    p *= 1.1;    \n" +
        "    p.x *= 1.0 + pow((abs(p.y) / 5.0), 2.0);\n" +
        "    p.y *= 1.0 + pow((abs(p.x) / 4.0), 2.0);\n" +
        "    p  = (p / 2.0) + 0.5;\n" +
        "    p =  p * 0.92 + 0.04;\n" +
        "    return p;\n" +
        "}\n" +
        "\n" +
        "void main() {\n" +
        "    vec2 p = curve(vUv);\n" +
        "    vec4 t = texture2D(inputTex, p);  \n" +
        "    gl_FragColor = mix(t, (t  + scanline(p) * 0.02 - smallline(p) * 0.02) * gradient((p - 0.5) * 2.), t.a);\n" +
        "}";

    basicVertexShader = "" +
        "varying vec2 vPosition;\n" +
        "void main() {\n" +
        "      vPosition = uv;\n" +
        "      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n" +
        "  }";

    explosionVertexShader = "" +
        "uniform float amplitude;\n" +
        "attribute vec3 displacement;\n" +
        "varying vec2 vPosition;\n" +
        "void main() {\n" +
        "      vPosition = uv;\n" +
        "      if (amplitude > .0){\n" +
        "           vec3 explodedPosition = position + normal * amplitude * displacement;\n" +
        "           gl_Position = projectionMatrix * modelViewMatrix * vec4( explodedPosition, 1.0 );\n" +
        "       }\n" +
        "       else {\n" +
        "           gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n" +
        "       };\n" +
        "  }";

    shaderToyLoad(shaderAssetID) {
        const {availableService} = this.props;
        const {assetsProvider} = availableService;

        const shaderToyHeader =
            //"#version 300 es\n" +
            // "#ifdef GL_ES\n" +
            // "    precision highp float;\n" +
            // "    precision highp int;\n" +
            // "    precision mediump sampler3D;\n" +
            // "#endif\n" +
            "#define HW_PERFORMANCE 1\n" +
            "varying vec2 vPosition;\n" +
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
            "uniform float uAspectRatio;\n" +
            "uniform vec3 uCameraPosition;\n" +
            "uniform mat3 uCameraOrientation;\n" +
            "uniform float uViewDistance;\n" +
            "uniform mat4 uSoundFrequencyMatrix;\n" +
            "uniform float uSoundFrequencyAverage;\n" +
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
            "        gl_FragColor.a = 0.0;\n" +
            "    } \n" +
            "}\n";

        const shaderText = assetsProvider.getAssetById(shaderAssetID);
        const composedShaderText = shaderToyHeader + shaderToyFooter + shaderText;
        return composedShaderText;
    }

    update = time => {
    };


    render() {
        return null;
    }
}
