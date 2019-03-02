export const instantiateFromGameObject = (gameObjectId, transform, parentId) => ({
  type: "INSTANTIATE_FROM_GAMEOBJ",
  gameObjectId,
  transform,
  parentId,
});

export const instantiateFromPrefab = (prefabId, newId, transform, parentId) => ({
  type: "INSTANTIATE_FROM_PREFAB",
  newId,
  prefabId,
  transform,
  parentId,
});

export const updateSceneObject = (parametersObject) => ({
  type: "UPDATE_SCENE_PARAMETERS",
  parametersObject,
});

export const updateGameObjectComponent = (gameObjectId, gameComponentId, componentParameters) => ({
  type: "UPDATE_COMPONENT_PARAMETERS",
  gameObjectId,
  gameComponentId,
  componentParameters,
});

export const emitLoadingAsset = (filename, total) => ({
  type: "EMIT_LOADING_ASSET",
  filename,
  total,
});

export const registerCamera = (cameraId) => ({
  type: "REGISTER_CAMERA",
  cameraId,
});

export const removeCamera = (cameraId) => ({
  type: "REMOVE_CAMERA",
  cameraId,
});

export const setMainCamera = (cameraId) => ({
  type: "SET_MAIN_CAMERA",
  cameraId,
});

export const destroyGameObjectInstanceById = (gameObjectId) => ({
  type: "DESTROY_GAMEOBJECT_BYID",
  gameObjectId,
});