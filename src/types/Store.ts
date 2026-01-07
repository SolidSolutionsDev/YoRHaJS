// import { IGameObject } from "./GameObject";

export interface GameSettings {
    speed: number;
    current_level: number;
}

export interface LevelData {
    walls: Record<string, any>;
    groups: Record<string, any>;
}

export interface GameLevels {
    byId: Record<string, LevelData>;
    allIds: string[];
}

export interface GameRendererSettings {
    alpha: boolean;
    antialias: boolean;
    postprocessing: boolean;
}

export interface GameStateData {
    settings: GameSettings;
    levels: GameLevels;
    renderer: GameRendererSettings;
}

export interface CameraState {
    main: string | null;
    allCameras: string[];
}

export interface SceneState {
    camera: CameraState;
    children: string[];
}

export interface GameObjectData {
    prefab?: string;
    debug?: boolean;
    transform?: {
        position?: { x: number; y: number; z: number };
        rotation?: { x: number; y: number; z: number };
        scale?: { x: number; y: number; z: number };
    };
    [key: string]: any; // Allow other props for now
}

export interface GameObjectsState {
    byId: Record<string, GameObjectData>;
    allIds: string[];
}

export interface PrefabData {
    components: Record<string, any>;
    children?: string[];
    debug?: boolean;
    transform?: any;
    [key: string]: any;
}

export interface PrefabsState {
    byId: Record<string, PrefabData>;
    allIds: string[];
}

export interface RootState {
    game: GameStateData;
    scene: SceneState;
    gameObjects: GameObjectsState;
    prefabs: PrefabsState;
    assetsLoadState?: Record<string, number>;
}
