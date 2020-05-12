import React from "react";
import {kernelConstants} from "../../../../../stores/logic/rpgConstants";
import PropTypes from "prop-types";

export class RPGGameLogic extends React.Component {
// party base shared by all
// launch events?

    availableStatuses = kernelConstants.battleCharacterState;
    availableStatuses = kernelConstants.party;
    currentStatus = this.availableStatuses["ready"];
    time = .5;
    defaultSpeed = 0.4;
    speed = 0.2;
    hp = 321;
    maxHp = 1000;
    magic = 101;
    maxMagic = 200;
    experience = 1000;
    level = 1;

    registeredStatusEffects = [];

    registerStatusEffect = (statusEffect) => {

    };

    removeStatusEffect = (statusEffect) => {

    };

    checkStatusEffects = () => {

    };

    launchAttachTo = (target,attack) => {
    };

    sufferAttack = () => {

    };

    kill = () => {
        this.currentStatus = this.availableStatuses.dead;
    };

    reset = () => {
        this.currentStatus = this.availableStatuses.idle;
    };



    timePass = (deltaTime) => {
      const _newTime = this.time + deltaTime * this.speed;
      this.time = Math.min(_newTime,1.0);
    };

    update = (time, deltaTime) => {
      this.timePass(deltaTime);
    };
    start = () => {
    };
}

RPGGameLogic.propTypes = {
    name: PropTypes.string.isRequired
};