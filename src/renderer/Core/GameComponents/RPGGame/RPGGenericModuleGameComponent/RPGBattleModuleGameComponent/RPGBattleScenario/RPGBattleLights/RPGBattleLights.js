import React from "react";
import PropTypes from "prop-types";
import "./RPGBattleLights.css";

export class RPGBattleLights extends React.Component {
    // load scenario
    render = ()=> {
        return <div className={"battle-lights"}>RPGBattleLights should render ui with battle lights {JSON.stringify(this.props.playerIds)}</div>
    }
}

RPGBattleLights.propTypes = {
    // scenarioId:PropTypes.string.isRequired,
};