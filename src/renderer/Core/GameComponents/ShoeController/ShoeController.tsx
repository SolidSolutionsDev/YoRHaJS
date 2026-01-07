import React from "react";

interface ShoeControllerProps {
  transform: any;
  isSelected: boolean;
  shoeData: any;
  shoeTypeData: any;
  shoeMaterialSet?: any;
  shoeColorOptions: any;
}

interface ShoeControllerState {
  initialized: boolean;
}

export class ShoeController extends React.Component<ShoeControllerProps, ShoeControllerState> {
  shoeModelSiblingComponent: any;

  state: ShoeControllerState = {
    initialized: false
  };

  previousSelectedObject: any;

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

    if (!_shoe3dModel) return;

    // shoe3dModel.material is likely an array if multi-material, or single material
    const materials = Array.isArray(_shoe3dModel.material) ? _shoe3dModel.material : [_shoe3dModel.material];

    const _currentMeshMaterialDictionary = materials.reduce(
      (acc: any, material: any) => ({ ...acc, [material.name]: material }),
      {}
    );
    const _currentMeshCustomMaterialDictionary = shoeData.custom_materials;

    const _materialSetToApply = {
      ...shoeMaterialSet,
      ..._currentMeshCustomMaterialDictionary
    };

    // update colors
    Object.keys(_materialSetToApply).forEach(materialId => {
      if (_currentMeshMaterialDictionary[materialId]) {
        _currentMeshMaterialDictionary[materialId].color.setHex(
          _materialSetToApply[materialId].color
        );
      }
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
      "TransformUpdate"
    ).ignoreTransformScaleUpdate = true;
    transform.scale.set(1, 1, 1);
  };

  render() {
    return null;
  }
}

