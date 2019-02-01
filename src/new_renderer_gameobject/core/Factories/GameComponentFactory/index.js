import { makeGameComponent } from "../../HOC/GameComponentHOC";

import { OBJMeshGeometry } from "../../GameComponents/OBJMeshGeometry/OBJMeshGeometry";
import { ObjectLoaderMesh } from "../../GameComponents/ObjectLoaderMesh/ObjectLoaderMesh";
import { TransformUpdate } from "../../GameComponents/TransformUpdate/TransformUpdate";
// import { EditorTransformObjectUpdate } from "../../Components/EditorTransformObjectUpdate/EditorTransformObjectUpdate";
import { CSSLabelTo3D } from "../../GameComponents/CSSLabelTo3D/CSSLabelTo3D";
import { SpriteComponent } from "../../GameComponents/Sprite/SpriteComponent";
import { ShoeGroup } from "../../GameComponents/ShoeGroup/ShoeGroup";
import { ShoeController } from "../../GameComponents/ShoeController/ShoeController";

export const create = (type) => {
  const _component = _components[type];
  if (!_component) {
    alert(`Requested component '${type}' is non-existant!`);
  }
  return _component;
};

const _components = {
  objMesh: makeGameComponent(OBJMeshGeometry, "OBJMeshGeometry"),
  objectLoader: makeGameComponent(ObjectLoaderMesh, "ObjectLoaderMesh"),
  cssLabelTo3d: makeGameComponent(CSSLabelTo3D, "CSSLabelTo3D"),
  sprite: makeGameComponent(SpriteComponent, "SpriteComponent"),
  transformUpdate: makeGameComponent(TransformUpdate, "TransformUpdate"),
  shoeGroup: makeGameComponent(ShoeGroup, "ShoeGroup"),
  shoeController: makeGameComponent(ShoeController, "ShoeController"),
};
