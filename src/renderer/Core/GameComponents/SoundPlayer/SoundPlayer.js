import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class SoundPlayer extends React.Component {

  start = () => {
      const {availableService,path,tag, positional, analyser} = this.props;
      const {audio} = availableService;

      if (!positional) {
          this.sound = audio.buildNonPositionalSound(
              path, tag, analyser
          );
      }
      else {

      }
  };

  update = () => {};

  render() {
    return null;
  }
}

SoundPlayer.propTypes = {
  transform: PropTypes.object.isRequired
};
