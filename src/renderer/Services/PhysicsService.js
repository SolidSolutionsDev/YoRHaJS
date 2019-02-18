import { Component } from "react";
import * as CANNON from "cannon";
import * as _ from "lodash";

export class PhysicsService extends Component {
  world = new CANNON.World({
    // gravity: new CANNON.Vec3( 0, -9.82, 0 )
    gravity: new CANNON.Vec3(0, 0, -9)
  });

  groundMaterial = new CANNON.Material("groundMaterial");
  slipperyMaterial = new CANNON.Material("slipperyMaterial");

  fixedTimeStep = 1.0 / 60.0; // seconds
  maxSubSteps = 3;
  TimeOfLastUpdateCallInMilliseconds;
  physicsUpdateFunctions = [];

  componentDidMount = () => {
    this.slipperyMaterial.restitution = 1.0;
    this.slipperyMaterial.frictionAir = 0.0;
    this.slipperyMaterial.friction = 0.0;
    this.initMaterials();
    this.initContactEvents();
  };

  initContactEvents = () => {
    this.world.addEventListener("beginContact", function(e) {
      // console.log( `Collided with ${e.body.mesh.name}'s body:`, e );

      // console.log( `Contact between ${e.bodyA.mesh.name} and ${e.bodyB.mesh.name} bodies began:`,          e.bodyA, e.bodyB, e );

      e.bodyA.beginContactFunction
        ? e.bodyA.beginContactFunction(e.bodyB)
        : null;
      e.bodyB.beginContactFunction
        ? e.bodyB.beginContactFunction(e.bodyA)
        : null;
    });
    this.world.addEventListener("endContact", function(e) {
      // console.log( `Collided with ${e.body.mesh.name}'s body:`, e );
      // console.log( `Contact between ${e.bodyA.mesh.name} and ${e.bodyB.mesh.name} bodies end:`,          e.bodyA, e.bodyB, e );
      e.bodyA.endContactFunction ? e.bodyA.endContactFunction(e.bodyB) : null;
      e.bodyB.endContactFunction ? e.bodyB.endContactFunction(e.bodyA) : null;
    });
  };

  initMaterials = () => {
    // Materials
    // Adjust constraint equation parameters for ground/ground contact
    const ground_ground_cm = new CANNON.ContactMaterial(
      this.groundMaterial,
      this.groundMaterial,
      {
        friction: 0.4,
        restitution: 0.3,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
        frictionEquationRegularizationTime: 3
      }
    );
    // Add contact material to the world
    this.world.addContactMaterial(ground_ground_cm);
    // Create a slippery material (friction coefficient = 0.0)

    // The ContactMaterial defines what happens when two materials meet.
    // In this case we want friction coefficient = 0.0 when the slippery material touches ground.
    const slippery_ground_cm = new CANNON.ContactMaterial(
      this.slipperyMaterial,
      this.groundMaterial,
      {
        friction: 0.0,
        restitution: 1.0,
        frictionAir: 0.0
      }
    );

    this.world.addContactMaterial(slippery_ground_cm);

    const slippery_slippery_cm = new CANNON.ContactMaterial(
      this.slipperyMaterial,
      this.slipperyMaterial,
      {
        friction: 0.0,
        restitution: 1.0,
        frictionAir: 0.0
      }
    );
    // We must add the contact materials to the world
    this.world.addContactMaterial(slippery_slippery_cm);
  };

  generateUpdateFunction = (mesh, body) => {
    return function updateFunction() {
      const _oldPosition = body.position.clone();
      body.mesh.position.x = body.position.x;
      body.mesh.position.y = body.position.y;
      body.mesh.position.z = body.position.z;
      body.mesh.quaternion.set(
        body.quaternion.x,
        body.quaternion.y,
        body.quaternion.z,
        body.quaternion.w
      );
      // console.log( body.position );
      //WIP HERE!!!
    };
  };

  Vec3 = (x, y, z) => {
    return new CANNON.Vec3(x, y, z);
  };

  typeEnum = Object.freeze({ kinematic: CANNON.Body.KINEMATIC });

