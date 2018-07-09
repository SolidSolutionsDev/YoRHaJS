import React, {Component} from 'react';

import * as THREE from 'three';

export function makeComponent( WrappedComponent )
  {
    return class extends React.Component {

      component;

      componentWillMount = () => {
        this.props.registerComponent( this );
      };

      registerComponent = ( component ) => {
        this.component = component;
      };

      update = () => {
        this.component.update();
      };

      render()
        {
          // Wraps the input component in a container, without mutating it. Good!
          return <WrappedComponent {...this.props}
                                   ref={this.registerComponent}/>;
        }
    };
  }