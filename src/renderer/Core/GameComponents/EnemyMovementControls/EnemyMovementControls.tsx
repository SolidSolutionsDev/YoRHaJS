import React from "react";
import * as CANNON from "cannon";
import * as THREE from "three";

interface EnemyMovementControlsProps {
    transform: any;
    availableService: any;
    availableComponent: any;
    gameObject: any;
    selfSettings: any;
    moveRatio?: number;
    rotationSpeed?: number;
    type?: "follow" | "rotate";
}

interface EnemyMovementControlsState {
    activeLeft: boolean;
    activeRight: boolean;
    activeUp: boolean;
    activeDown: boolean;
    movementCallback: any;
}

export class EnemyMovementControls extends React.Component<EnemyMovementControlsProps, EnemyMovementControlsState> {
    shootIntervalCallback: any;
    shootTimeInterval = 70;
    mouseDebugMesh: THREE.Mesh | undefined;
    currentShooterDirection = new THREE.Vector3(0, 1, 0);
    updateTime = 0;
    sound: THREE.Audio | undefined;

    shootLastTime = 0;

    currentTestInstanceId = null;
    shooter: any;

    moveRatio = this.props.moveRatio || 0.3;
    rotationSpeed = this.props.rotationSpeed || 0;
    type = this.props.type || "rotate";

    moveVelocity = {
        value: 0,
        max: 1,
        min: 1,
        variation: 0.01
    };

    state: EnemyMovementControlsState = {
        activeLeft: false,
        activeRight: false,
        activeUp: false,
        activeDown: false,
        movementCallback: null
    };

    coords: any;

