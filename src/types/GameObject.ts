import * as THREE from 'three';

/**
 * Transform interface matching Unity-like transform structure
 */
export interface Transform {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
}

/**
 * GameObject interface - core game entity
 */
export interface IGameObject {
    id: string;
    _type: 'GameObject';
    transform: THREE.Object3D;
    displayName: string;

    // Methods
    getComponent: (id: string) => any;
    getChildGameObjectById: (id: string, scene?: any) => IGameObject | null;
    getChildGameObjectByTag: (tag: string) => IGameObject | null;
    registerChildGameObject: (gameObject: IGameObject) => void;
    unRegisterChildGameObject: (gameObjectId: string) => void;
}

/**
 * Base props for all GameComponents
 */
export interface GameComponentProps {
    id: string;
    _parentId: string;
    transform: THREE.Object3D;
    transformState?: any;
    gameObject: IGameObject;
    selfSettings?: Record<string, any>;

    // Available components/services
    availableComponent?: {
        scene?: any;
        renderer?: any;
    };
    availableService?: {
        physics?: any;
        audio?: any;
        input?: any;
        animation?: any;
    };

    // Redux/Zustand actions
    gameObjects?: Record<string, any>;
    prefabs?: any;
    instantiateFromGameObject?: (
        gameObjectId: string,
        transform?: any,
        parentId?: string,
        instantiationTime?: number
    ) => void;
    instantiateFromPrefab?: (
        prefabId: string,
        newId: string,
        transform?: any,
        parentId?: string,
        instantiationTime?: number,
        components?: any
    ) => void;
    destroyGameObjectById?: (gameObjectId: string) => void;
    updateGameObjectComponent?: (
        gameObjectId: string,
        componentId: string,
        params: any
    ) => void;
    updateGameObject?: (gameObjectId: string, params: any) => void;
    updateSelf?: (params: any) => void;

    // Methods from GameObject
    registerComponent?: (component: any) => void;
    registerChildGameObject?: (gameObject: IGameObject) => void;
    getChildComponent?: (id: string) => any;
    getChildGameObjectById?: (id: string) => IGameObject | null;
    getChildGameObjectByTag?: (tag: string) => IGameObject | null;
}

/**
 * Base interface for GameComponent lifecycle
 */
export interface IGameComponent {
    start?: (time?: number) => void;
    update?: (time: number, deltaTime?: number) => void;
    onDestroy?: () => void;
}

/**
 * Scene state structure
 */
export interface SceneState {
    camera: {
        main: string | null;
        allCameras: string[];
    };
    children: string[];
}

/**
 * GameObject state structure
 */
export interface GameObjectsState {
    byId: Record<string, any>;
    allIds: string[];
}

/**
 * Prefabs state structure
 */
export interface PrefabsState {
    byId: Record<string, any>;
    allIds: string[];
}

/**
 * Full game state (used by Redux/Zustand)
 */
export interface GameState {
    gameObjects: GameObjectsState;
    scene: SceneState;
    prefabs: PrefabsState;
    assetsLoadState: Record<string, number>;
}
