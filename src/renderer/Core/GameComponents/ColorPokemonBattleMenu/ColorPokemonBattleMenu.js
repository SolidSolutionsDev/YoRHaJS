import React from "react";
import PropTypes from "prop-types";
import {rgbToHex} from "../../../../utils/unitConvertUtils";

// TODO: see if this is the best approach to share state machine state
import {Machine, interpret} from "xstate";
import {rpgMachine} from "../../../../state-machines/rpgStateMachine";
import {playerStats} from "../../../../solid-solutions-backend/constants/states";
import "./ColorPokemonBattleMenu.css"

export class ColorPokemonBattleMenu extends React.Component {
    mainDiv;
    attacksMenu;
    indicator;

    state= {
        inited:false
    };

    service = interpret(rpgMachine).onTransition(current => {
        console.log("transition", current);
        this.setState({current, activePlayer: current.context.player});
    });

    start = () => {
    };

    initMainDiv = () => {
        const id = this.props.gameObject.id;
        this.mainDiv = document.createElement("div");
        this.mainDiv.className = "player_UI";
        this.attachMenu(this.mainDiv);
    };

    initAttackUI = () => {
        const {gameObject} = this.props;
        const {send} = this.service;
        const {activePlayer} = this.state;
        const {playerNumber} = this.props;
        this.attacksMenu =  document.createElement("div");
        this.attacksMenu.id=`slot${playerNumber}_attacks`;
        this.attacksMenu.className ="attacks";
        this.mainDiv.appendChild(this.attacksMenu);
        console.log(playerNumber);
        if (!playerStats[playerNumber-1].isBot) {
            playerStats[playerNumber- 1].attacks.forEach((attack) => {
                let attackBtn = document.createElement("button");
                attackBtn.innerHTML = attack.label;
                attackBtn.style.backgroundColor = rgbToHex(attack.damage);
                attackBtn.id = "btn";

                attackBtn.onclick = () => {
                    send(`PLAYER_${playerNumber}_ATTACK`)
                };
                this.attacksMenu.appendChild(attackBtn);
            });
        }
    };

    attachMenu = (menuDiv) => {
        const {gameObject} = this.props;
        this.cssGameComponent = gameObject.getComponent(
            "CSSLabelTo3D"
        );
        this.cssGameComponent.attachDiv(this.mainDiv);
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.inited && this.props.playerNumber !== undefined) {

            this.initMainDiv();
            this.initAttackUI();
            this.setState({inited:true});
        }
    }

    update = () => {

    }
}

ColorPokemonBattleMenu.propTypes = {
    color:PropTypes.shape({r:PropTypes.number,g:PropTypes.number,b:PropTypes.number}),
};
