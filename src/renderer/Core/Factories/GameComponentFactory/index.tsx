import { connect } from "react-redux";
import { makeGameComponent } from "../../HOC/GameComponentHOC";
import {
    instantiateFromGameObject,
    instantiateFromPrefab,
    destroyGameObjectById,
    updateGameObjectComponent,
    updateGameObject
} from "../../../../stores/scene/actions";

import { components } from "../../GameComponents";
// import { GameComponentProps } from "../../../../types/GameObject";

// Temporary until we type the store fully
type StateType = any;
// type ActionType = any;

const getSelf = (state: StateType, id: string, parentId: string) => {
    return state.mainReducer.gameObjects.byId[parentId].components
        ? state.mainReducer.gameObjects.byId[parentId].components[id]
        : {};
};

const getSelfPrefab = (state: StateType, id: string, parentId: string) => {
    const _prefabId = state.mainReducer.gameObjects.byId[parentId].prefab;
    if (!_prefabId) {
        return {};
    }
    const _prefab = getPrefabs(state).byId[_prefabId];
    return _prefab.components && _prefab.components[id]
        ? _prefab.components[id]
        : {};
};

const getPrefabs = (state: StateType) => {
    return state.mainReducer.prefabs;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    instantiateFromGameObject: (
        gameObjectId: string,
        transform: any,
        parentId: string,
        _instantiationTime: number
    ) => {
        dispatch(
            instantiateFromGameObject(
                gameObjectId,
                transform,
                parentId
            )
        );
    },
    instantiateFromPrefab: (
        prefabId: string,
        newId: string,
        transform: any,
        parentId: string,
        instantiationTime: number,
        components: any
    ) => {
        dispatch(
            instantiateFromPrefab(
                prefabId,
                newId,
                transform,
                parentId,
                instantiationTime,
                components
            )
        );
    },
    destroyGameObjectById: (gameObjectId: string) => {
        dispatch(destroyGameObjectById(gameObjectId));
    },
    updateGameObjectComponent: (
        gameObjectId: string,
        gameComponentId: string,
        componentParameters: any
    ) => {
        dispatch(
            updateGameObjectComponent(
                gameObjectId,
                gameComponentId,
                componentParameters
            )
        );
    },
    updateGameObject: (gameObjectId: string, gameObjectParameters: any) => {
        dispatch(updateGameObject(gameObjectId, gameObjectParameters));
    },
    updateSelf: (componentParameters: any) => {
        dispatch(
            updateGameObjectComponent(
                ownProps._parentId,
                ownProps.id,
                componentParameters
            )
        );
    }
});

const mapStateToProps = (state: StateType, props: any) => ({
    ...props,
    gameObjects: state.mainReducer.gameObjects.byId,
    prefabs: state.mainReducer.prefabs,
    selfSettings: {
        ...getSelfPrefab(state, props.id, props._parentId),
        ...getSelf(state, props.id, props._parentId)
    }
});

const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

export const create = (type: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let component = (components as any)[type];
    if (!component) {
        alert(`Requested component '${type}' is non-existant!`);
        return null;
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component = makeGameComponent(component, type) as any;
        component = connector(component);
    }
    return component;
};
