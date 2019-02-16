import React from "react";
import * as ComponentFactory from "../../../src/renderer/Core/Factories/GameComponentFactory";

const ObjectLoaderMeshComponent = ComponentFactory.create("objectLoader");
const ShoeManagerComponent = ComponentFactory.create(
  "shoeController",
);
// const TransformUpdateComponent = ComponentFactory.create("transformUpdate");

export class ShoeModel extends React.Component {
  render = () => (
    <div>
      {[
        <ObjectLoaderMeshComponent key="objectloadershoe" {...this.props} />,
        <ShoeManagerComponent key="shoemanager" {...this.props}/>,
      ]}
    </div>
  );
}
