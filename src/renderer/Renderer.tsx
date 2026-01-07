import React from "react";
import Stats from "stats.js";
import * as THREE from "three";
import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass
} from "postprocessing";

export interface RendererProps {
    antialias?: boolean;
    alpha?: boolean;
    assetsLoadState?: any;
    loadedCallback?: (state: any) => void;
    availableComponent?: any; // Holds references to other components
    postprocessing?: boolean;
    backgroundColor?: number;
}

interface RendererState {
    ready?: boolean;
}

export class Renderer extends React.Component<RendererProps, RendererState> {
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        antialias: this.props.antialias,
        alpha: this.props.alpha,
        preserveDrawingBuffer: true
    });

    stats: Stats = new Stats();

    composer: any; // EffectComposer type might need explicit import or any
    effectPass: any; // EffectPass type

    canvas: HTMLCanvasElement = this.renderer.domElement;

    aspect: number = window.innerWidth / window.innerHeight;

    resizeFunctions: Array<() => void> = [];

    // Create a ref for the container div
    containerRef = React.createRef<HTMLDivElement>();

    state: RendererState = {};

    timePreviousFrame: number = 0;

    componentDidUpdate(prevProps: RendererProps, _prevState: RendererState, _snapshot: any) {
        const { assetsLoadState, loadedCallback } = this.props;

        const prevScene = prevProps.availableComponent?.scene;

        if (prevProps.assetsLoadState !== assetsLoadState && loadedCallback) {
            loadedCallback(assetsLoadState);
        }

        if (prevScene && this.hasSceneOrCameraChanged(prevScene)) {
            this.setPostProcessing();
        }
    }

    hasSceneOrCameraChanged = (prevScene: any) => {
        const { availableComponent } = this.props;
        const { scene } = availableComponent || {};

        if (!scene) return false;

        const _sceneChanged = scene.scene && scene !== prevScene;
        const _cameraChanged =
            scene.camera &&
            ((!prevScene.camera && prevScene.camera !== scene.camera) ||
                prevScene.camera?._main !== scene.camera?._main);

        const mainCameraReady = scene.camera?._main;
        /*
            console.log(
              "componentDidUpdate renderer",
              "_sceneChanged:",
              _sceneChanged,
              "_cameraChanged:",
              _cameraChanged,
              "mainCameraReady:",
              mainCameraReady
            );
        */
        return (
            _sceneChanged ||
            _cameraChanged ||
            (this.state.ready && mainCameraReady && !this.effectPass)
        );
    };

    // TODO: improve this, add parameters on render redux state
    setPostProcessing = () => {
        const { availableComponent, postprocessing } = this.props;
        if (!postprocessing) {
            return;
        }
        if (!this.composer) {
            this.composer = new EffectComposer(this.renderer);
        }
        const { scene } = availableComponent || {};
        if (!scene || !scene.camera || !scene.camera._main) return;

        this.effectPass = new EffectPass(scene.camera._main, new BloomEffect());
        this.effectPass.renderToScreen = true;
        this.composer.reset();
        this.composer.addPass(new RenderPass(scene.scene, scene.camera._main));
        this.composer.addPass(this.effectPass);
    };

    componentDidMount = () => { };

    init = () => {
        // Use the ref instead of findDOMNode
        if (this.containerRef.current) {
            this.containerRef.current.appendChild(this.canvas);
        }
        document.body.appendChild(this.stats.dom);
        this.setupRendererDefaults();
        this.setupCanvasDefaults();
        this.registerEventListeners();
        this.setState({ ready: true });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).THREE = THREE;
        this.onWindowResize(null);
    };

    update = (time: number) => {
        this.stats.begin();
        const { backgroundColor, availableComponent, postprocessing } = this.props;

        if (!availableComponent || !availableComponent.scene) {
            this.stats.end();
            return;
        }

        const mainCameraReady = availableComponent.scene.camera?._main;
        if (this.state.ready && mainCameraReady) {
            if (!postprocessing) {
                this.renderer.render(
                    //TODO rename scene.scene to scene.transform
                    availableComponent.scene.scene,
                    availableComponent.scene.camera._main
                );
            } else {
                // TODO: add post processing manager that reacts to redux state and make it optional between regular render
                this.effectPass || this.setPostProcessing();
                if (this.composer) {
                    this.composer.render(time - this.timePreviousFrame);
                }
            }
            this.timePreviousFrame = time;

            if (backgroundColor !== undefined) {
                this.renderer.setClearColor(backgroundColor, 0);
            }
        }
        this.stats.end();
    };

    setupCanvasDefaults() {
        if (this.canvas.parentElement) {
            this.canvas.parentElement.style.position = "absolute";
            this.canvas.parentElement.style.height = "100%";
            this.canvas.parentElement.style.left = "0";
            this.canvas.parentElement.style.top = "0";
            this.canvas.parentElement.style.zIndex = "-1";
        }
    }

    setupRendererDefaults() {
        this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.renderReverseSided = true; // deprecated or not on type? Check Three types.
        // this.renderer.shadowMap.renderSingleSided = true; // deprecated?
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.renderer.setClearColor(0x544c41, 0.9);
        this.renderer.sortObjects = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    registerEventListeners = () => {
        window.addEventListener("resize", this.onWindowResize, false);
    };

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    onWindowResize = (_event: Event | null) => {
        if (!this.renderer.domElement.parentElement) {
            return;
        }

        const SCREEN_WIDTH = this.renderer.domElement.parentElement.clientWidth;
        const SCREEN_HEIGHT = this.renderer.domElement.parentElement.clientHeight;
        this.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.resizeFunctions.forEach(resizeFunction => {
            resizeFunction();
        });
    };

    updateChildren = (_time: number) => {
        // Not actually used in Renderer.js provided, but was commented/stubbed? 
        // Original code had:
        /*
          updateChildren = time => {
              this.updateCallbacksArray.forEach(update => {
              update(time);
              });
          };
        */
        // But updateCallbacksArray was not defined or used in Renderer.js. It was in Game.js.
        // Renderer.js had:
        /*
           updateChildren = time => {
               this.updateCallbacksArray.forEach(update => {
               update(time);
               });
           };
        */
        // AND `this.updateCallbacksArray` is NOT defined in Renderer.js.
        // This method probably crashed if called. I'll omit or comment it out for safety unless I find usages. 
        // Assuming it was dead code copy-pasted.
    };

    subscribeResize = (onResizeFunction: () => void) => {
        this.resizeFunctions.push(onResizeFunction);
    };

    canvasWidth = () => this.canvas.width;

    canvasHeight = () => this.canvas.height;

    getAspect = () => this.aspect;

    render = () => (
        <div
            ref={this.containerRef}
            key="renderer"
            id="renderer"
            className="scene"
            style={{ width: "100%", height: "100%", position: "relative" }}
        />
    );
}
