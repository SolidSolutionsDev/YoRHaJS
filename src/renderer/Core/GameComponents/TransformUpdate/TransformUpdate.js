import React from "react";
import PropTypes from "prop-types";

export class TransformUpdate extends React.Component {
  ignoreTransformUpdate = false;

  ignoreTransformScaleUpdate = false;

  ignoreTransformRotationUpdate = false;

  ignoreTransformPositionUpdate = false;

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
    const { transform, objectInputData } = this.props;
    transform.position.set(
      objectInputData.position.x,
      objectInputData.position.y,
      objectInputData.position.z
    );
  };

  setScale = () => {
    const { transform, objectInputData } = this.props;
    transform.scale.set(
      objectInputData.scale.x,
      objectInputData.scale.y,
      objectInputData.scale.z
    );
  };

  setRotation = () => {
    const { transform, objectInputData } = this.props;
    transform.rotation.x = objectInputData.rotation.x;
    transform.rotation.y = objectInputData.rotation.y;
    transform.rotation.z = objectInputData.rotation.z;
  };
}

TransformUpdate.propTypes = {
  transform: PropTypes.object,
  objectInputData: PropTypes.object,
  ignoreTransformUpdate: PropTypes.bool
};
