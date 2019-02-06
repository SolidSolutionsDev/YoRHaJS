import React from "react";
import * as ComponentFactory from "../../Factories/GameComponentFactory";

const ObjectLoaderComponent = ComponentFactory.create("objectLoader");
// const TransformUpdateComponent = ComponentFactory.create("transformUpdate");

export class LightGroup extends React.Component {
  render = () => (
    <div>
      {[
        <ObjectLoaderComponent key="model" {...this.props} />,
        // <TransformUpdateComponent key="transform" {...this.props} />,
      ]}
    </div>
  );
}
