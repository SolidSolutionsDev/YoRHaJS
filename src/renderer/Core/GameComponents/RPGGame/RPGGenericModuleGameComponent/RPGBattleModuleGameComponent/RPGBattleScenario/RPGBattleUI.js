import React from "react";
import PropTypes from "prop-types";
import "RPGBattleUI.css";

export class RPGBattleUI extends React.Component {
    // load scenario
    render = ()=> {
        return <div className={"battle-ui"}>RPGBattleUI should render ui with battle status and player controls and text {JSON.stringify(this.props.playerIds)}</div>
    }
}

RPGBattleUI.propTypes = {
    // scenarioId:PropTypes.string.isRequired,
};