import React from "react";
import PropTypes from "prop-types";

import "./RPGBattleParty.css";

// should init other characters
// manage positions
export class RPGBattleParty extends React.Component {
    render = () => {
        return <div className={"battle-party"}>RPGBattleParty should generate children
            components{JSON.stringify(this.props.playerIds)}</div>
    }
}

RPGBattleParty.propTypes = {
    //playerIds: PropTypes.array.isRequired,
    partyId: PropTypes.string.isRequired,
};

