import React, {Component} from 'react';

import * as THREE from 'three';

export function makeComponent( WrappedComponent )
  {
    return class extends React.Component {

      component;

      getDisplayName = ( WrappedComponent ) => {
        return WrappedComponent.displayName || WrappedComponent.name ||
            'Component';
      };

      componentWillMount = () => {
        const _displayName = this.getDisplayName( WrappedComponent );
        this.props.registerComponent( this, _displayName );
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