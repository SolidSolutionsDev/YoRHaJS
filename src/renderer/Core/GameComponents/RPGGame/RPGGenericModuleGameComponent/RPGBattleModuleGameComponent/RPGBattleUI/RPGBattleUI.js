import React from "react";
import PropTypes from "prop-types";
import "./RPGBattleUI.css";

export class RPGBattleUI extends React.Component {
    // load scenario
    render = () => {
        return <div className={"battle-ui"}>RPGBattleUI {JSON.stringify(this.props.playerIds)}</div>
    }
}

RPGBattleUI.propTypes = {
    scenarioId: PropTypes.string.isRequired,
};