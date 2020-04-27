import React from "react";
import PropTypes from "prop-types";

export class ShoeController extends React.Component {
  shoeModelSiblingComponent;

  state = {
    initialized: false
  };

  previousSelectedObject;

  update = () => {
    const { initialized } = this.state;
    if (!initialized) {
      this.tryInitialization();
    }
  };

  getShoeModelComponent = () => {
    const { transform } = this.props;
    const _objectLoaderMesh = transform.gameObject.getComponent(
      "ObjectLoaderMesh"
    );
    this.shoeModelSiblingComponent = _objectLoaderMesh
      ? _objectLoaderMesh
      : null;
  };

  tryInitialization = () => {
    this.getShoeModelComponent();
    if (
      !this.shoeModelSiblingComponent ||
      !this.shoeModelSiblingComponent.transform.children.length
    ) {
      return;
    }
    // this.initListeners();
    this.updateModelMaterials();
    this.setState({ initialized: true });
  };

  updateModelMaterials = () => {
    const { shoeTypeData, shoeMaterialSet, shoeData } = this.props;
    if (!this.shoeModelSiblingComponent) {
      return;
    }
    const _shoe3dModel = this.shoeModelSiblingComponent.transform.getObjectByName(
      shoeTypeData.meshName
    );

    const _currentMeshMaterialDictionary = _shoe3dModel.material.reduce(
      (acc, material) => ({ ...acc, [material.name]: material }),
      {}
    );
    const _currentMeshCustomMaterialDictionary = shoeData.custom_materials;

    const _materialSetToApply = {
      ...shoeMaterialSet,
      ..._currentMeshCustomMaterialDictionary
    };

    // update colors
    Object.keys(_materialSetToApply).forEach(materialId => {
      _currentMeshMaterialDictionary[materialId].color.setHex(
        _materialSetToApply[materialId].color
      );
    });
  };

  componentDidUpdate = () => {
    this.updateModelMaterials();
  };

  start = () => {
    // this.disableAutoScale();
  };

  disableAutoScale = () => {
    const { transform } = this.props;
    transform.gameObject.getComponent(
      "transformUpdate"
    ).ignoreTransformScaleUpdate = true;
    transform.scale.set(1, 1, 1);
  };

  render() {
    return null;
  }
}

ShoeController.propTypes = {
  transform: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  shoeData: PropTypes.object.isRequired,
  shoeTypeData: PropTypes.object.isRequired,
  // shoeMaterialSet: PropTypes.object.isRequired,
  shoeColorOptions: PropTypes.object.isRequired
};
