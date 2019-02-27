import { connect } from "react-redux";
import { makeGameComponent } from "../../HOC/GameComponentHOC";
import {
  instantiateFromGameObject,
  instantiateFromPrefab,
  destroyGameObjectInstanceById,
} from "../../../../stores/scene/actions";

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
  return state.mainReducer.gameObjects.byId[parentId].components ? state.mainReducer.gameObjects.byId[parentId].components[id]: {};
}

const getSelfPrefab = (state, id,parentId) => {
  const _prefabId = state.mainReducer.gameObjects.byId[parentId].prefab;
  if (!_prefabId) {
    return {};
  }
  const _prefab = getPrefabs(state).byId[_prefabId];
  return _prefab.components && _prefab.components[id] ? _prefab.components[id] : {};
}

const getPrefabs = (state) => {
  return state.mainReducer.prefabs;
}

const mapDispatchToProps = (dispatch) => ({
  instantiateFromGameObject: (gameObjectId, transform, parentId) => {
    dispatch(instantiateFromGameObject(gameObjectId, transform, parentId));
  },
  instantiateFromPrefab: (prefabId, newId, transform, parentId) => {
    dispatch(instantiateFromPrefab(prefabId, newId, transform, parentId));
  },
  destroyGameObjectInstanceById: (gameObjectId) => {
    dispatch(destroyGameObjectInstanceById(gameObjectId));
  },
});


const mapStateToProps = (state,props) => ({
  ...props,
  gameObjects : state.mainReducer.gameObjects.byId,
  prefabs : state.mainReducer.prefabs,
  selfSettings: {...getSelfPrefab(state,props.id,props._parentId), ...getSelf(state,props.id,props._parentId)},
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
        mapDispatchToProps,
        null,
        { withRef: true },
    )(component);
  }
  return component;
};
