import React from "react";
import PropTypes from "prop-types";
import "./RPGBattleUIOverviewCharacterInfo.css";

export class RPGBattleUIOverviewCharacterInfo extends React.Component {
  render = () => {
    return (
      <div className={"battle-overview-character-info"}>
        RPGBattleUIOverviewCharacterInfo name, hp, mp, exp, time, active{" "}
      </div>
    );
  };
}

RPGBattleUIOverviewCharacterInfo.propTypes = {};
