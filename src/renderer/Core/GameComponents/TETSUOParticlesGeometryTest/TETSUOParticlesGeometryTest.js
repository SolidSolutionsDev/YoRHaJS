import React from "react";
import * as THREE from "three";

export class TETSUOParticlesGeometryTest extends React.Component {
  mesh = new THREE.Object3D();
  initTetsuoGeometry = () => {
    const { transform } = this.props;
    let cylCount = 25;
    let cylHeight = 0.1;
    let cylSpacing = cylHeight / 2;
    let cyls = [];
    for (let i = 0; i < cylCount; i++) {
      let geo = new THREE.CylinderGeometry(1, 1, cylHeight, 5);
      let mat = new THREE.MeshNormalMaterial();
      let cyl = new THREE.Mesh(geo, mat);
      cyl.position.y = i * (cylHeight + cylSpacing);
      cyl.rotation.y = i / 20;
      cyls.push(cyl);
      this.mesh.add(cyl);
    }

    // create particles
    let ps = [];
    let psCount = 300;
    const pGeo = new THREE.Geometry();
    for (let i = 0; i < psCount; i++) {
      let p = {
        position: new THREE.Vector3(
          Math.random() * 4 - 2,
          Math.random() * 3.5,
          Math.random() * 4 - 2
        )
      };

      ps.push(p);
      pGeo.vertices.push(p.position);
    }
    const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    this.pMesh = new THREE.Points(pGeo, pMat);
    this.mesh.add(this.pMesh);
    this.cyls = cyls;
    transform.add(this.mesh);
    this.mesh.position.y -= 2;
    console.log(this.mesh);
  };

  start = () => {
    this.initTetsuoGeometry();
  };

  update = () => {
    this.cyls.forEach(cyl => {
      cyl.rotation.y += 0.01;
      this.pMesh.rotation.y -= 0.001;
    });
  };
}

TETSUOParticlesGeometryTest.propTypes = {};
