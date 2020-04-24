/**
 * This Component initializes all the modules, registers them and provide access through the other modules
 */

import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";
import {instantiateFromPrefab, updateGameObjectComponent} from "../../../../stores/scene/actions";

export class RPGGameComponent extends React.Component {

    state = {modulesGameObjects: {}};

    registerModule = (moduleType, moduleGameObject) => {
    this.setState({
                 modulesGameObjects: {
                     ...this.state.modulesGameObjects,
                     [moduleType]: moduleGameObject
                 }
             });
};

    getModule = (moduleType) => {
        return this.state.modulesGameObjects[moduleType];
    };

init = () =>
{
    const {
        modulesPrefabs,
        modules,
        availableComponent,
        gameObject
    } = this.props;
    const {scene} = availableComponent;


    Object.keys(modulesPrefabs).forEach(modulePrefabKey => {
        const modulePrefab = modulesPrefabs[modulePrefabKey];
        const currentModuleId = _.uniqueId(modulePrefab);
        scene.enqueueAction(
            instantiateFromPrefab(
                modulePrefab,
                currentModuleId,
                null,
                gameObject.id,
                null,
                null,
            )
        );
        scene.enqueueAction(
            updateGameObjectComponent(
                gameObject.id,
                "rpgGameComponent", {
                    modules: {
                        ...modules,
                        [modulePrefabKey]: currentModuleId
                    },
                })
        );
    });
}

start()
{
    this.init();
}


}

RPGGameComponent.propTypes = {
    modulesPrefabs: PropTypes.exact({
        kernel: PropTypes.string.isRequired,
        menu: PropTypes.string,
        battle: PropTypes.string,
    }).isRequired,
};
