import * as THREE from "three";
import { dimensions } from "../../settings";
import * as _ from "lodash";
import TWEEN from "@tweenjs/tween.js";

export const isGridBoard = (gameObject, parameters) => {
  let _grid,
    _border = { left: {}, top: {}, right: {} },
    _gridArray = [],
    _debug = new THREE.Object3D(),
    _inited = false;

  function _clean() {
    console.log("cleaning grid");
  }

  function _new() {
    if (_grid) {
      this._clean();
    }
    _grid = new THREE.Object3D();
    console.log("building grid");
    _addBorder();
    _addPositions();
    _addDebugGrid();
    gameObject.mesh.add(_grid);
  }

  function _addPositions() {
    console.log("building grid - _addPositions");

    const gridPositions = createGridPositions({
      height: dimensions.lines,
      width: dimensions.columns,
      space: dimensions.scale,
      color: 0x00ff00
    });
    _grid.add(gridPositions.mesh);
  }

  function _addBorder() {
    const config = Object.assign(
      {
        height: 500,
        width: 500,
        space: 10,
        color: 0x00ff00
      },
      {}
    );

    console.log("building grid - _addBorder");

    let _parameters = {
      skyboxType: "sphere",
      texture: "./assets/img/sky.png",
      radius: 100
    };
    let _texture;
    const border = new THREE.Object3D();
    const material = new THREE.MeshLambertMaterial({
      opacity: 0.8,
      transparent: true,
      metalness: 0.5,
      roughness: 0
    });

    const loader = new THREE.TextureLoader();

    loader.load(
      _parameters.texture,

      function(texture) {
        _texture = texture;
        _texture.minFilter = THREE.LinearFilter;
        _texture.magFilter = THREE.LinearFilter;
        _texture.repeat.set(1, 1);

        // _texture.wrapS = THREE.MirroredRepeatWrapping;
        // _texture.wrapT = THREE.MirroredRepeatWrapping;

        if (material) {
          material.color = new THREE.Color(1, 1, 1);
          // material.envMap = texture;

          material.map = texture;
          material.needsUpdate = true;

          const borderSideGeometry = new THREE.BoxGeometry(
            dimensions.borderThickness,
            dimensions.lines * dimensions.scale,
            dimensions.borderThickness
          );
          const borderTopGeometry = new THREE.BoxGeometry(
            dimensions.columns * dimensions.scale +
              dimensions.borderThickness * 2,
            dimensions.borderThickness,
            dimensions.borderThickness
          );

          _border.left.mesh = new THREE.Mesh(borderSideGeometry, material);
          _border.right.mesh = new THREE.Mesh(borderSideGeometry, material);
          _border.top.mesh = new THREE.Mesh(borderTopGeometry, material);

          _border.left.mesh.scale.y = -1;
          _border.right.mesh.scale.y = -1;
          _border.top.mesh.scale.y = -1;

          _border.top.collides = true;

          const _sideDisplacement =
            0.5 * dimensions.columns * dimensions.scale +
            dimensions.borderThickness / 2;

          border.add(_border.left.mesh);
          _border.left.mesh.position.set(_sideDisplacement, 0, 0);

          border.add(_border.right.mesh);
          _border.right.mesh.position.set(-_sideDisplacement, 0, 0);

          const _topDisplacement =
            0.5 * dimensions.lines * dimensions.scale +
            dimensions.borderThickness / 2;

          border.add(_border.top.mesh);
          _border.top.mesh.position.set(0, _topDisplacement, 0);
          _grid.add(border);

          _border.right.mesh.name = _.uniqueId("Border_right");
          _border.top.mesh.name = _.uniqueId("Border_top");
          _border.left.mesh.name = _.uniqueId("Border_left");
          // physics

          const _physicsService = gameObject.props.getPhysicsService();

          _border.left.physicsObject = _physicsService.addNewBoxBody(
            _border.left.mesh,
            {
              mass: 0,
              position: { x: _sideDisplacement, y: 0, z: 0 },
              dimensions: {
                x: dimensions.borderThickness / 2,
                y: (dimensions.lines * dimensions.scale) / 2,
                z: dimensions.borderThickness / 2
              }
            },
            _border.left
          );

          _border.right.physicsObject = _physicsService.addNewBoxBody(
            _border.right.mesh,
            {
              mass: 0,

              position: { x: -_sideDisplacement, y: 0, z: 0 },
              dimensions: {
                x: dimensions.borderThickness / 2,
                y: (dimensions.lines * dimensions.scale) / 2,
                z: dimensions.borderThickness / 2
              }
            },
            _border.right
          );

          _border.top.physicsObject = _physicsService.addNewBoxBody(
            _border.top.mesh,
            {
              mass: 0,
              position: { x: 0, y: _topDisplacement, z: 0 },
              dimensions: {
                x:
                  dimensions.columns * dimensions.scale +
                  dimensions.borderThickness * 2,
                y: dimensions.borderThickness / 2,
                z: dimensions.borderThickness
              }
            },
            _border.top
          );

          _border.back = {};

          let step = config.space;

          // const gridGeo = new THREE.BoxGeometry( step - 0.1, step - 0.1 );
          const gridGeoRadius = (step - 0.1) / 2;
        }

        _inited = true;
      },
      undefined,
      function(err) {
        console.error("An error loading texture happened.");
      }
    );
  }

  function _addDebugGrid() {
    console.log("building grid - _addDebugGrid");

    _grid.add(_debug);
    const gridBackground = _addGridBackgroundPlane();
    _debug.add(gridBackground);

    const gridLines = createGridLines({
      height: dimensions.lines,
      width: dimensions.columns,
      space: dimensions.scale,
      color: 0x00ff00
    });
    _debug.add(gridLines);
  }

  const _addGridBackgroundPlane = function() {
    const planeGeometry = new THREE.PlaneGeometry(
      dimensions.columns * dimensions.scale,
      dimensions.lines * dimensions.scale
    );
    //planeGeometry.rotateX( -Math.PI / 2 );
    const planeMaterial = new THREE.MeshPhongMaterial({
      opacity: 0.8,
      transparent: false,
      depthWrite: false,
      color: 0xff0000
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.material.transparent = true;
    plane.visible = false;
    plane.renderOrder = 100;

    return plane;
  };

  //----------------------------------------------------------------------------
  // adapted from :
  // https://bocoup.com/blog/learning-three-js-with-real-world-challenges-that-have-already-been-solved
  //----------------------------------------------------------------------------
  function createGridLines(opts) {
    let config = Object.assign(
      {
        height: 500,
        width: 500,
        space: 10,
        color: 0x0000ff
      },
      opts
    );

    let material = new THREE.LineBasicMaterial({
      color: config.color,
      opacity: 0.9
    });

    let gridObject = new THREE.Object3D(),
      gridGeo = new THREE.Geometry(),
      width = config.space * (config.width / 2),
      height = config.space * (config.height / 2),
      step = config.space;

    //width
    // for ( let i = -width; i <= width; i += step / 2 )
    //   {
    //     gridGeo.vertices.push( new THREE.Vector3( i, -height, 0 ) );
    //     gridGeo.vertices.push( new THREE.Vector3( i, height, 0 ) );
    //
    //   }

    //height
    for (let i = -height; i <= height; i += step) {
      gridGeo.vertices.push(new THREE.Vector3(-width, i, 0));
      gridGeo.vertices.push(new THREE.Vector3(width, i, 0));
    }

    let line = new THREE.Line(gridGeo, material, THREE.LinePieces);
    gridObject.add(line);

    return gridObject;
  }

  function createGridPositions(opts) {
    const config = Object.assign(
      {
        height: 500,
        width: 500,
        space: 10,
        color: 0x00ff00
      },
      opts
    );

    _gridArray.splice(0, _gridArray.length);
    const gridObject = new THREE.Object3D(),
      width = config.space * (config.width / 2),
      height = config.space * (config.height / 2),
      step = config.space;

    // const gridGeo = new THREE.BoxGeometry( step - 0.1, step - 0.1 );
    const gridGeoRadius = step / 2;
    const ystep = Math.sqrt(3 * (gridGeoRadius * gridGeoRadius));
    const gridGeo = new THREE.SphereGeometry(gridGeoRadius);

    let _currentLine = 0;
    //for each line
    for (let y = -height; y <= height - ystep / 2; y += ystep) {
      let _heightArray = [];
      const _currentLineIsEven = _currentLine === 0 || _currentLine % 2 === 0;
      const _offset = !_currentLineIsEven ? step / 2 : 0;
      console.log(_offset);
      _currentLine++;
      for (
        let x = -width + step / 2 + _offset;
        x <= width - step / 2;
        x += step
      ) {
        const _position = { x: x, y: y, z: 0 };
        const newGridPosition = new GridPosition(
          gridGeo,
          config.color,
          gridGeoRadius,
          _position
        );
        _heightArray.push(newGridPosition);
        gridObject.add(newGridPosition.mesh);

        //  newGridPosition.mesh.position.set( x, y, 0 );
      }
      _gridArray.push(_heightArray);
    }

    // console.log( _gridArray );
    // we should have an array with the boxes and they should be on gridObject

    return { mesh: gridObject, array: _gridArray };
  }

  function GridPosition(geometry, color, radius, position) {
    this.collides = false;
    this.attaches = true;
    const _physicsService = gameObject.props.getPhysicsService();
    const material = new THREE.MeshPhongMaterial({
      color: color,
      opacity: 0,
      transparent: true,
      side: THREE.DoubleSide
    });
    const _mesh = new THREE.Mesh(geometry, material);
    _mesh.name = _.uniqueId(`GridPositionSphereX${position.x}Y${position.y}_`);
    this.ball = null;
    _mesh.visible = false;
    this.debugTween;
    const _physicsRepresentation = _physicsService.addNewSphereBody(
      _mesh,
      {
        radius: radius,
        position: position,
        mass: Math.random() > 0.2 ? 50 : 0,
        linearFactor: new _physicsService.Vec3(1, 1, 0),
        angularFactor: new _physicsService.Vec3(1, 1, 0),
        type: "kinematic",
        beginContactFunction: body2 => {
          // if ( body2.mesh.name.includes( 'Border' ) )
          //   {
          //     return;
          //   }
          // this.debugTween ? this.debugTween.stop() : null;
          // _mesh.material.opacity = 0.5;
          // // _mesh.visible = true;
        },
        endContactFunction: body2 => {
          // if ( body2.mesh.name.includes( 'Border' ) )
          //   {
          //     return;
          //   }
          //
          // this.debugTween ? this.debugTween.stop() : null;
          // this.debugTween = new TWEEN.Tween( _mesh.material ).to( {opacity: 0},
          //     10 ).
          //     easing( TWEEN.Easing.Elastic.InOut ).
          //     onComplete( () => {
          //        _mesh.visible = false;
          //     } ).
          //     start();
        }
      },
      this
    );

    _physicsRepresentation.body.collisionResponse = 0;

    Object.defineProperty(this, "mesh", {
      get() {
        return _mesh;
      }
    });

    Object.defineProperty(this, "visible", {
      set(value) {
        // _mesh.material.tranparent = value;
        _mesh.material.opacity = value ? 0.6 : 0.0;
        _mesh.visible = value;
      }
    });

    this.activate = (state, ball) => {
      this.ball = ball ? ball : null;
      _mesh.material.color = new THREE.Color(state.color);
      _mesh.visible = state.visible;
      _mesh.material.opacity = state.opacity;
      this.collides = true;
    };

    this.deactivate = () => {
      this.ball = null;
      _mesh.material.color = new THREE.Color(0x000000);
      _mesh.visible = false;
      _mesh.material.opacity = 0;
      this.collides = false;
    };

    let _parameters = {
      skyboxType: "sphere",
      texture: "./assets/img/sky.png",
      radius: 100
    };

    let _texture;

    const loader = new THREE.TextureLoader();

    loader.load(
      _parameters.texture,

      function(texture) {
        _texture = texture;
        _texture.minFilter = THREE.LinearFilter;
        _texture.magFilter = THREE.LinearFilter;
        _texture.repeat.set(1, 1);

        // _texture.wrapS = THREE.MirroredRepeatWrapping;
        // _texture.wrapT = THREE.MirroredRepeatWrapping;

        if (material) {
          material.color = new THREE.Color(1, 1, 1);
          // material.envMap = texture;

          _mesh.material.map = texture;
          _mesh.material.needsUpdate = true;
        }
      }
    );

    this.physicsObject = _physicsRepresentation;

    return this;
  }

  //TODO: should go to game director
  GridPosition.prototype.state = {
    inactive: { color: 0x0000ff, visible: true, opacity: 0.9 },
    ready: { color: 0x00ff00, visible: true, opacity: 0.9 },
    trespassing: { color: 0xff0000, visible: true, opacity: 0.9 },
    occupied: { color: 0x000000, visible: true, opacity: 0.9 }
  };

  const update = id => {
    if (!_inited) {
      return;
    }
    randomColorBox();
    updatePhysics();
  };

  const updatePhysics = () => {
    _gridArray.forEach(gridArrayColumn => {
      gridArrayColumn.forEach(gridElement => {
        gridElement.physicsObject.update();
        //gridElement.physicsObject ? gridElement.physicsObject.update() : null;
      });
    });

    Object.keys(_border).forEach(key => {
      _border[key].physicsObject ? _border[key].physicsObject.update() : null;
      //gridElement.physicsObject ? gridElement.physicsObject.update() : null;
    });
  };

  const randomColorBox = () => {
    let _randomSlotLineID = Math.floor(Math.random() * _gridArray.length);
    let _randomSlotColumnID = Math.floor(
      Math.random() * _gridArray[_randomSlotLineID].length
    );

    const _stateID = Object.keys(GridPosition.prototype.state);

    let _randomState = Math.floor(Math.random() * _stateID.length);
    //
    // _gridArray[_randomSlotLineID][_randomSlotColumnID]
    //     .activate( _stateID[_randomState] );
  };

  let state = {
    dimensions: dimensions,
    new: _new,
    set debug(value) {
      if (!_debug) {
        console.log("debug is not defined");
        return;
      }

      _gridArray.forEach(gridLine => {
        gridLine.forEach(gridPosition => {
          gridPosition.visible = value;
        });
      });

      _debug.visible = value;
    },
    get debug() {
      if (!_debug) {
        console.log("debug is not defined");
        return _grid;
      }
      return _debug.visible;
    },
    slots: _gridArray,
    border: _border,
    update: update
  };
  return { gridboard: state };
};
