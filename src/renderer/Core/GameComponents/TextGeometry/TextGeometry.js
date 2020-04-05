import React from "react";

import PropTypes from "prop-types";
import * as THREE from "three";
import * as _ from "lodash";

export class TextGeometry extends React.Component {
    mesh;

    group;
    textMesh1;
    textMesh2;
    textGeo;
    materials;

    text;
    height;
    size;
    hover;

    curveSegments;

    bevelThickness;
    bevelSize;
    bevelEnabled;

    font;
    fontName;
    fontWeight;
    mirror;
    defaultColor;
    // defaultColor = 0xffffff;


    //
    // fontMap = {
    //
    //   "helvetiker": 0,
    //   "optimer": 1,
    //   "gentilis": 2,
    //   "droid/droid_sans": 3,
    //   "droid/droid_serif": 4,
    //   "opensans": 5,
    //
    // };
    // weightMap = {
    //
    //   "regular": 0,
    //   "bold": 1
    //
    // };


    fontLoader = new THREE.FontLoader();

    // TODO: go to utils
    randomString = (len, an) => {
        an = an && an.toLowerCase();
        var str = "",
            i = 0,
            min = an == "a" ? 10 : 0,
            max = an == "n" ? 10 : 62;
        for (; i++ < len;) {
            var r = Math.random() * (max - min) + min << 0;
            str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
        }
        return str;
    };

    resetMaterials = () => {
        const {randomColors, colors} = this.props;
        this.materials = [];

        if (randomColors) {
            for (let i = 0; i < this.text.length; i++) {
                const color = Math.random() * 0xffffff;
                this.materials.push(new THREE.MeshPhongMaterial({
                        emissive: color,
                        flatShading: false,
                        // wireframe:Math.random() > 0.5
                    }), // front
                    new THREE.MeshPhongMaterial({
                        color: color,
                        // wireframe:Math.random() > 0.5
                    })); // side
            }
            return;
        }

        const colorsToUse = colors || [this.defaultColor];
        let colorIndex = 0;
        for (let i = 0; i < this.text.length; i++) {
            const color = colorsToUse[colorIndex];
            colorIndex = colorIndex >= colorsToUse.length - 1 ? 0 : colorIndex + 1;
            this.materials.push(new THREE.MeshPhongMaterial({
                    color,
                    flatShading: false,
                    // wireframe:Math.random() > 0.5
                }), // front
                new THREE.MeshPhongMaterial({
                    color,
                    // wireframe:Math.random() > 0.5
                })); // side
        }

    };

    loadFont = () => {
        this.fontLoader.load('./assets/fonts/' + this.fontName + '_' + this.fontWeight + '.typeface.json', (response) => {
            this.font = response;
            this.refreshText();
        });
    };


    createText = () => {

        this.resetParameters();
        this.resetMaterials();

        const textGeometryParameters = {

            font: this.font,

            size: this.size,
            height: this.height,
            curveSegments: this.curveSegments,

            bevelThickness: this.bevelThickness,
            bevelSize: this.bevelSize,
            bevelEnabled: this.bevelEnabled

        };
        this.textGeo = new THREE.TextGeometry(this.text, textGeometryParameters);

        this.textGeo.computeBoundingBox();
        this.textGeo.computeVertexNormals();

        const triangle = new THREE.Triangle();

        // "fix" side normals by removing z-component of normals for side faces
        // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

        if (!this.bevelEnabled) {

            const triangleAreaHeuristics = 0.1 * (this.height * this.size);

            for (let i = 0; i < this.textGeo.faces.length; i++) {

                const face = this.textGeo.faces[i];

                if (face.materialIndex === 1) {

                    for (let j = 0; j < face.vertexNormals.length; j++) {

                        face.vertexNormals[j].z = 0;
                        face.vertexNormals[j].normalize();

                    }

                    const va = this.textGeo.vertices[face.a];
                    const vb = this.textGeo.vertices[face.b];
                    const vc = this.textGeo.vertices[face.c];

                    const s = triangle.set(va, vb, vc).getArea();

                    if (s > triangleAreaHeuristics) {

                        for (let j = 0; j < face.vertexNormals.length; j++) {

                            face.vertexNormals[j].copy(face.normal);

                        }

                    }

                }

            }

        }

        const centerOffset = -0.5 * (this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x);

        this.textGeo = new THREE.BufferGeometry().fromGeometry(this.textGeo);

        this.textGeo.groups.forEach((group, index) => {
            group.materialIndex = index;
        });

        this.textMesh1 = new THREE.Mesh(this.textGeo, this.materials);

        this.textMesh1.position.x = centerOffset;
        // this.textMesh1.position.y = this.hover;
        this.textMesh1.position.z = 0;

        this.textMesh1.rotation.x = 0;
        this.textMesh1.rotation.y = Math.PI * 2;
        this.textMesh1.castShadow = true;

        this.group.add(this.textMesh1);

         this.textMesh1.rotation.x = Math.PI / 2;

        if (this.mirror) {

            this.textMesh2 = new THREE.Mesh(this.textGeo, this.materials);

            this.textMesh2.position.x = centerOffset;
            this.textMesh2.position.y = -this.hover;
            this.textMesh2.position.z = this.height;

            this.textMesh2.rotation.x = Math.PI;
            this.textMesh2.rotation.y = Math.PI * 2;

            this.group.add(this.textMesh2);

        }

    };

