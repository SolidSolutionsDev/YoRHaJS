import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class AudioScaleComponent extends React.Component {

  audioService;
  start = () => {
    const {availableService} = this.props;
    const {audio} = availableService;
    this.sound = audio.buildNonPositionalSound(
        this.props.sound
    );

    this.analyser = audio.buildAnalyserFromSound(this.sound, 32);

  };

  update = () => {
    const {transform} = this.props;
    if (this.analyser){

      const frequencyData = this.analyser.getFrequencyData();
      const newScaleX = this.generateNewScale(frequencyData.slice(0,3));
      const newScaleY = this.generateNewScale(frequencyData.slice(4,7));
      const newScaleZ = this.generateNewScale(frequencyData.slice(8,11));
      //
      // const newScale =
      transform.scale.set(newScaleX, newScaleY, newScaleZ);
      //     1 + Math.cos((this.analyser.getAverageFrequency() - 125) / 10) * 0.2;
      // console.log(frequencyData);

    }
  };

  generateNewScale = (frequencies) => {
      let frequency = frequencies.reduce((accumulator,value)=> {return accumulator+value},0);
      frequency /= frequencies.length;
      return  1 + Math.cos((frequency - this.analyser.getAverageFrequency() ) / 30) * 0.5;
      // return  1 + Math.cos((this.analyser.getAverageFrequency() - 125) / 10) * 0.2;
  };

  render() {
    return null;
  }
}

AudioScaleComponent.propTypes = {
  transform: PropTypes.object.isRequired
};
