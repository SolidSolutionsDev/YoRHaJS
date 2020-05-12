import React from "react";
import PropTypes from "prop-types";
import "./RPGBattleScenario.css";

export class RPGBattleScenario extends React.Component {
    // load scenario
    render = ()=> {
        return <div className={"battle-scenario"}>RPGBattleScenario {JSON.stringify(JSON.stringify(this.props))}</div>
    }
}

RPGBattleScenario.propTypes = {
    // scenarioId:PropTypes.string.isRequired,
};