    refreshText = () => {

        this.group.remove(this.textMesh1);
        if (this.mirror) this.group.remove(this.textMesh2);

        if (!this.text) return;

        this.createText();

    };

    decimalToHex = (d) => {

        let hex = Number(d).toString(16);
        hex = "000000".substr(0, 6 - hex.length) + hex;
        return hex.toUpperCase();

    };

    resetParameters = () => {
        const {text, height, size, hover, curveSegments, bevelThickness, bevelSize, bevelEnabled, font, fontName, fontWeight, mirror} = this.props;
        // initial outside vars
        this.defaultColor = 0x000000;
        this.text = text || "SOLID";
        this.height = height || 2;
        this.size = size || 7;
        this.hover = hover || 30;

        this.curveSegments = curveSegments || 4;

        this.bevelThickness = bevelThickness || .2;
        this.bevelSize = bevelSize || .15;
        this.bevelEnabled = bevelEnabled || true;

        // this.font =  font || undefined;
        this.fontName = fontName || "opensans"; // helvetiker, optimer, gentilis, droid sans, droid serif
        this.fontWeight = fontWeight || "bold"; // normal bold
        this.mirror = mirror || false;
    };

    initText = () => {


        this.group = new THREE.Group();

        this.props.transform.add(this.group);

        this.updateText();
    };

    updateText = () => {
        this.resetParameters();
        this.loadFont();
    };

    startRandomGeneration = ()=> {
        setInterval(() => {
            const randomString = this.randomString(Math.abs(Math.random() * 10));

            /*
              gameObjectId,
              gameComponentId,
              componentParameters
             */
            this.props.updateGameObjectComponent(
                this.props.gameObject.id,
                "textGeometry", {
                    text: randomString,
                    colors:[ "#" + Math.floor(Math.random()*16777215).toString(16) ],
                    height: Math.random() * 2,
                    size: Math.random() * 7,
                    hover: Math.random() * 30,
                    curveSegments: Math.random() * 4,
                    bevelThickness: Math.random() * .2,
                    bevelSize: Math.random() * .15,
                    bevelEnabled: true,
                });
        }, 1000)
    }

    start = () => {
        this.initText();
        // this.startRandomGeneration();
    };

    update = (time) => {
        // this.props.pivot.rotation.y += 0.01;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(this.props.selfSettings, prevProps.selfSettings)) {
            this.updateText();
        }
    }

    render() {
        // Wraps the input component in a container, without mutating it. Good!
        return null;
    }
}

TextGeometry.propTypes = {
    randomColors: PropTypes.bool,
    text: PropTypes.string.isRequired,
    colors: PropTypes.array,
    height: PropTypes.number,
    size: PropTypes.number,
    hover: PropTypes.number,
    curveSegments: PropTypes.number,
    bevelThickness: PropTypes.number,
    bevelSize: PropTypes.number,
    bevelEnabled: PropTypes.bool,
    fontName: PropTypes.string,
    fontWeight: PropTypes.number,
    mirror: PropTypes.bool,
};
