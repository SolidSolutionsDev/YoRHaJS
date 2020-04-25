import React from "react";
import PropTypes from "prop-types";

export class RPGMenuModuleGameComponent extends React.Component {

    rpgModuleManager = this.props.parent.getComponent("rpgGameComponent");
    state = {
        active:false
    };

    activate = () => {
        this.setState({active:true});
        console.log(this.props.type," activate ", this.state);
    };

    deactivate = () => {
        this.setState({active:false});
        console.log(this.props.type," deactivate ", this.state);
    };

    updateModule = (time, deltaTime) => {
        console.log("updating Module ", this.props.type);
    };

    start = ()=> {
        const {type} = this.props;
        this.rpgModuleManager.registerModule(type,this);
    };

    render = ()=> {
        return <div key={"module"} >{this.props.type} Active : {this.state.active.toString()}</div>;
    }
}

RPGMenuModuleGameComponent.propTypes = {
    type:PropTypes.string.isRequired,
};
