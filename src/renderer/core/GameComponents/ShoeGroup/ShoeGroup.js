import React from "react";
import PropTypes from "prop-types";

import * as GameObjectFactory from "../../Factories/GameObjectFactory";

export class ShoeGroup extends React.Component {
  // getShoes = () => {
  //   const { shoes, availableComponent, registerChildEntity } = this.props;
  //   return shoes.allIds.map((shoeId) => {
  //     const shoeData = shoes.byId[shoeId];
  //     const objectProps = {
  //       id: shoeData.id,
  //       key: shoeData.objectType + shoeData.id,
  //       availableComponent,
  //     };
  //
  //     const ShoeEntity = EntityFactory.create(shoeData.objectType);
  //
  //     return <ShoeEntity ref={registerChildEntity} {...objectProps} />;
  //   });
  // };

  getShoes = () => {
    const { user_shoes, availableComponent, registerChildGameObject } = this.props;
    // const _shoeData = user_shoes.byId[current_selected_shoe]
    return user_shoes.allIds.map((shoeId) => {
      const shoeData = user_shoes.byId[shoeId];
      const objectProps = {
        id: shoeId,
        key: shoeData.type + shoeId,
        availableComponent,
      };

      const ShoeGameObject = GameObjectFactory.create("shoe");

      return <ShoeGameObject ref={registerChildGameObject} {...objectProps} />;
    });
  };

  start = () => {};

  update = () => {
    const { shoesActive, transform } = this.props;
    transform.visible = shoesActive;
  };

  render() {
    return this.getShoes();
  }
}

ShoeGroup.propTypes = {
  shoesActive: PropTypes.bool,
  objects: PropTypes.array,
  transform: PropTypes.object,
};

ShoeGroup.defaultProps = {
  shoesActive: true,
  objects: [],
};
