import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class SoundPlayer extends React.Component {

  start = () => {
      const {availableService,assetId,tag, positional, analyser} = this.props;
      const {audio} = availableService;

      if (!positional) {
          this.sound = audio.buildNonPositionalSound(
              assetId, tag, analyser
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
  transform: PropTypes.object.isRequired,
    assetId: PropTypes.string.isRequired
};
