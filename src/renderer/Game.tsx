import React from "react";

import Renderer from "./RendererContainer";
import Scene from "./Core/Scene/SceneContainer";
import { PhysicsService } from "./Services/PhysicsService";
import { AudioService } from "./Services/AudioService";
import { AnimationService } from "./Services/AnimationService";
import { InputService } from "./Services/InputService";

import * as GameContext from "./GameContext";

interface GameProps {
    loadedCallback?: (state: any) => void;
}

interface GameState {
    renderer: any;
    scene: any;
    ready: boolean;
    started: boolean;
    [key: string]: any; // Allow dynamic service/component assignment
}

export class Game extends React.Component<GameProps, GameState> {
    frame: number | null = null; // requestAnimationFrame ID

    state: GameState = {
        renderer: null,
        scene: null,
        ready: false,
        started: false
    };

    updateCallbacksArray: Array<(time: number, deltaTime: number) => void> = [];

    availableComponent: any = {};
    availableService: any = {};
    totalTimePaused: number = 0;
    isTabActive: boolean = true;
    lastActiveTime: number = 0;
    timeStartedPause: number = 0;
    unmounting: boolean = false;

    addGameService = (gameService: any) => {
        if (!gameService) {
            return;
        }
        // console.log(gameService);
        this.setState({ [gameService.props.id]: gameService });
        this.availableService[gameService.props.id] = gameService;
        if (this.availableService[gameService.props.id].update) {
            this.registerUpdate(this.availableService[gameService.props.id].update);
        }
    };

    addGameComponent = (gameComponent: any, alias?: string) => {
        if (!gameComponent) {
            return;
        }

        const componentPropretyName = alias ? alias : gameComponent.props.id;
        // console.log(gameComponent);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.setState({
            [componentPropretyName]: gameComponent
        } as any);
        this.availableComponent[componentPropretyName] = gameComponent;
        if (this.availableComponent[componentPropretyName].update) {
            this.registerUpdate(this.availableComponent[componentPropretyName].update);
        }
    };

    start = () => {
        const { renderer, scene } = this.state;
        if (renderer && renderer.init) renderer.init();
        if (scene && scene.init) scene.init();
        this.setActiveWatcher();
        this.animate(performance.now());
        this.setState({ started: true });
    };

    setActiveWatcher = () => {
        document.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange,
            false
        );
    };
    handleVisibilityChange = () => {
        if (document.hidden) {
            this.pauseSimulation();
        } else {
            this.startSimulation();
        }
    };

    startSimulation = () => {
        this.isTabActive = true;
        const timeFromLastPause = performance.now() - this.timeStartedPause;
        this.totalTimePaused += timeFromLastPause;
    };

    pauseSimulation = () => {
        this.isTabActive = false;
        this.timeStartedPause = performance.now();
    };

    animate = (time: number) => {
        if (this.unmounting) {
            return;
        }

        if (this.isTabActive) {
            const activeTime = time - this.totalTimePaused;
            const deltaTime = activeTime - this.lastActiveTime;
            this.updateChildren(activeTime, deltaTime);
            this.lastActiveTime = activeTime;
        }

        this.frame = requestAnimationFrame(this.animate);
    };

    registerUpdate = (update: (time: number, deltaTime: number) => void) => {
        this.updateCallbacksArray.push(update);
    };

    updateChildren = (time: number, deltaTime: number) => {
        this.updateCallbacksArray.forEach(update => {
            update && update(time, deltaTime);
        });
    };

    componentWillUnmount = () => {
        this.unmounting = true;
        if (this.frame) {
            cancelAnimationFrame(this.frame);
        }
        console.log("unmounting scene");
    };

    componentDidUpdate = () => {
        const { scene, renderer, started, ready } = this.state;
        if (!started && ready) {
            this.start();
            return;
        }
        if (!ready && renderer && scene) {
            this.setState({ ready: true });
        }
    };

    render = () => {
        if (this.unmounting) {
            return null;
        }
        // TODO: convert to "react context"
        const _propsList = {
            availableComponent: this.availableComponent,
            availableService: this.availableService,
            game: this,
            loadedCallback: this.props.loadedCallback
        };

        return (
            <GameContext.Provider value={{ ..._propsList }}>
                {/* @ts-ignore */}
                <Renderer
                    availableComponent={this.availableComponent}
                    availableService={this.availableService}
                    game={this}
                    loadedCallback={this.props.loadedCallback}
                    // @ts-ignore
                    ref={this.addGameComponent}
                    key="renderer"
                    id="renderer"
                />
                {/* @ts-ignore */}
                <Scene
                    availableComponent={this.availableComponent}
                    availableService={this.availableService}
                    game={this}
                    loadedCallback={this.props.loadedCallback}
                    // @ts-ignore
                    ref={this.addGameComponent}
                    key="scene"
                    id="scene"
                />
                <PhysicsService
                    availableComponent={this.availableComponent}
                    availableService={this.availableService}
                    game={this}
                    loadedCallback={this.props.loadedCallback}
                    // @ts-ignore
                    ref={this.addGameService}
                    key="physics"
                    id="physics"
                />
                <AudioService
                    availableComponent={this.availableComponent}
                    availableService={this.availableService}
                    game={this}
                    loadedCallback={this.props.loadedCallback}
                    // @ts-ignore
                    ref={this.addGameService}
                    key="audio"
                    id="audio"
                />
                <AnimationService
                    availableComponent={this.availableComponent}
                    availableService={this.availableService}
                    game={this}
                    loadedCallback={this.props.loadedCallback}
                    // @ts-ignore
                    ref={this.addGameService}
                    key="animation"
                    id="animation"
                />
                {/* @ts-ignore */}
                <InputService ref={this.addGameService} key="input" id="input" />
            </GameContext.Provider>
        );
    };
}
