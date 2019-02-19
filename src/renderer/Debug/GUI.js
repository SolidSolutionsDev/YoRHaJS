import "./react-dat-gui.css";
import PropTypes from "prop-types";
import React from "react";

import DatGui, {
  DatBoolean,
  DatButton,
  DatNumber,
  DatString,
  DatColor,
  DatSelect,
} from "react-dat-gui";

export class GUI extends React.Component {
  updateShoeSet = (data) => {
    const { updateSceneObject, updateShoe,updateShoeMaterial, applicationState } = this.props;
    if (applicationState.custom_shoe.option !== data.custom_shoe.option) {
      updateShoe(applicationState.currentShoeId, data.custom_shoe);
    } else {
      updateShoeMaterial(applicationState.currentShoeId, data.custom_shoe);
    }
    updateSceneObject(data.scene);
    // console.log(data);
  };

  buildColorList = () => {
    //const { applicationState } = this.props;
  }


  render() {
    const { applicationState } = this.props;
    // console.log(typeState);
    if (!applicationState.scene.debug) {
      return null;
    }
    return [
      <DatGui
        data={applicationState}
        key="shoeSet"
        onUpdate={this.updateShoeSet}
      >
        <DatBoolean
          path="scene.debug"
          label="Debug"
        />
        <DatBoolean
          path="scene.cameraAutoRotate"
          label="Camera AutoRotate"
        />
        <DatSelect
          path="custom_shoe.option"
          options={applicationState.availableShoeColorSets}
        />
        <DatColor path="scene.backgroundColor" label="Background" />
      </DatGui>,
      // <DatGui data={applicationState} onUpdate={this.updateShoeColor}>
      //   <DatColor
      //      path="backgroundColor"
      //     label="Unelected Object Color"
      //   />
      //   </DatGui>,
      //     <DatGui data={applicationState} key="scene" onUpdate={this.updateScene}>
      //    <DatColor path="backgroundColor" label="Background" />
      // </DatGui>,
    ];
  }
}

GUI.propTypes = {
  applicationState: PropTypes.object,
  typeState: PropTypes.object,
  colorState: PropTypes.object,
  updateSceneObject: PropTypes.func,
};
