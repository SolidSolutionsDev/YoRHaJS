import React from "react";
import PropTypes from "prop-types";
import "./RPGMenuModuleGameComponent.css";

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
        const {active} = this.state;
        return <div key={"module"} className={`menu ${active ? "" : "hidden"}`}>{this.props.type} Active : {active.toString()}</div>;
    }
}

RPGMenuModuleGameComponent.propTypes = {
    type:PropTypes.string.isRequired,
};
