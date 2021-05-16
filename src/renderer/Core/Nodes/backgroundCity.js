import * as THREE from "three";
import * as PIXI from "pixi.js";
import TETSUO from "@SolidSolutionsDev/tetsuo";

export class BackgroundCity {
  constructor(options) {
    // set default values
    this._elapsedTime = 0;
    this._width = options.width;
    this._height = options.height;
  }

  /**
   * Builds the screen
   */
  prepare() {
    return new Promise((resolve, reject) => {
      let digiverse = new TETSUO.THREENode("digiverse", {
        depthBuffer: true,
        cameraSettings: {
          near: 1.3,
          far: 400,
          fov: 70
        },

        onPrepare: () => {
          digiverse.camera.position.y = 10;
          digiverse.camera.position.x = 0;
          digiverse.camera.position.z = 200;
          digiverse.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
      });

      let floorMaterial = TETSUO.ShaderMaterial({
        fragmentShader: TETSUO.Shaders.compile(
          TETSUO.Shaders.simplex,
          /*glsl */ `
                        varying vec2 vUv;
                        uniform float iTime;


                        void main() {
                            float v = abs(sin(100. * 100. * (vUv.y - iTime / 5.))) + sin(230. * vUv.y + iTime * 5.) * 0.2;
                            float n = snoise(vec3(vUv.x * 200., vUv.y * 200., iTime));
                            gl_FragColor = vec4(mix(vec3(v) *  vec3(0.1, 0.4, .4), vec3(n), 0.04), 1.);
                        }
                    `
        )
      });

      digiverse.onUpdate(time => (floorMaterial.uniforms.iTime.value = time));

      new TETSUO.MeshNode("floor", {
        geometry: new THREE.PlaneBufferGeometry(2000, 2000, 200, 100),

        material: floorMaterial,

        onPrepare: mesh => {
          mesh.position.y = 0;
          mesh.rotation.x = -Math.PI / 2;
        },

        onUpdate: (time, mesh) => {
          mesh.position.z = digiverse.camera.position.z;
        }
      }).connectTo(digiverse);

      let boxMaterial = TETSUO.ShaderMaterial({
        fragmentShader: TETSUO.Shaders.compile(
          TETSUO.Shaders.simplex,
          /*glsl */ `
                        varying vec2 vUv;
                        uniform float iTime;

                        void main() {
                            float v = abs(sin(2. * 100. * (vUv.y - iTime * 5. / 1.)));
                            float n = snoise(vec3(vUv.x * 3., vUv.y * 2., iTime));
                            gl_FragColor = vec4(mix(vec3(v) *  vec3(0.4, 1., 1.), vec3(n), 0.1),  1. - n * 0.5);
                        }
                    `
        )
      });

      let boxes = [];

      let config = {
        street: 15,

        w: 5,
        minh: 10,
        maxh: 25,

        minspacing: 10,
        maxspacing: 10,

        noAhead: 10,
        noSide: 10
      };

      for (let iSide = 0; iSide < config.noSide; iSide++) {
        for (let iAhead = 0; iAhead < config.noAhead; iAhead++) {
          let lheight = TETSUO.NumberUtils.randomInInterval(
            config.minh,
            config.maxh
          );

          let l = new THREE.Mesh(
            new THREE.BoxGeometry(config.w, lheight, config.w),
            boxMaterial
          );
          boxes.push(l);

          digiverse.add(l);

          l.position.set(
            -config.street -
              iSide *
                (TETSUO.NumberUtils.randomInInterval(
                  config.minspacing,
                  config.maxspacing
                ) +
                  config.w),
            lheight / 2,
            -iAhead *
              (TETSUO.NumberUtils.randomInInterval(
                config.minspacing,
                config.maxspacing
              ) +
                config.w)
          );

          let rheight = TETSUO.NumberUtils.randomInInterval(
            config.minh,
            config.maxh
          );

          let r = new THREE.Mesh(
            new THREE.BoxGeometry(config.w, rheight, config.w),
            boxMaterial
          );
          boxes.push(r);

          digiverse.add(r);

          r.position.set(
            config.street +
              iSide *
                (TETSUO.NumberUtils.randomInInterval(
                  config.minspacing,
                  config.maxspacing
                ) +
                  config.w),
            rheight / 2,
            -iAhead *
              (TETSUO.NumberUtils.randomInInterval(
                config.minspacing,
                config.maxspacing
              ) +
                config.w)
          );
        }
      }

      digiverse.onUpdate(time => {
        digiverse.camera.position.z = -time * 10;
        digiverse.camera.rotation.y = Math.sin(time) / 4;

        boxMaterial.uniforms.iTime.value = time;

        boxes.forEach(box => {
          if (box.position.z > digiverse.camera.position.z) {
            box.position.z =
              digiverse.camera.position.z -
              config.noAhead *
                (TETSUO.NumberUtils.randomInInterval(
                  config.minspacing,
                  config.maxspacing
                ) +
                  config.w);
          }
        });
      });

      let fog = new TETSUO.FogNode("fog")
        .addInput(digiverse, "inputTex")
        .uniform("near", 10, "fog near")
        .uniform("far", 1400, "fog far");

      let ana = new TETSUO.AnaglyphNode("ana")
        .addInput(fog, "inputTex")
        .uniform("amount", 0.009, "anaglyph amt.");

      this._outputNode = ana;

      this.update(0);

      resolve(this._outputNode);
    });
  }

  /**
   * Updates the screen
   *
   * @param time - Current animation time
   * @param updateOptions - Update options to override defaults
   */
  update(deltaTime) {
    this._elapsedTime += deltaTime;
  }

  getNode() {
    return this._outputNode;
  }
}
