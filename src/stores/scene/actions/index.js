const nextObjectId = 0;
export const addObject = (parameters) => ({
  type: "ADD_OBJECT",
  // id: `object_${nextObjectId++}`,
  // parameters,
  // TODO
});

export const emitLoadingAsset = (filename, total) => ({
  type: "EMIT_LOADING_ASSET",
  filename,
  total,
});

export const updateSceneObject = (parametersObject) => ({
  type: "UPDATE_SCENE_PARAMETERS",
  parametersObject,
});
