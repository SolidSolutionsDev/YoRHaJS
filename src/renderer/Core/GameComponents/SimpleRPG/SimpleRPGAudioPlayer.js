import React from "react";
import PropTypes from "prop-types";
import "./SimpleRPGAudioPlayer.css";

export class SimpleRPGAudioPlayer extends React.Component {

    state = {
        init: false,
        soundPlaying: false
    };


    advance = () => {
        const {availableService} = this.props;
        const {stateMachine} = availableService;
        const {game} = stateMachine.stateMachines;
        if (this.state.active) {
            game.service.send("NEXT_STEP")
        }
    }

    initListenToStateTransitions = () => {
        if (this.state.init) {
            return;
        }
        const {availableService} = this.props;
        const {stateMachine} = availableService;
        const {game} = stateMachine.stateMachines;
        game.service.onTransition(current => {
            const stepId = current.context.stepsQueue[0];
            const stepData = current.context.constants.steps[stepId];
            const state = current.value;
            const active = current.value === "playAudio";
            if (active) {
                this.setState({active, stepId, data: stepData, init: true});
            } else {
                this.setState({active, init: true});
            }
        });
        document.addEventListener("shoot_keydown", () => {
            this.advance();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active && !prevState.active) {
            this.playAudio();
            this.setState({soundPlaying: true});
            this.advance();
        }
    }

    playAudio = () => {
        const {availableService, tag, positional, analyser, transform, autoPlay} = this.props;
        const {audio} = availableService;
        const {assetId, loop} = this.state.data;

        const isToStopSound = !assetId || assetId === "";

        if (this.sound && this.sound.sound) {
            this.sound.sound.stop();
        }

        if (isToStopSound) {
            return;
        }


        if (!positional) {
            this.sound = audio.buildNonPositionalSound(
                assetId, tag, analyser
            );
        } else {
            this.sound = audio.buildPositionalSound(
                assetId, tag, analyser
            );
        }

        this.sound.sound.onEnded(() => {
            this.setState({soundPlaying: false})
        })

        this.sound.sound.setLoop(loop);
        this.sound.sound.play();
    };

    update = () => {
        this.initListenToStateTransitions();
    };

    render() {
        if (!this.props.debug) { return null; }
        return <div id={"rpgAudio"}>
            <h2>SimpleRPGAudioPlayer</h2>
            <div>playing: {JSON.stringify(this.state.soundPlaying)}</div>
            <div>active: {JSON.stringify(this.state.active)}</div>
            <div>last audio step: {this.state.stepId}</div>
            <div>last audio data: {JSON.stringify(this.state.data)}</div>
        </div>;
    }
}

SimpleRPGAudioPlayer.propTypes = {
    // transform: PropTypes.object.isRequired,
    // assetId: PropTypes.string.isRequired
};
