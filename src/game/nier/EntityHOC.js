import React, {Component} from 'react';

import * as THREE from 'three';

export function makeEntity( WrappedComponent )
  {
    return class extends React.Component {

      pivot = new THREE.Object3D();
      axesHelper = new THREE.AxesHelper( 5 );
      components = {};

      componentWillMount = () => {
        if ( this.props.transform && this.props.transform.position )
          {
            this.pivot.position.set( ...this.props.transform.position );
          }

          this.pivot.name = `${WrappedComponent.name}_pivot`

        this.pivot.add(this.axesHelper);
      };

      componentWillReceiveProps( nextProps )
        {
          console.log( 'Current props: ', this.props );
          console.log( 'Next props: ', nextProps );
        }

      registerComponent = ( component, _displayName ) => {
        this.components[_displayName] = component;
      };

      _update = () => {
        Object.values( this.components ).
            forEach( component => component.update() );
      };

      render()
        {
          this.axesHelper.visible = this.props.debug;
          const {transform, ...passThroughProps} = this.props;
          // Wraps the input component in a container, without mutating it. Good!
          return <WrappedComponent
              {...passThroughProps} pivot={this.pivot}
              registerComponent={this.registerComponent}/>;
        }
    };
  }