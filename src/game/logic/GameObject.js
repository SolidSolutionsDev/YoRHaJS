import React, { Component } from "react";
import * as THREE from "three";

export class GameObject extends Component {
  mesh = new THREE.Object3D();
  components = {};
  childGameObjects = [];
  id = "";
  i = 0;

  componentDidMount() {
    this.id = this.props.id || this.constructor.name;
    this.mesh.name = this.id + "Mesh";
    this.buildComponents();
    this.initComponents();
    this.start();
  }

  start = () => {};

  _update = () => {
    this.updateComponents();
    this.updateChildren();
    this.update();
  };

  updateChildren = () => {
    this.childGameObjects.forEach(gameobject => {
      gameobject._update();
    });
  };

  updateComponents = () => {
    for (const componentID in this.components) {
      if (this.components[componentID].update) {
        this.components[componentID]
          .update
          //    this.props.components[componentID]
          ();
      }
    }
  };

  update = () => {};

  buildComponents() {}

  initComponents() {}

  buildChildren = children => {
    const _children = [];
    if (!children) {
      console.log("GameObject ${this.id} has no children to build.");
    }

    this.childGameObjects = this.buildChildGameObjects(children.gameobjects);
  };

  buildChildGameObjects = children => {};

  render() {
    this.i++;
    console.log("render i:${this.i}");
    return null;
  }

  /*+
   {
   let result: any[] = []
   let DynamicComponentType: typeof Component3D | undefined;

   if ( this.props.elementData.components )
   {
   Object.keys( this.props.elementData.components ).forEach( componentName => {
   DynamicComponentType = this.getTypeOfComponent( componentName );

   if ( !DynamicComponentType )
   {
   return;
   }

   const _id = this.id + '_component_' + componentName;
   const _parameters = this.props.elementData.components[ componentName ];
   result.push( <DynamicComponentType getLogger={this.props.getLogger}
   isSelected={this.state.selected} key={_id} id={_id}
   entity={this} parameters={_parameters}
   geometryWasUpdated={this.state.geometryWasUpdated}
   updateComponentState={this.props.updateComponentState}
   batchUpdateEntityStore={this.props.batchUpdateEntityStore}
   setRendererState={this.props.setRendererState}
   getRendererState={this.props.getRendererState}
   markGeometryAsNeedingUpdate={
   this._markGeometryAsNeedingUpdate}
   registerComponent={this.registerComponent}
   deregisterComponent={this.deregisterComponent}
   getEntityPivotMesh={this.getPivotMesh}
   entityTransformWasUpdated={
   this.updatedTransform}
   attachMeshComponent={this.attachMeshComponent}/> );
   } );

   }
   let childReactComponents: any[] = [];
   childReactComponents = this.buildChildrenReactComponents( this.props.elementData.id );
   result.push( ...childReactComponents );
   return <div key={this.id}>{result}</div>;
   }
   */
}

export default GameObject;
