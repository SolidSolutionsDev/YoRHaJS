const nextObjectId = 0;
export const instantiate = (parameters) => ({
  type: "INSTANTIATE",
  ...parameters,
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