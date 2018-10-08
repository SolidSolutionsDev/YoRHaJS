const states = {
  start: { mass: 0, nextState: this.moving },
  moving: { nextState: this.colliding },
  colliding: { nextState: this.attached, mass: 0 },
  attached: { mass: 0 }
};

export default states;