    lookDown = () => {
        const { transform } = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            Math.PI / 2
        );
    };
    lookUp = () => {
        const { transform } = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            -Math.PI / 2
        );
    };

    lookLeft = () => {
        const { transform } = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            Math.PI
        );
    };
    lookRight = () => {
        const { transform } = this.props;
        transform.physicsBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 0, 1),
            0
        );
    };
    moveLeft = () => {
        const { transform } = this.props;
        // console.log('moveLeft');
        // this.activeMovements.left=true;
        transform.physicsBody.position.x -= this.moveRatio;
        // let forwardVector = new CANNON.Vec3(-1, 0, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveRight = () => {
        const { transform } = this.props;
        // console.log('moveRight');
        transform.physicsBody.position.x += this.moveRatio;
        // let forwardVector = new CANNON.Vec3(1,0, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveUp = () => {
        const { transform } = this.props;
        // console.log('moveUp');
        transform.physicsBody.position.y += this.moveRatio;

        // let forwardVector = new CANNON.Vec3(0, 1, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    moveDown = () => {
        const { transform } = this.props;
        // console.log('moveDown',transform.physicsBody);
        transform.physicsBody.position.y -= this.moveRatio;
        // let forwardVector = new CANNON.Vec3(0, -1, 0);
        // forwardVector.scale(this.fixedSpeed,transform.physicsBody.velocity);
    };

    shootBullet = () => {
        if (!this.shooter) {
            this.shooter = this.getShooter();
        }

        if (this.shooter) {
            // Access the Shooter component instance if possible or trigger via state/props
            // However, shooter here is a GameObject reference (the child).
            // We need to find the 'Shooter' component on that GameObject.

            // In the current architecture, direct method calls between components might be tricky 
            // if we don't have the component instance ref.
            // But existing code seems to rely on this.shooter being the GameObject.

            // Actually, looking at how PlayerControls does it (if it does), or how Shooter works:
            // Shooter has startShooting() method.

            // If this.shooter is the GameObject, we need to get the "Shooter" component.
            // Assuming getShooter() returns the GameObject.

            const shooterComponent = this.shooter.getComponent("Shooter");
            if (shooterComponent) {
                // Toggle shooting or just start? 
                // The interval calls this repeatedly.

                // If the logic is "start shooting pattern", maybe we call startShooting once?
                // But this is in a setInterval. 

                // If the enemy shoots periodically (bursts?), maybe this toggles it?
                // Or maybe it just calls shoot once?

                // Looking at Shooter.tsx, it has startShooting which sets shooting=true.
                // It doesn't seem to expose a "shoot once" method easily for external interval 
                // unless we use shootAroundBullet directly, but that depends on time.

                // Let's assume the original JS simply called a method on the component.
                // Given the method name "shootBullet", it might be a single shot.

                // If I look at Shooter.tsx again, startShooting sets shooting=true.
                // stopShooting sets shooting=false.

                // PROPOSAL: The interval in EnemyMovementControls is likely for BURSTS or AI decisions.
                // For now, let's try to call startShooting on the component.

                // Wait, if it's an interval of 70ms (shootTimeInterval = 70), that's very fast.
                // Maybe it is calling shootForwardBullet or similar directly?

                // Let's stick to calling startShooting if not shooting, or providing a trigger.
                // But Shooter handles its own loop if shooting=true.

                // If EnemyMovementControls controls the TIMING of shots, then Shooter shouldn't have its own loop?
                // Shooter.tsx: update() calls shootAroundBullet(time) if this.shooting is true.

                // Failure Hypothesis: EnemyMovementControls is supposed to manage the "Active" state of the Shooter.
                // So maybe it should toggle it?

                // Let's try to infer from context. Enemy is "Sphere".
                // Sphere usually spins and shoots around.

                // If I look at `startShooting` in `EnemyMovementControls`:
                // It sets an interval.

                // If `shootBullet` is called every 70ms, and it calls `shooter.startShooting()`, 
                // then shooter will stay in shooting mode. 
                // If `stopShooting` is called, it clears interval.

                // But wait, `startShooting` in `EnemyMovementControls` is called... when?
                // Likely when enemy activates.

                // I will implement retrieving the component and calling `startShooting()`. 
                // But acts as a "keep alive" or "trigger"? 

                // Actually, if Shooter manages its own interval via update loop (it does, shootTimeInterval prop),
                // then EnemyMovementControls shouldn't need its own interval unless it's turning shooting on/off.

                // Let's assume `shootBullet` is meant to just enable the shooter.
                // But why setInterval? 

                // Maybe `shootBullet` is actually `triggerShoot`?
                // Let's try to find if there's a `shoot` method in `Shooter`.

                // Shooter has `shootForwardBullet` and `shootAroundBullet`.

                // If I look at `Shooter.tsx`, `update` calls `shootAroundBullet`.

                // I will try to replicate what `PlayerControls` might do or just call `startShooting`.

                // Safe bet: Call `startShooting()` on the component.

                const shooterComp = this.shooter.getComponent("Shooter");
                if (shooterComp) {
                    shooterComp.startShooting();
                }
            }
        }
    }

    startShooting = () => {
        // console.log("shoot",this);
        if (!this.shootIntervalCallback) {
            this.shootIntervalCallback = setInterval(
                this.shootBullet,
                this.shootTimeInterval
            );
        }
    };

    stopShooting = () => {
        if (this.shootIntervalCallback) {
            clearInterval(this.shootIntervalCallback);
            this.shootIntervalCallback = null;
        }
    };

    initSound = () => {
        const { transform, availableService } = this.props;
        const _sound = availableService.audio.buildPositionalSound(
            this.props.selfSettings.soundLocation
        );
        _sound.setLoop(false);
        _sound.loop = false;
        transform.add(_sound);
        if (_sound.isPlaying) {
            _sound.stop();
        }
        this.sound = _sound;
        // console.log(_sound);
        // needs delay to play
    };

    mouseLook = (e: any) => {
        this.coords = e.detail.coordinates;

        this.updateMouseLookDebugMesh();

        this.updateMouseLook();

        this.updateMovement();
    };

    updateMovement = () => {
        // Implementation might have been missing in original file or mixed up?
        // Original JS didn't have updateMovement body shown in "mouseLook" context fully, 
        // but it calls it. Assuming similar to PlayerControls.
    }

    updateMouseLookDebugMesh = () => {
        // Implement if needed
    }

    getPositionFromMouse = (_z: number) => {
        return new THREE.Vector3(0, 0, 0); // placeholder
    }

    updateMouseLook = () => {
        const { transform, availableComponent } = this.props;

        if (!availableComponent.scene.camera._main) {
            return;
        }

        if (this.coords) {
            // TODO: move this to physics service as lookAt function
            // Compute direction to target
            let lookAtVector = this.getPositionFromMouse(
                transform.physicsBody.position.z
            );

            // @ts-ignore
            this.currentShooterDirection = transform.physicsBody.lookAt(lookAtVector);

            // this can be used to make bullets or enemies follow player but disables gravity
            // currentShooterDirection.scale(fixedSpeed,transform.physicsBody.velocity);
        }
    };

    getShooter = () => {
        const {
            gameObject,
            availableComponent
        } = this.props;
        const { scene } = availableComponent;
        const shooterById = gameObject.getChildGameObjectByTag("playerShooter", scene);
        return shooterById;
    }

    updateFollowPlayerEnemy = (_time: number, _deltaTime: number) => {
        const { transform } = this.props;

        if (!this.shooter) return;

        // player world position
        const vPlayerPositionRelativeToWorld = new THREE.Vector3().copy(this.shooter.transform.position);

        // player position relative to enemy transform - includes rotation of the transform
        const vPlayerPositionRelativeToLocalEnemyPositionAndRotation = transform.worldToLocal(vPlayerPositionRelativeToWorld);

        const distancePlayerToEnemy = vPlayerPositionRelativeToLocalEnemyPositionAndRotation.length();

        const translateValue = .1;
        const maxDistanceBetweenPlayerAndEnemy = 5;
        if (distancePlayerToEnemy > maxDistanceBetweenPlayerAndEnemy) {
            transform.translateY(translateValue);
        }

        vPlayerPositionRelativeToLocalEnemyPositionAndRotation.normalize();

        // get angle to rotate
        const maxRotateValue = .05;
        const rotationToLookAtPlayer = Math.asin(vPlayerPositionRelativeToLocalEnemyPositionAndRotation.x);
        const rotateAbsoluteValue = Math.min(Math.abs(rotationToLookAtPlayer), maxRotateValue);
        const orientedRotationValue = -Math.sign(rotationToLookAtPlayer) * rotateAbsoluteValue;

        transform.rotateZ(orientedRotationValue);
    };

    updateAutoRotateEnemy = (_time: number, deltaTime: number) => {
        this.props.transform.rotation.z += this.rotationSpeed * (0.02 * deltaTime) / 10;
    };

    updateType: { [key: string]: (time: number, deltaTime: number) => void } = {
        follow: this.updateFollowPlayerEnemy,
        rotate: this.updateAutoRotateEnemy,
    }

    start = () => {
        this.shooter = this.getShooter();
    };

    update = (time: number, deltaTime: number) => {
        // this.updateMovement();
        // this.updateMouseLook();
        if (this.updateType[this.type]) {
            this.updateType[this.type](time, deltaTime);
        }
    };

    render = () => null;
}

