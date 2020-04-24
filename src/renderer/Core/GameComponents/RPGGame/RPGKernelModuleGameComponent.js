import React from "react";
import PropTypes from "prop-types";
import {RPGGameComponent} from "./RPGGameComponent";

export class RPGKernelModuleGameComponent extends React.Component {
    rpgModuleManager = this.props.parent.getComponent("rpgGameComponent");

    start = ()=> {
        const {type,parent} = this.props;
        this.rpgModuleManager.registerModule(type,this);
    };
}

RPGKernelModuleGameComponent.propTypes = {
    // initializationData: PropTypes.object.isRequired,
    type:PropTypes.string.isRequired,
    rpgModuleManager:PropTypes.string.isRequired,
    // soundPlayer:PropTypes.string.isRequired,
    // battleModule:PropTypes.string.isRequired,
    // menuModule:PropTypes.string.isRequired,
    // fieldModule:PropTypes.string,

};
