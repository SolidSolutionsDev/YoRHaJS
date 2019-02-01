import { makeGameObject } from "../../HOC/GameObjectHOC";

import { ShoeGroup } from "../../GameObjects/ShoeGroup/ShoeGroup";
import LightGroupContainer from "../../GameObjects/LightGroup/LightGroupContainer";
import ShoeModelContainer from "../../GameObjects/ShoeModel/ShoeModelContainer";

const EmptyGameObject = () => null;

export const create = (type) => {
  let _gameObject = _gameObjects[type];
  if (!_gameObject) {
    alert(`Requested gameObject '${type}' is non-existant!`);
    _gameObject = _gameObjects.default;
  }
  return _gameObject;
};

const _gameObjects = {
  lightGroup: makeGameObject(LightGroupContainer, "lightGroup"),
  default: makeGameObject(EmptyGameObject, "default"),
  shoe: makeGameObject(ShoeModelContainer, "shoe"),
  shoeGroup: makeGameObject(ShoeGroup, "shoeGroup"),
};
