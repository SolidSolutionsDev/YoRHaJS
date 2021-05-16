import React from "react";
import PropTypes from "prop-types";

export class TransformUpdate extends React.Component {
  ignoreTransformUpdate = false || this.props.ignoreTransformUpdate;

  ignoreTransformScaleUpdate = false || this.props.ignoreTransformScaleUpdate;

  ignoreTransformRotationUpdate =
    false || this.props.ignoreTransformRotationUpdate;

  ignoreTransformPositionUpdate =
    false || this.props.ignoreTransformPositionUpdate;

  start = () => {
    this.updateAllTransforms();
  };

  update = () => {
    if (!this.ignoreTransformUpdate) {
      this.updateAllTransforms();
    }
  };

  updateAllTransforms = () => {
    const { objectInputData } = this.props;
    if (!objectInputData) {
      return;
    }
    if (!this.ignoreTransformPositionUpdate) {
      this.setPosition();
    }

    if (!this.ignoreTransformScaleUpdate) {
      this.setScale();
    }

    if (!this.ignoreTransformRotationUpdate) {
      this.setRotation();
    }
  };

  setPosition = () => {
    const { transform, position } = this.props;
    transform.position.set(position.x, position.y, position.z);
  };

  setScale = () => {
    const { transform, scale } = this.props;
    transform.scale.set(scale.x, scale.y, scale.z);
  };

  setRotation = () => {
    const { transform, rotation } = this.props;
    transform.rotation.x = rotation.x;
    transform.rotation.y = rotation.y;
    transform.rotation.z = rotation.z;
  };
}

TransformUpdate.propTypes = {
  transform: PropTypes.object,
  ignoreTransformUpdate: PropTypes.bool
};
