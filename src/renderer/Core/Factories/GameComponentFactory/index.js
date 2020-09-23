import {connect} from "react-redux";
import {makeGameComponent} from "../../HOC/GameComponentHOC";
import {
    instantiateFromGameObject,
    instantiateFromPrefab,
    destroyGameObjectById,
    updateGameObjectComponent,
    updateGameObject
} from "../../../../stores/scene/actions";

import {components} from "../../GameComponents";

const getSelf = (state, id, parentId) => {
    return state.mainReducer.gameObjects.byId[parentId].components
        ? state.mainReducer.gameObjects.byId[parentId].components[id]
        : {};
};

const getSelfPrefab = (state, id, parentId) => {
    const _prefabId = state.mainReducer.gameObjects.byId[parentId].prefab;
    if (!_prefabId) {
        return {};
    }
    const _prefab = getPrefabs(state).byId[_prefabId];
    return _prefab.components && _prefab.components[id]
        ? _prefab.components[id]
        : {};
};

const getPrefabs = state => {
    return state.mainReducer.prefabs;
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    instantiateFromGameObject: (
        gameObjectId,
        transform,
        parentId,
        instantiationTime
    ) => {
        dispatch(
            instantiateFromGameObject(
                gameObjectId,
                transform,
                parentId,
                instantiationTime
            )
        );
    },
    instantiateFromPrefab: (
        prefabId,
        newId,
        transform,
        parentId,
        instantiationTime,
        components
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
    destroyGameObjectById: gameObjectId => {
        dispatch(destroyGameObjectById(gameObjectId));
    },
    updateGameObjectComponent: (
        gameObjectId,
        gameComponentId,
        componentParameters
    ) => {
        dispatch(
            updateGameObjectComponent(
                gameObjectId,
                gameComponentId,
                componentParameters
            )
        );
    },
    updateGameObject: (gameObjectId, gameObjectParameters) => {
        dispatch(updateGameObject(gameObjectId, gameObjectParameters));
    },
    updateSelf: componentParameters => {
        dispatch(
            updateGameObjectComponent(
                ownProps._parentId,
                ownProps.id,
                componentParameters
            )
        );
    },
    enqueueUpdateSelf: componentParameters => {
        const {enqueueAction} = ownProps.availableComponent.scene;
        enqueueAction(
            updateGameObjectComponent(
                ownProps._parentId,
                ownProps.id,
                componentParameters
            )
        );
    }
});

const mapStateToProps = (state, props) => ({
    ...props,
    gameObjects: state.mainReducer.gameObjects.byId,
    prefabs: state.mainReducer.prefabs,
    selfSettings: {
        ...getSelfPrefab(state, props.id, props._parentId),
        ...getSelf(state, props.id, props._parentId)
    }
});

export const create = type => {
    let component = components[type];
    if (!component) {
        alert(`Requested component '${type}' is non-existant!`);
    } else {
        component = makeGameComponent(component, type);
        component = connect(
            mapStateToProps,
            mapDispatchToProps,
            null,
            {
                forwardRef: true
            }
        )(component);
    }
    return component;
};