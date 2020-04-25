/**
 * This Component initializes all the modules, registers them and provide access through the other modules
 */

import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";
import {instantiateFromPrefab, updateGameObjectComponent} from "../../../../stores/scene/actions";
import {kernelConstants} from "../../../../stores/constants";

export class RPGGameComponent extends React.Component {

    state = {modulesGameObjects: {}, ready:false};


    registerModule = (moduleType, moduleGameObject) => {
        const {
            modulesPrefabs,
        } = this.props;
        const {
            modulesGameObjects,
        } = this.state;

        const _moduleTypeAlreadyLoaded = modulesGameObjects[moduleType] !== undefined;
    if (_moduleTypeAlreadyLoaded){
        console.log("Trying to register already registered module: " , moduleType);
        return;
    }
    let ready = false;
    const _loadedModules =  Object.keys(modulesGameObjects);
    const _missingModuleTypes = Object.keys(modulesPrefabs).filter((moduleKey)=> {return !_loadedModules.includes(moduleKey) && moduleKey !== moduleType });
    console.log(_loadedModules,moduleType,_missingModuleTypes);
    if (_missingModuleTypes.length === 0) {
        ready = true;
    }

    this.setState({
                 modulesGameObjects: {
                     ...this.state.modulesGameObjects,
                     [moduleType]: moduleGameObject
                 },
                ready,
             });
};

    getModule = (moduleType) => {
        return this.state.modulesGameObjects[moduleType];
    };

    isReady =() => {
        return this.state.ready;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {ready, modulesGameObjects}  = this.state;
        if (ready && !prevState.ready){
            const kernelId = kernelConstants.moduleTypes.kernel;
            modulesGameObjects[kernelId].init(modulesGameObjects);
        }
    }

    init = () =>
{
    const {
        modulesPrefabs,
        modules,
        availableComponent,
        gameObject,
        enqueueUpdateSelf
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
        enqueueUpdateSelf ( {
                    modules: {
                        ...modules,
                        [modulePrefabKey]: currentModuleId
                    },
                })

    });
};

start()
{
    this.init();
}


    render = () => {
        return this.state.ready ? <div key={"module"}>RPG Game</div> : null;
    }


}

RPGGameComponent.propTypes = {
    modulesPrefabs: PropTypes.exact({
        kernel: PropTypes.string.isRequired,
        menu: PropTypes.string,
        battle: PropTypes.string,
    }).isRequired,
};
