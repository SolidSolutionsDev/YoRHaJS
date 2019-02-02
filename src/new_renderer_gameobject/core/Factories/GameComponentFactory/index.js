import { connect } from "react-redux";
import components from "../../GameComponents/*";
import { makeGameComponent } from "../../HOC/GameComponentHOC";

import { addObject, updateSceneObject } from "../../../stores/scene/actions";
//
// import { OBJMeshGeometry } from "../../GameComponents/OBJMeshGeometry/OBJMeshGeometry";
// import { ObjectLoaderMesh } from "../../GameComponents/ObjectLoaderMesh/ObjectLoaderMesh";
// import { TransformUpdate } from "../../GameComponents/TransformUpdate/TransformUpdate";
// // import { EditorTransformObjectUpdate } from "../../Components/EditorTransformObjectUpdate/EditorTransformObjectUpdate";
// import { CSSLabelTo3D } from "../../GameComponents/CSSLabelTo3D/CSSLabelTo3D";
// import { SpriteComponent } from "../../GameComponents/Sprite/SpriteComponent";
// import { ShoeGroup } from "../../GameComponents/ShoeGroup/ShoeGroup";
// import { ShoeController } from "../../GameComponents/ShoeController/ShoeController";


const getSelf = (state,id,parentId) => {
  return state.game.scene.gameObjects.byId[parentId].components[id];
}



const mapStateToProps = (state,props) => ({
  selfSettings: getSelf(state,props.id,props._parentId),
  ...state.game.scene,
});

export const create = (type) => {
  let component = components[type];
  if (!component) {
    alert(`Requested component '${type}' is non-existant!`);
  }
  else {
    component = makeGameComponent(component,type);
  }
  console.log("components",components);
  return component;
};

// const _components = {
//   objMesh: makeGameComponent(OBJMeshGeometry, "OBJMeshGeometry"),
//   objectLoader: makeGameComponent(ObjectLoaderMesh, "ObjectLoaderMesh"),
//   cssLabelTo3d: makeGameComponent(CSSLabelTo3D, "CSSLabelTo3D"),
//   sprite: makeGameComponent(SpriteComponent, "SpriteComponent"),
//   transformUpdate: makeGameComponent(TransformUpdate, "TransformUpdate"),
//   shoeGroup: makeGameComponent(ShoeGroup, "ShoeGroup"),
//   shoeController: makeGameComponent(ShoeController, "ShoeController"),
// };
