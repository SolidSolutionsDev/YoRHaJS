import React from "react";

import {kernelConstants} from "../../../../../../../../stores/rpgLogic/rpgConstants";
import "./RPGBattleUIPlayerControls.css";

// character control menu
export class RPGBattleUIPlayerControls extends React.Component {

    availableCommands = kernelConstants.menuCommands;
    commandsDetails = kernelConstants.attackData;
    defaultCommandIndex = 0;

    updateTime = 0;
    startActiveMenuMovementTime = 0;
    activeTimesMenuMoved = 0;

    menuMoveSound;
    menuMoveSelectSound;

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

    //TODO: Move to sound player component - also used in shooter
    initSound = (soundId) => {
        //menuMoveSoundId
        //menuSelectSoundId
        const {transform, availableService, selfSettings} = this.props;
        if (!selfSettings[soundId]) {
            return;
        }
        const _menuMoveSoundObject = availableService.audio.buildNonPositionalSound(
            selfSettings[soundId], selfSettings[soundId]
        );
        const _sound = _menuMoveSoundObject.sound;

        _sound.setLoop(false);
        _sound.loop = false;
        transform.add(_sound);
        if (_sound.isPlaying) {
            _sound.stop();
        }
        return _sound;
    };

    moveLeft = () => {
    };

    moveRight = () => {
    };

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
        if (_currentCommandIndex > Object.keys(this.availableCommands).length - 1) {
            _currentCommandIndex = 0;
        }
        this.setState({selectedCommand: _currentCommandIndex});
    };

    selectMenu = () => {
        this.menuMoveSelectSound.play();
    };

    backMenu = () => {
    };

    resetMenuMovement = () => {
        this.activeTimesMenuMoved = 0;
        this.startActiveMenuMovementTime = this.updateTime;
    };

    setActivateMoveInDirection = (activeStateId) => {
        this.resetMenuMovement();
        this.setState({[activeStateId]: true});
    };

    eventsMap = {
        moveLeft_keydown: () => {
            this.setActivateMoveInDirection("activeLeft");
        },
        moveRight_keydown: () => {
            this.setActivateMoveInDirection("activeRight");
        },
        moveUp_keydown: () => {
            this.setActivateMoveInDirection("activeUp");
        },
        moveDown_keydown: () => {
            this.setActivateMoveInDirection("activeDown");
        },
        moveLeft_keyup: () => this.setState({activeLeft: false}),
        moveRight_keyup: () => this.setState({activeRight: false}),
        moveUp_keyup: () => this.setState({activeUp: false}),
        moveDown_keyup: () => this.setState({activeDown: false}),
        select_keydown: this.selectMenu,
        backSelect_keydown: this.backMenu,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.selectedCommand !== prevState.selectedCommand) {
            if (!this.menuMoveSound) {
                return;
            }
            if (this.menuMoveSound.isPlaying) {
                this.menuMoveSound.stop();
            }
            this.menuMoveSound.play();
        }
    }

    updateMenuMovement = () => {
        if (this.state.activeLeft) this.moveLeft();
        if (this.state.activeRight) this.moveRight();
        if (this.state.activeUp && !this.state.activeDown) this.moveUp();
        if (this.state.activeDown && !this.state.activeUp) this.moveDown();
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
                                class="${`battle-menu-option ${currentActive ? "battle-menu-option-selected" : ""}`}"
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
            "CSSLabelTo3D"
        );
        this.cssGameComponent.attachDiv(menuDiv);
    };

    start = () => {
        this.initMenuDiv();

        this.menuMoveSound = this.initSound("menuMoveSoundId");
        this.menuMoveSelectSound = this.initSound("menuSelectSoundId");
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

