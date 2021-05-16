import React from "react";
import PropTypes from "prop-types";
import "./RPGBattleCamera.css";

export class RPGBattleCamera extends React.Component {
  // load scenario
  render = () => {
    return (
      <div className={"battle-ui"}>
        RPGBattleUI should render ui with battle status and player controls and
        text {JSON.stringify(this.props.playerIds)}
      </div>
    );
  };
}

RPGBattleCamera.propTypes = {
  // scenarioId:PropTypes.string.isRequired,
};
