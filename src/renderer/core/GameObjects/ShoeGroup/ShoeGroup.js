import React from "react";
import * as ComponentFactory from "../../Factories/GameComponentFactory/index";

const ShoeGroupComp = ComponentFactory.create("shoeGroup");

export class ShoeGroup extends React.Component {
  render = () => {
    return <ShoeGroupComp key="shoeGroup" {...this.props} />;
  };
}
