import React from "react";
import PropTypes from "prop-types";
import * as THREE from "three";

export class BaseComponent extends React.Component {

    start = () => {
    };

    update = () => {
    };

    render() {
        return null;
    }
}

BaseComponent.propTypes = {
    transform: PropTypes.object.isRequired
};
