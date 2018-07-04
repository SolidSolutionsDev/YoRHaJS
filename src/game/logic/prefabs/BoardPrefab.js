import React, {Component} from 'react';
import {GameObject} from '../GameObject';
import {isGridBoard} from '../components/BoardComponent';

export class BoardPrefab extends GameObject {

  buildComponents = () => {
    this.parameters = this.props.parameters ? this.props.parameters : {};
    this.parameters = Object.assign( {gridboard: {}}, this.parameters );
    Object.assign( this.components,
        isGridBoard( this, this.parameters.gridboard ) );
  };


  initComponents()
    {
      this.components.gridboard.new();
    }
}