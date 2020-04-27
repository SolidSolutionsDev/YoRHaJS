import React from "react";

import {kernelConstants} from "../../../../stores/constants";
import "./RPGBattlePlayerControls.css";

// character control menu
export class RPGBattlePlayerControls extends React.Component {

    availableCommands = kernelConstants.menuCommands;
    commandsDetails = kernelConstants.attackData;
    defaultCommandIndex = 0;

    updateTime = 0;
    startActiveMenuMovementTime = 0;
    activeTimesMenuMoved = 0;

    state = {
        selectedCommand: this.defaultCommandIndex,
        activeLeft: false,
        activeRight: false,
        activeUp: false,
        activeDown: false,
        movementCallback: null
    };

    menuChangeOptionInterval = 200;
    menuDiv;
    cssGameComponent;


    moveLeft = () => { };

    moveRight = () => { };

    moveUp = () => {
        let _currentCommandIndex = this.state.selectedCommand;
        _currentCommandIndex--;
        if (_currentCommandIndex < 0) {
            _currentCommandIndex = Object.keys(this.availableCommands).length - 1;
        }
        this.setState({selectedCommand: _currentCommandIndex});
    };

    moveDown = () => {
        let _currentCommandIndex = this.state.selectedCommand;
        _currentCommandIndex++;
        if (_currentCommandIndex > Object.keys(this.availableCommands).length -1) {
            _currentCommandIndex = 0;
        }
        this.setState({selectedCommand: _currentCommandIndex});
    };

    selectMenu = () => {
    };

    backMenu = () => {
    };

    resetMenuMovement = () => {
        this.activeTimesMenuMoved = 0;
        this.startActiveMenuMovementTime = this.updateTime;
    };

    eventsMap = {
        moveLeft_keydown: () => {
            this.resetMenuMovement();
            this.setState({activeLeft: true});
        },
        moveRight_keydown: () => {
            this.resetMenuMovement();
            this.setState({activeRight: true});
        },
        moveUp_keydown: () => {
            this.resetMenuMovement();
            this.setState({activeUp: true});
        },
        moveDown_keydown: () => {
            this.resetMenuMovement();
            this.setState({activeDown: true});
        },
        moveLeft_keyup: () => this.setState({activeLeft: false}),
        moveRight_keyup: () => this.setState({activeRight: false}),
        moveUp_keyup: () => this.setState({activeUp: false}),
        moveDown_keyup: () => this.setState({activeDown: false}),
        shoot: this.selectMenu,
        shoot_keyup: this.backMenu,
    };

    updateMenuMovement = () => {
        if (this.state.activeLeft) this.moveLeft();
        if (this.state.activeRight) this.moveRight();
        if (this.state.activeUp) this.moveUp();
        if (this.state.activeDown) this.moveDown();

    };

    updateSelectedMenuCommand = (time) => {
        const {activeLeft, activeRight, activeUp, activeDown} = this.state;
        if (activeLeft || activeRight || activeUp || activeDown) {
            // compute how many bullets to shoot now to catch up time step
            const totalTimesMenuChangedSinceActivated = this.activeTimesMenuMoved * this.menuChangeOptionInterval;
            const timePassedFromLastMenuMovement =
                time - (this.startActiveMenuMovementTime + totalTimesMenuChangedSinceActivated);
            const menuMovementsToDoNow = Math.floor(
                timePassedFromLastMenuMovement / this.menuChangeOptionInterval
            );
            for (let menuChangeIndex = 0; menuChangeIndex <= menuMovementsToDoNow; menuChangeIndex++) {
                this.updateMenuMovement();
                this.activeTimesMenuMoved++;
            }
        }
    };

    registerEvents = () => {
        Object.keys(this.eventsMap).forEach(event => {
            document.addEventListener(event, this.eventsMap[event]);
        });
    };

    initMenuDiv = () => {
        this.menuDiv = document.createElement("div");
        this.menuDiv.className = "battle-player-controls";
        this.attachMenu(this.menuDiv);
    };

    updateMenuUI = () => {
        if (!this.cssGameComponent) {
            this.attachMenu(this.menuDiv);
        }
        this.menuDiv.innerHTML = this.buildMenu();
    };

    buildMenu = () => {
        return `<div>Character Battle Controls UI test:<br> ${this.updateTime}
            <ul class="battle-menu">
                ${Object.values(this.availableCommands)
            .map(
                (commandId, index) => {
                    const attackData = this.commandsDetails[commandId];
                    const currentActive = this.state.selectedCommand === index;
                    return `<li
                                class="${`battle-menu-option ${ currentActive ? "battle-menu-option-selected" : ""}`}"
                            >
                                ${attackData.label}
                            </li>`;
                }).join("")}
            </ul>
        </div>`;
    };

    attachMenu = (menuDiv) => {
        const {gameObject} = this.props;
        this.cssGameComponent = gameObject.getComponent(
            "cssLabelTo3d"
        );
        this.cssGameComponent.attachDiv(menuDiv);
    };

    start = () => {
        this.initMenuDiv();
        this.registerEvents();
        // transform.add( this.mesh );
        // this.addMouseDebugMesh();
    };

    update = (time, deltaTime) => {
        this.updateTime = time;
        this.updateSelectedMenuCommand(time);
        this.updateMenuUI();
    };
}

