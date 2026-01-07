import React from "react";

export interface IGameContext {
    availableComponent: any;
    availableService: any;
    game: any;
    loadedCallback: ((state: any) => void) | undefined;
    ref: any;
    key: string;
    id: string;
}

export const { Provider, Consumer } = React.createContext<IGameContext | null>(null);
