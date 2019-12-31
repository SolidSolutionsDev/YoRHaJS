// import { OBJMeshGeometry } from "../../GameComponents/OBJMeshGeometry/OBJMeshGeometry";
// import { EditorTransformObjectUpdate } from "../../Components/EditorTransformObjectUpdate/EditorTransformObjectUpdate";
import { ObjectLoaderMesh } from "./ObjectLoaderMesh/ObjectLoaderMesh";
import { TransformUpdate } from "./TransformUpdate/TransformUpdate";
import { CSSLabelTo3D } from "./CSSLabelTo3D/CSSLabelTo3D";
import { SpriteComponent } from "./Sprite/SpriteComponent";
import { ShoeGroup } from "./ShoeGroup/ShoeGroup";
import { ShoeController } from "./ShoeController/ShoeController";
import { Cube } from "./Cube/Cube";
import { BoardPlaneGeometry } from "./BoardPlaneGeometry/BoardPlaneGeometry";
import { DirectionalLight } from "./DirectionalLight/DirectionalLight";
import { AmbientLight } from "./AmbientLight/AmbientLight";
import { PointLight } from "./PointLight/PointLight";
import { Camera } from "./Camera/Camera";
import { PlayerControls } from "./PlayerControls/PlayerControls";
import { Shooter } from "./Shooter/Shooter";
import { PlayerShooterGeometry } from "./PlayerShooterGeometry/PlayerShooterGeometry";
import { PlayerBulletGeometry } from "./PlayerBullet/PlayerBulletGeometry";
import { EnemyBulletGeometry } from "./EnemyBullet/EnemyBulletGeometry";
import { EnemyMovementControls } from "./EnemyMovementControls/EnemyMovementControls";
import { CubeGeometry } from "./CubeGeometry/CubeGeometry";

export const components = {
  // objMesh: OBJMeshGeometry,
  objectLoader: ObjectLoaderMesh,
  cssLabelTo3d: CSSLabelTo3D,
  sprite: SpriteComponent,
  transformUpdate: TransformUpdate,
  shoeGroup: ShoeGroup,
  shoeController: ShoeController,
  cube: Cube,
  boardPlaneGeometry: BoardPlaneGeometry,
  directionalLight: DirectionalLight,
  pointLight: PointLight,
  ambientLight: AmbientLight,
  dynamicCameraManager: Camera,
  playerControls: PlayerControls,
  shooter: Shooter,
  shooterGeometry: PlayerShooterGeometry,
  playerBulletGeometry: PlayerBulletGeometry,
  enemyBulletGeometry: EnemyBulletGeometry,
  enemyMovementControls: EnemyMovementControls,
  cubeGeometry: CubeGeometry
};
