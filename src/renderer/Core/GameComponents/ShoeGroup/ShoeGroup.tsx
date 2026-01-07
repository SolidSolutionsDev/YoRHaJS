import React from "react";
// @ts-ignore
import GameObject from "../../GameObject";

interface ShoeGroupProps {
  shoesActive?: boolean;
  user_shoes?: any; // object
  availableComponent?: any;
  registerChildGameObject?: any;
  transform?: any;
}

export class ShoeGroup extends React.Component<ShoeGroupProps> {
  static defaultProps = {
    shoesActive: true,
    objects: []
  };

  getShoes = () => {
    const {
      user_shoes,
      availableComponent,
      registerChildGameObject
    } = this.props;
    // const _shoeData = user_shoes.byId[current_selected_shoe]
    return user_shoes.allIds.map((shoeId: string) => {
      const shoeData = user_shoes.byId[shoeId];
      const objectProps = {
        id: shoeId,
        key: shoeData.type + shoeId,
        availableComponent
      };

      // const ShoeGameObject = GameObject.create("shoe");

      return (
        <GameObject
          ref={registerChildGameObject}
          {...objectProps}
        />
      );
    });
  };

  start = () => { };

  update = () => {
    const { shoesActive, transform } = this.props;
    transform.visible = shoesActive;
  };

  render() {
    return this.getShoes();
  }
}

