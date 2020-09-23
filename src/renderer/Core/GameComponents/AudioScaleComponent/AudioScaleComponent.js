import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class AudioScaleComponent extends React.Component {
    start = () => {
    };

    update = () => {
        const {transform, availableService, audioTag} = this.props;
        const {audio} = availableService;
        const {availableAudio} = audio;

        if (availableAudio[audioTag].analyser) {
            this.scaleDivideAudioInTwo(transform, availableAudio[audioTag].analyser);
            // this.scaleDivideAudioInThree(transform);
        }
    };

    scaleDivideAudioInTwo(transform, analyser) {
        const frequencyData = analyser.getFrequencyData();
        const averageFrequency = analyser.getAverageFrequency();
        const lowerHalfArray = frequencyData.slice(0, frequencyData.length / 2 - 1);
        const upperHalfArray = frequencyData.slice(
            frequencyData.length / 2 - 1,
            frequencyData.length - 1
        );

        const lowerHalfScale = this.generateNewScale2(lowerHalfArray, averageFrequency);
        const upperHalfScale = this.generateNewScale2(upperHalfArray, averageFrequency);

        transform.scale.set(lowerHalfScale, lowerHalfScale, upperHalfScale);
        // console.log(frequencyData, transform.scale);
    }

    scaleDivideAudioInThree(transform, analyser) {
        const frequencyData = analyser.getFrequencyData();
        const newScaleX = this.generateNewScale(frequencyData.slice(0, 3));
        const newScaleY = this.generateNewScale(frequencyData.slice(4, 7));
        const newScaleZ = this.generateNewScale(frequencyData.slice(8, 11));

        transform.scale.set(newScaleX, newScaleY, newScaleZ);
        // console.log(frequencyData);
    }

    generateNewScale = (frequencies, averageFrequency) => {
        let frequency = frequencies.reduce((accumulator, value) => {
            return accumulator + value;
        }, 0);
        frequency /= frequencies.length;
        return (1 + Math.cos((frequency - averageFrequency)) / 30) * 0.5;
        ;
        // return  1 + Math.cos((this.analyser.getAverageFrequency() - 125) / 10) * 0.2;
    };

    generateNewScale2 = (frequencies, averageFrequency) => {
        let frequency = frequencies.reduce((accumulator, value) => {
            return accumulator + value;
        }, 0);
        frequency /= frequencies.length;
        return (1 + Math.cos((frequency - averageFrequency) / 10)) * 0.5;

        // return  1 + Math.cos((this.analyser.getAverageFrequency() - 125) / 10) * 0.2;
    };

    render() {
        return null;
    }
}

AudioScaleComponent.propTypes = {
    transform: PropTypes.object.isRequired
};
