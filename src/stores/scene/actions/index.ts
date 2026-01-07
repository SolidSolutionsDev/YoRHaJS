// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const instantiateFromGameObject = (gameObjectId: string, transform: any, parentId: string) => ({
  type: "INSTANTIATE_FROM_GAMEOBJ",
  gameObjectId,
  transform,
  parentId,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const instantiateFromPrefab = (prefabId: string, newId: string, transform: any, parentId: string, instantiationTime: number, components: any) => ({
  type: "INSTANTIATE_FROM_PREFAB",
  newId,
  prefabId,
  transform,
  parentId,
  instantiationTime,
  components
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateSceneObject = (parametersObject: any) => ({
  type: "UPDATE_SCENE_PARAMETERS",
  parametersObject,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateGameObjectComponent = (gameObjectId: string, gameComponentId: string, componentParameters: any) => ({
  type: "UPDATE_COMPONENT_PARAMETERS",
  gameObjectId,
  gameComponentId,
  componentParameters,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateGameObject = (gameObjectId: string, gameObjectParameters: any) => ({
  type: "UPDATE_GAMEOBJECT_PARAMETERS",
  gameObjectId,
  gameObjectParameters,
});

export const emitLoadingAsset = (filename: string, total: number) => ({
  type: "EMIT_LOADING_ASSET",
  filename,
  total,
});

export const registerCamera = (cameraId: string) => ({
  type: "REGISTER_CAMERA",
  cameraId,
});

export const removeCamera = (cameraId: string) => ({
  type: "REMOVE_CAMERA",
  cameraId,
});

export const setMainCamera = (cameraId: string) => ({
  type: "SET_MAIN_CAMERA",
  cameraId,
});

export const destroyGameObjectById = (gameObjectId: string) => ({
  type: "DESTROY_GAMEOBJECT_BYID",
  gameObjectId,
});
