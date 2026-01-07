import React from 'react';
import { useGameStore } from '../../../../stores/gameStore';
import { makeGameComponent } from '../../HOC/GameComponentHOC';
import { components } from '../../GameComponents';

// Import TypeScript types for type checking
/** @typedef {import('../../../../types/GameObject').GameComponentProps} GameComponentProps */
/** @typedef {import('../../../../types/GameObject').IGameObject} IGameObject */

/**
 * Zustand wrapper for GameComponents
 * Provides the same prop interface as Redux connect() for compatibility
 * @param {React.ComponentType<GameComponentProps>} Component - The component to wrap
 * @param {string} componentId - The component type identifier
 * @returns {React.ForwardRefExoticComponent<any>} Wrapped component with Zustand store
 */
function withGameStore(Component, componentId) {
    return React.forwardRef((props, ref) => {
        // Get state from Zustand
        const gameObjects = useGameStore((state) => state.gameObjects.byId);
        const prefabs = useGameStore((state) => state.prefabs);

        // Get actions from Zustand
        const instantiateFromGameObject = useGameStore((state) => state.instantiateFromGameObject);
        const instantiateFromPrefab = useGameStore((state) => state.instantiateFromPrefab);
        const destroyGameObjectById = useGameStore((state) => state.destroyGameObjectById);
        const updateComponentParameters = useGameStore((state) => state.updateComponentParameters);
        const updateGameObjectParameters = useGameStore((state) => state.updateGameObjectParameters);

        // Helper functions (same as Redux version)
        const getSelf = (parentId, id) => {
            return gameObjects[parentId]?.components?.[id] || {};
        };

        const getSelfPrefab = (parentId, id) => {
            const prefabId = gameObjects[parentId]?.prefab;
            if (!prefabId) return {};
            const prefab = prefabs.byId[prefabId];
            return prefab?.components?.[id] || {};
        };

        // Prepare props (same interface as Redux)
        const selfSettings = {
            ...getSelfPrefab(props._parentId, props.id),
            ...getSelf(props._parentId, props.id),
        };

        // IMPORTANT: Merge carefully to preserve gameObject and other critical props
        const injectedProps = {
            // First, inject Zustand state
            gameObjects,
            prefabs,

            // Then add Zustand actions with same signatures as Redux
            instantiateFromGameObject: (gameObjectId, transform, parentId, instantiationTime) => {
                instantiateFromGameObject(gameObjectId, transform, parentId, instantiationTime);
            },
            instantiateFromPrefab: (prefabId, newId, transform, parentId, instantiationTime, components) => {
                instantiateFromPrefab(prefabId, newId, transform, parentId, instantiationTime, components);
            },
            destroyGameObjectById: (gameObjectId) => {
                destroyGameObjectById(gameObjectId);
            },
            updateGameObjectComponent: (gameObjectId, gameComponentId, componentParameters) => {
                updateComponentParameters(gameObjectId, gameComponentId, componentParameters);
            },
            updateGameObject: (gameObjectId, gameObjectParameters) => {
                updateGameObjectParameters(gameObjectId, gameObjectParameters);
            },
            updateSelf: (componentParameters) => {
                updateComponentParameters(props._parentId, props.id, componentParameters);
            },

            // CRITICAL: Spread props from GameObject (gameObject, transform, methods, etc.)
            ...props,

            // CRITICAL: Spread selfSettings LAST to override with component-specific config
            ...selfSettings,
        };

        return <Component ref={ref} {...injectedProps} />;
    });
}

/**
 * Create a GameObject component with Zustand integration
 */
export const create = (type) => {
    let component = components[type];
    if (!component) {
        alert(`Requested component '${type}' is non-existant!`);
        return null;
    }

    // Wrap with game component lifecycle
    component = makeGameComponent(component, type);

    // Wrap with Zustand store
    component = withGameStore(component, type);

    return component;
};
