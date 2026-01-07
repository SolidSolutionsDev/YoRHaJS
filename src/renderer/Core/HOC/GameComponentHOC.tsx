import React from "react";
import * as _ from "lodash";

import * as GameContext from "../../GameContext";
import { IGameComponent } from "../../../types/GameObject";

interface GameComponentHOCState {
    started: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeGameComponent(WrappedComponent: any, name: string) {
    return class extends React.Component<any, GameComponentHOCState> { // Props are any for now as they are passed through
        component: IGameComponent | null = null;

        state: GameComponentHOCState = { started: false };

        uniqueId = _.uniqueId("component"); // for debug purposes

        // transform prop is required, but we'll let TS handle props validation via interfaces on usage

        getDisplayName = () =>
            name ||
            WrappedComponent.displayName ||
            WrappedComponent.name ||
            "Component";

        private unmounting = false;

        constructor(props: any) {
            super(props);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _displayName = this.getDisplayName();
            // Register with the parent GameObject if possible? 
            // The original code called props.registerComponent(this, _displayName).
            // This seems to register the wrapper, not the inner component.
            if (props.registerComponent) {
                props.registerComponent(this, _displayName);
            }
        }

        componentWillUnmount() {
            // console.log(this.uniqueId + " component will UNmount ", this.getDisplayName());
            this._onDestroy();
        }

        _onDestroy() {
            this.unmounting = true;
            if (this.component && this.component.onDestroy) {
                this.component.onDestroy();
            }
        }

        registerComponent = (component: any) => {
            this.component = component;
        };

        start = () => {
            if (this.component && this.component.start) {
                this.component.start();
            }
            this.setState({ started: true });
        };

        update = (time: number, deltaTime?: number) => {
            const { started } = this.state;
            if (this.unmounting) {
                return;
            }
            if (started) {
                if (this.component && this.component.update) {
                    this.component.update(time, deltaTime);
                }
                return;
            }
            this.start();
        };

        render() {
            // Wraps the input component in a container, without mutating it. Good!
            return (
                <GameContext.Consumer
                    key={`${this.props._parentId}_component_${this.props.id}_consumer`}
                >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(context: any) => {
                        return (
                            <WrappedComponent
                                key={`${this.props._parentId}_component_${this.props.id}`}
                                {...context}
                                {...this.props}
                                {...this.props.selfSettings}
                                ref={this.registerComponent}
                            />
                        );
                    }}
                </GameContext.Consumer>
            );
        }
    };
}
