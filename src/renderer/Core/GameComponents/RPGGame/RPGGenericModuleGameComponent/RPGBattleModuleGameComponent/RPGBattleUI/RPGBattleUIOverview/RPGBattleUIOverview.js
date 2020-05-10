import React from "react";
import PropTypes from "prop-types";
import "./RPGBattleUIOverview.css";

export class RPGBattleUIOverview extends React.Component {
    // load scenario
    render = ()=> {
        return <div className={"battle-overview"}>RPGBattleOverview </div>
    }
}

RPGBattleUIOverview.propTypes = {
    // scenarioId:PropTypes.string.isRequired,
};