import React, {Component} from 'react';

import * as THREE from 'three';

import {BoardPrefab} from '../logic/prefabs/BoardPrefab';
import {SkyboxPrefab} from '../logic/prefabs/SkyBoxPrefab';
import {ShooterPrefab} from '../logic/prefabs/ShooterPrefab';
import {BallPrefab} from '../logic/prefabs/BallPrefab';
import { GameDirector } from "../logic/GameDirector";

export class Scene extends Component {

  scene = new THREE.Scene();
  children = [];
    gamePrefabs = {};

  componentDidMount()
    {
      //debug
      window.sceneChildren = this.children;
      // this.scene.fog = new THREE.Fog( 0x222222, 0.015, 200 );
      //this.initGrid();
      this.initAxes();
      this.initLights();
    }

  componentWillReceiveProps( nextProps )
    {
      console.log( 'Scene componentWillReceiveProps:', nextProps );
    }

  initLights()
    {
      const light = new THREE.PointLight( 0xFFFFFF, 1, 100 );
      light.position.set( 10, 7, 5 );

      light.castShadow = true;
      light.shadow.mapSize = new THREE.Vector2( 1024, 1024 );

      this.scene.add( light );

      const ambient_light = new THREE.AmbientLight( 0x222222, 5 ); // soft white light
      this.scene.add( ambient_light );

      // const light2 = new THREE.PointLight( 0xFFFFFF, 1, 100 );
      // light2.position.set( 0, 0, 0 );
      // light2.castShadow = true;
      // this.logo.add( light2 );
    }

  initGrid()
    {

      const size = 2000;
      const divisions = 1000;

      const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
      planeGeometry.rotateX( -Math.PI / 2 );
      const planeMaterial = new THREE.MeshPhongMaterial( {
        opacity: 0.8, transparent: true, depthWrite: false,
      } );
      const plane = new THREE.Mesh( planeGeometry, planeMaterial );
      plane.position.y = -0.1;
      plane.receiveShadow = true;
      plane.material.transparent = true;
      plane.renderOrder = 100;
      this.scene.add( plane );

      const gridHelper = new THREE.GridHelper( size, divisions );
      //gridHelper.castShadow = true;

      this.scene.add( gridHelper );
    }

  update = () => {
    this.children.forEach( ( child ) => {
      child._update();
    } );
  };

  initAxes()
    {

      const axesHelper = new THREE.AxesHelper( 5 );
      this.scene.add( axesHelper );
    }


    setGameDirector = ( gameDirector ) => {

        this.gameDirector = gameDirector;
    };

    getGameDirector = () => {
        return this.gameDirector;
    };

  addChild = ( child ) => {
    if ( child.mesh )
      {
        this.scene.add( child.mesh );
      }
    this.children.push( child );
  };

    addBall = (child)=> {
        this.gamePrefabs.Ball = child;
        this.addChild(child);
    }
    getBall =()=>{
        return this.gamePrefabs.Ball;
    }

    addBoard = (child)=> {
        this.gamePrefabs.Board = child;
        this.addChild(child);
    }
    getBoard =()=>{
        return this.gamePrefabs.Board;
    }

    addShooter = (child)=> {
        this.gamePrefabs.Shooter = child;
        this.addChild(child);
    }
    getShooter =()=>{
        return this.gamePrefabs.Shooter;
    }

    addSkybox = (child)=> {
        this.gamePrefabs.Skybox = child;
        this.addChild(child);
    }
    getSkybox =()=>{
        return this.gamePrefabs.Skybox;
    }


  render()
    {
      console.log( 'Scene render props:', this.props );
      return <div>
        <BallPrefab getGameDirector={this.props.getGameDirector}
                    getAudioManager={this.props.getAudioManager}
                    getPhysicsManager={this.props.getPhysicsManager}
                    ref={this.addBall}></BallPrefab>
        <BoardPrefab getGameDirector={this.props.getGameDirector}
                     getPhysicsManager={this.props.getPhysicsManager}
                     getAudioManager={this.props.getAudioManager}
                     ref={this.addBoard}></BoardPrefab>
        <ShooterPrefab getGameDirector={this.props.getGameDirector}
                       getPhysicsManager={this.props.getPhysicsManager}
                       getAudioManager={this.props.getAudioManager}
                       ref={this.addShooter}></ShooterPrefab>
        <SkyboxPrefab getGameDirector={this.props.getGameDirector}
                      getPhysicsManager={this.props.getPhysicsManager}
                      getAudioManager={this.props.getAudioManager}
                      ref={this.addSkybox}></SkyboxPrefab>
          <GameDirector
          ref={gameDirector => this.setGameDirector( gameDirector )}
          gamePrefabs={this.gamePrefabs}
          key="gameDirector"></GameDirector> ;
          Scene </div>;
    }
}