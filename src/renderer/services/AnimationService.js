import React, { Component } from "react";

import TWEEN from "@tweenjs/tween.js";

export class AnimationService extends Component {

  update = (time) => {
    TWEEN.update(time);
  };

  render() {
    return <div>Animation</div>;
  }
}
