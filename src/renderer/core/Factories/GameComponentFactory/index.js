import { connect } from "react-redux";
// import components from "../../GameComponents/*";
import { makeGameComponent } from "../../HOC/GameComponentHOC";

// import { addObject, updateSceneObject } from "../../../stores/scene/actions";
//
// import { OBJMeshGeometry } from "../../GameComponents/OBJMeshGeometry/OBJMeshGeometry";
import { ObjectLoaderMesh } from "../../GameComponents/ObjectLoaderMesh/ObjectLoaderMesh";
import { TransformUpdate } from "../../GameComponents/TransformUpdate/TransformUpdate";
// import { EditorTransformObjectUpdate } from "../../Components/EditorTransformObjectUpdate/EditorTransformObjectUpdate";
import { CSSLabelTo3D } from "../../GameComponents/CSSLabelTo3D/CSSLabelTo3D";
import { SpriteComponent } from "../../GameComponents/Sprite/SpriteComponent";
import { ShoeGroup } from "../../GameComponents/ShoeGroup/ShoeGroup";
import { ShoeController } from "../../GameComponents/ShoeController/ShoeController";
import { Cube } from "../../GameComponents/Cube/Cube";
import {GameObject} from "../../GameObject/GameObject";


const components = {
  // objMesh: OBJMeshGeometry,
  objectLoader: ObjectLoaderMesh,
  cssLabelTo3d: CSSLabelTo3D,
  sprite: SpriteComponent,
  transformUpdate: TransformUpdate,
  shoeGroup: ShoeGroup,
  shoeController: ShoeController,
  cube: Cube,
  // directionalLight: DirectionalLight(),
};


const getSelf = (state,id,parentId) => {
  return state.mainReducer.game.scene.gameObjects.byId[parentId].components[id];
}



const mapStateToProps = (state,props) => ({
  ...props,
  ...state.mainReducer.game.scene,
  selfSettings: getSelf(state,props.id,props._parentId),
  // selfSettings: "getSelf(state,props.id,props._parentId)",

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
  console.log("components",components);
  return component;
};
