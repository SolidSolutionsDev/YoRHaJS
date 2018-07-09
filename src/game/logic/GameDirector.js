import React, { Component } from 'react';
import * as _ from 'lodash';
import {dimensions} from '../settings';

export class GameDirector extends Component {

    shooter = null;
    board = null;
    activeBall = null;
    physicsManager=null;

//TODO: ADD REDUX!!! - board positions, arrow direction, camera position and animation or not, ball animation or not

    ballColors = {
        red:0xff0000,
        green:0x00ff00,
        blue:0x0000ff
    }


    currentBallColor = _.sample(this.ballColors);

    //TODO: should go to game director
    ballStates = {
        inactive: {color: 0x0000ff},
        ready: {color: 0x00ff00},
        trespassing: {color: 0xff0000},
        occupied: {color: 0x000000},
    };

    componentDidMount = () => {
        console.log(this);
        // document.addEventListener( 'ballCollided',this.ballCollided );
        // document.addEventListener( 'restartGame',this.restartGame );
    }

    restartGame =(e)=> {
        alert("restart");
    }


    ballCollided = (e) => {
        const _originalEvent = e.detail.originalEvent;
        const _mainBall = e.detail.object;
        const _physicsRepresentation = _mainBall.physicsRepresentation;
        const _mesh = _mainBall.mesh;

        if (_mainBall.colliding ){
            return;
        }
        _mainBall.colliding = true;
        // console.log( e );
        const _collidedBody = _originalEvent.contact.bi === _physicsRepresentation.body ?
            _originalEvent.contact.bj :
            _originalEvent.contact.bi;
        // console.log( _collidedBody );
        if ( _collidedBody.mesh.name.includes( 'Border' ) ) {


            if ( _mainBall.sound.isPlaying ) {
                _mainBall.sound.stop();
            }
            _mainBall.sound.play();
        }

        if (_collidedBody.instance.collides){
            // console.log(_collidedBody.instance,bodiesInContact);
            let _nearestBall;
            let positionToAttach = _mainBall.bodiesInContact
                .filter((candidateElementToAttach) => (candidateElementToAttach !== _collidedBody.instance && candidateElementToAttach.attaches && !candidateElementToAttach.collides))
                .forEach((candidateElementToAttach) =>{
                    // console.log(candidateElementToAttach,candidateElementToAttach !== _collidedBody.instance ,candidateElementToAttach.attaches,!candidateElementToAttach.collides);
                    if (_nearestBall === undefined) {_nearestBall = candidateElementToAttach;return}
                    else {
                        const _distanceCandidateBall = candidateElementToAttach.mesh.getWorldPosition().distanceTo(_mesh.getWorldPosition());
                        const _distanceActualNearestBall = _nearestBall.mesh.getWorldPosition().distanceTo(_mesh.getWorldPosition());
                        _nearestBall= _distanceCandidateBall < _distanceActualNearestBall ? candidateElementToAttach : _nearestBall;
                    }

                });
            // console.log(_nearestBall);
            const _color = _mesh.material.color.clone();
            this.generateNewBallColor();
            _mainBall.returnToShooter(this.currentBallColor);
            _nearestBall.activate({color: _color,visible:true,opacity:1.0});


        }
        _mainBall.colliding = false;
    }

    generateNewBallColor = () => {
        this.currentBallColor = _.sample(this.ballColors);
    }

    render() {
        return null;
    }

    update = ( timeOfCurrentUpdateCallInMilliseconds ) => {

  
    }

}