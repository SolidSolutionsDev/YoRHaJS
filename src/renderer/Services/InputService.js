import { Component } from "react";

export class InputService extends Component {
  constructor(props) {
    super(props);
    window.addEventListener("mousemove", function(event) {
      const _mouse3D = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
        z: 0.5
      };
      document.dispatchEvent(
        new CustomEvent("mouseM", { detail: { coordinates: _mouse3D } })
      );
    });

    document.addEventListener("keydown", function(event) {
      // console.log( 'Pressed: ', event,event.key );

      if (event.key === "ArrowLeft") {
        document.dispatchEvent(new Event("lookleft"));
      }

      if (event.key === "ArrowRight") {
        document.dispatchEvent(new Event("lookright"));
      }
      if (event.key === "ArrowUp") {
        document.dispatchEvent(new Event("lookup"));
      }

      if (event.key === "ArrowDown") {
        document.dispatchEvent(new Event("lookdown"));
      }
      // console.log(event.key);
      if (event.key === "s") {
        document.dispatchEvent(new Event("moveDown"));
      }

      if (event.key === "a") {
        document.dispatchEvent(new Event("moveLeft"));
      }

      if (event.key === "d") {
        document.dispatchEvent(new Event("moveRight"));
      }

      if (event.key === "w") {
        document.dispatchEvent(new Event("moveUp"));
      }

      if (event.key === "r") {
        document.dispatchEvent(new Event("restartGame"));
      }

      if (event.key === " ") {
        document.dispatchEvent(new Event("shoot"));
      }

      if (event.key === "c") {
        document.dispatchEvent(new Event("camera_change"));
      }
    });
    document.addEventListener("keyup", function(event) {
      // console.log( 'Pressed: ', event.key );

      if (event.key === "ArrowLeft") {
        document.dispatchEvent(new Event("lookleft_keyup"));
      }

      if (event.key === "ArrowRight") {
        document.dispatchEvent(new Event("lookright_keyup"));
      }
      if (event.key === "ArrowUp") {
        document.dispatchEvent(new Event("lookup_keyup"));
      }

      if (event.key === "ArrowDown") {
        document.dispatchEvent(new Event("lookdown_keyup"));
      }

      if (event.key === "s") {
        document.dispatchEvent(new Event("moveDown_keyup"));
      }

      if (event.key === "a") {
        document.dispatchEvent(new Event("moveLeft_keyup"));
      }

      if (event.key === "d") {
        document.dispatchEvent(new Event("moveRight_keyup"));
      }

      if (event.key === "w") {
        document.dispatchEvent(new Event("moveUp_keyup"));
      }

      if (event.key === "r") {
        document.dispatchEvent(new Event("restartGame_keyup"));
      }

      if (event.key === " ") {
        document.dispatchEvent(new Event("shoot_keyup"));
      }

      if (event.key === "c") {
        document.dispatchEvent(new Event("camera_change_keyup"));
      }
    });
  }

  render() {
    return null;
    // return <div  tabIndex="0"  onKeyDown={(keys,prevState)=> {console.log("a",keys);}}  />; // other way
  }
}
