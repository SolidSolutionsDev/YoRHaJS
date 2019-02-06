import { connect } from "react-redux";
import { makeGameComponent } from "../../HOC/GameComponentHOC";

// import { OBJMeshGeometry } from "../../GameComponents/OBJMeshGeometry/OBJMeshGeometry";
// import { EditorTransformObjectUpdate } from "../../Components/EditorTransformObjectUpdate/EditorTransformObjectUpdate";
import { ObjectLoaderMesh } from "../../GameComponents/ObjectLoaderMesh/ObjectLoaderMesh";
import { TransformUpdate } from "../../GameComponents/TransformUpdate/TransformUpdate";
import { CSSLabelTo3D } from "../../GameComponents/CSSLabelTo3D/CSSLabelTo3D";
import { SpriteComponent } from "../../GameComponents/Sprite/SpriteComponent";
import { ShoeGroup } from "../../GameComponents/ShoeGroup/ShoeGroup";
import { ShoeController } from "../../GameComponents/ShoeController/ShoeController";
import { Cube } from "../../GameComponents/Cube/Cube";
import {BoardPlaneGeometry} from "../../GameComponents/BoardPlaneGeometry/BoardPlaneGeometry";
import {DirectionalLight} from "../../GameComponents/DirectionalLight/DirectionalLight";
import {AmbientLight} from "../../GameComponents/AmbientLight/AmbientLight";
import {PointLight} from "../../GameComponents/PointLight/PointLight";
import {Camera} from "../../GameComponents/Camera/Camera";
import {ShooterControls} from "../../GameComponents/ShooterControls/ShooterControls";
import {ShooterGeometry} from "../../GameComponents/ShooterGeometry/ShooterGeometry";


const components = {
  // objMesh: OBJMeshGeometry,
  objectLoader: ObjectLoaderMesh,
  cssLabelTo3d: CSSLabelTo3D,
  sprite: SpriteComponent,
  transformUpdate: TransformUpdate,
  shoeGroup: ShoeGroup,
  shoeController: ShoeController,
  cube: Cube,
  boardPlaneGeometry: BoardPlaneGeometry,
  directionalLight: DirectionalLight,
  pointLight: PointLight,
  ambientLight: AmbientLight,
  dynamicCameraManager: Camera,
  shooterControls: ShooterControls,
  shooterGeometry: ShooterGeometry,
};


const getSelf = (state,id,parentId) => {
  return state.mainReducer.game.scene.gameObjects.byId[parentId].components[id];
}



const mapStateToProps = (state,props) => ({
  ...props,
  ...state.mainReducer.game.scene,
  selfSettings: getSelf(state,props.id,props._parentId),

});

export const create = (type) => {
  let component = components[type];
  if (!component) {
    alert(`Requested component '${type}' is non-existant!`);
  }
  else {
    component = makeGameComponent(component,type);
    component = connect(
        mapStateToProps,
        null,
        null,
        { withRef: true },
    )(component);
  }
  return component;
};