  addNewSphereBody(mesh, parameters, instance) {
    let thisSphereParameters = {
      mass: 5,
      position: { x: 0, y: 0, z: 0 },
      radius: 1,
      linearFactor: new CANNON.Vec3(1, 1, 1),
      angularFactor: new CANNON.Vec3(1, 1, 1),
      linearDamping: 0,
      angularDamping: 0
    };

    const _parameters = Object.assign(thisSphereParameters, parameters);

    if (parameters.type) {
      _parameters.type = this.typeEnum[parameters.type];
    }

    const _sphereBody = new CANNON.Body({
      mass: _parameters.mass, // kg
      position: new CANNON.Vec3(
        _parameters.position.x,
        _parameters.position.y,
        _parameters.position.z
      ), // m
      shape: new CANNON.Sphere(_parameters.radius),
      linearFactor: _parameters.linearFactor,
      angularFactor: _parameters.angularFactor,
      linearDamping: _parameters.linearDamping,
      angularDamping: _parameters.angularDamping,
      type: _parameters.type,
      material: this.slipperyMaterial
    });
    this.world.addBody(_sphereBody);

    _sphereBody.beginContactFunction = parameters.beginContactFunction;
    _sphereBody.endContactFunction = parameters.endContactFunction;

    // _sphereBody.addEventListener( "collide", function ( event ) {
    //     console.log( "[Body] - collide: ", event );
    // } )

    _sphereBody.mesh = mesh;
    _sphereBody.instance = instance;
    const _updateFunction = this.generateUpdateFunction(mesh, _sphereBody);
    this.physicsUpdateFunctions.push(_updateFunction);
    return {
      body: _sphereBody,
      update: _updateFunction,
      parameters: _parameters
    };
  }

  addNewBoxBody(mesh, parameters, instance) {
    let thisBoxParameters = {
      mass: 1,
      position: { x: 0, y: 0, z: 0 },
      dimensions: { x: 1, y: 1, z: 1 },
      linearFactor: new CANNON.Vec3(1, 1, 1),
      angularFactor: new CANNON.Vec3(1, 1, 1),
      material: this.groundMaterial
    };

    const _parameters = Object.assign(thisBoxParameters, parameters);

    const _boxBody = new CANNON.Body({
      mass: _parameters.mass,
      position: new CANNON.Vec3(
        _parameters.position.x,
        _parameters.position.y,
        _parameters.position.z
      ), // m
      shape: new CANNON.Box(
        new CANNON.Vec3(
          _parameters.dimensions.x / 2,
          _parameters.dimensions.y / 2,
          _parameters.dimensions.z / 2
        )
      ),
      linearFactor: _parameters.linearFactor,
      angularFactor: _parameters.angularFactor,
      material: _parameters.material
    });

    this.world.addBody(_boxBody);

    _boxBody.mesh = mesh;
    _boxBody.instance = instance;
    const _updateFunction = this.generateUpdateFunction(mesh, _boxBody);
    this.physicsUpdateFunctions.push(_updateFunction);

    _boxBody.beginContactFunction = parameters.beginContactFunction;
    _boxBody.endContactFunction = parameters.endContactFunction;

    mesh.physicsBody = _boxBody;

    return { body: _boxBody, update: _updateFunction, parameters: _parameters };
  }

  render() {
    return null;
  }

  update = timeOfCurrentUpdateCallInMilliseconds => {
    // console.log( 'here' );
    if (this.TimeOfLastUpdateCallInMilliseconds !== undefined) {
      const deltaTimeSinceLastUpdateInMilliseconds =
        (timeOfCurrentUpdateCallInMilliseconds -
          this.TimeOfLastUpdateCallInMilliseconds) /
        1000;
      this.world.step(
        this.fixedTimeStep,
        deltaTimeSinceLastUpdateInMilliseconds,
        this.maxSubSteps
      );
      this.physicsUpdateFunctions.forEach(updateFunction => updateFunction());
    }
    this.TimeOfLastUpdateCallInMilliseconds = timeOfCurrentUpdateCallInMilliseconds;
  };
}
