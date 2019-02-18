const nextObjectId = 0;

export const instantiateFromGameObject = (gameObjectId, transform, parentId) => ({
  type: "INSTANTIATE_FROM_GO",
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

export const emitLoadingAsset = (filename, total) => ({
  type: "EMIT_LOADING_ASSET",
  filename,
  total,
});