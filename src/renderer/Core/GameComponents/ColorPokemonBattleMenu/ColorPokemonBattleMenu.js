import React from "react";
import PropTypes from "prop-types";
import {rgbToHex} from "../../../../utils/unitConvertUtils";

// TODO: see if this is the best approach to share state machine state
import {Machine, interpret} from "xstate";
import {rpgBattleMachine} from "../../../../state-machines/notUsed/rpgBattleStateMachine";
import {playerStats} from "../../../../solid-solutions-backend/constants/states";
import "./ColorPokemonBattleMenu.css"
import {instantiateFromPrefab} from "../../../../stores/scene/actions";
import * as _ from "lodash";

export class ColorPokemonBattleMenu extends React.Component {
    mainDiv;
    attacksMenu;
    indicator;
    pokemonBattleLogic;

    state = {
        inited: false
    };

    // service = interpret(rpgMachine).onTransition(current => {
    //     console.log("transition", current);
    //     this.setState({current, activePlayer: current.context.player});
    // });

    start = () => {
        this.pokemonBattleLogic = this.props.gameObject.getComponent("ColorPokemonLogic");
        this.service = this.pokemonBattleLogic.service.onTransition(current => {
            console.log("ColorPokemonBattleMenu transition", current);
            this.setState({current, activePlayer: current.context.player});
        });
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

        this.attacksMenu = document.createElement("div");
        this.attacksMenu.id = `slot${playerNumber}_attacks`;
        this.attacksMenu.className = "attacks";
        this.mainDiv.appendChild(this.attacksMenu);
        console.log(playerNumber);

        this.label = document.createElement("div");
        this.label.className = "battle-menu-label";
        this.label.innerHTML = "Player: " + playerNumber;
        this.attacksMenu.appendChild(this.label);
        if (!playerStats[playerNumber - 1].isBot) {
            playerStats[playerNumber - 1].attacks.forEach((attack) => {
                let attackBtn = document.createElement("button");
                attackBtn.innerHTML = attack.label;
                attackBtn.style.backgroundColor = rgbToHex(attack.damage);
                attackBtn.id = "btn";

                attackBtn.onclick = () => {
                    console.log("here", playerNumber, this.service, attack);
                    this.pokemonBattleLogic.attackByType[attack.type](attack);
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
        const {activePlayer, inited} = this.state;
        const {playerNumber} = this.props;

        if (!inited) {
            if (playerNumber !== undefined) {
                this.initMainDiv();
                this.initAttackUI();
                this.setState({inited: true});
            }
        } else {
            if (activePlayer === playerNumber) {
                this.attacksMenu.style.display = "inherit";
            } else {
                this.attacksMenu.style.display = "none";
            }
        }
    }

    update = () => {

    }
}

ColorPokemonBattleMenu.propTypes = {
    color: PropTypes.shape({r: PropTypes.number, g: PropTypes.number, b: PropTypes.number}),
};
