import { Component } from "react";

export class InputService extends Component {
  keysToEventMap = {
    ArrowLeft: "lookleft",
    ArrowRight: "lookright",
    ArrowUp: "lookup",
    ArrowDown: "lookdown",
    s: "moveDown",
    a: "moveLeft",
    d: "moveRight",
    w: "moveUp",
    r: "restartGame",
    " ": "shoot",
    c: "camera_change",
    Enter: "select",
    Backspace: "backSelect"
  };

  constructor(props) {
    super(props);
    window.addEventListener("mousemove", event => {
      const _mouse3D = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
        z: 0.5
      };
      document.dispatchEvent(
        new CustomEvent("mouseM", { detail: { coordinates: _mouse3D } })
      );
    });
    window.addEventListener("mousedown", event => {
      const _mouse3D = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
        z: 0.5
      };
      document.dispatchEvent(
        new CustomEvent("mouseClickingStart", {
          detail: { coordinates: _mouse3D }
        })
      );
    });
    window.addEventListener("mousemove", event => {
      const _mouse3D = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
        z: 0.5
      };
      document.dispatchEvent(
        new CustomEvent("mouseClickingEnd", {
          detail: { coordinates: _mouse3D }
        })
      );
    });

    document.addEventListener("keydown", event => {
      event.preventDefault();
      const eventType = this.keysToEventMap[event.key];
      if (eventType) {
        const _eventTypeToLaunch = event.repeat
          ? eventType
          : eventType + "_keydown";
        // console.log(_eventTypeToLaunch);
        document.dispatchEvent(new Event(_eventTypeToLaunch));
      }
    });
    document.addEventListener("keyup", event => {
      event.preventDefault();
      const eventType = this.keysToEventMap[event.key];
      if (eventType) {
        document.dispatchEvent(new Event(eventType + "_keyup"));
      }
    });
  }

  render() {
    return null;
  }
}
