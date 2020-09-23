import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class SoundPlayer extends React.Component {

    start = () => {
        const {availableService, assetId, tag, positional, analyser, transform, autoPlay, loop} = this.props;
        const {audio} = availableService;

        if (!positional) {
            this.sound = audio.buildNonPositionalSound(
                assetId, tag, analyser
            );
        } else {
            this.sound = audio.buildPositionalSound(
                assetId, tag, analyser
            );
        }

        this.sound.sound.setLoop(loop);
        const test = autoPlay ? this.sound.sound.play() : null;
    };

    update = () => {
    };

    render() {
        return null;
    }
}

SoundPlayer.propTypes = {
    transform: PropTypes.object.isRequired,
    assetId: PropTypes.string.isRequired
};
