// import { EditorTransformObjectUpdate } from "../../Components/EditorTransformObjectUpdate/EditorTransformObjectUpdate";
import { ObjectLoaderMesh } from "./ObjectLoaderMesh/ObjectLoaderMesh";
import { TransformUpdate } from "./TransformUpdate/TransformUpdate";
import { CSSLabelTo3D } from "./CSSLabelTo3D/CSSLabelTo3D";
import { SpriteComponent } from "./Sprite/SpriteComponent";
import { ShoeGroup } from "./ShoeGroup/ShoeGroup";
import { ShoeController } from "./ShoeController/ShoeController";
import { BoardPlaneGeometry } from "./BoardPlaneGeometry/BoardPlaneGeometry";
import { DirectionalLight } from "./DirectionalLight/DirectionalLight";
import { AmbientLight } from "./AmbientLight/AmbientLight";
import { PointLight } from "./PointLight/PointLight";
import { Camera } from "./Camera/Camera";
import { PlayerControls } from "./PlayerControls/PlayerControls";
import { Shooter } from "./Shooter/Shooter";
import { PlayerShooterGeometry } from "./PlayerShooterGeometry/PlayerShooterGeometry";
import { PlayerBulletGeometry } from "./PlayerBullet/PlayerBulletGeometry";
import { EnemyMovementControls } from "./EnemyMovementControls/EnemyMovementControls";
import { BulletMovement } from "./Bullet/BulletMovement";
import { EnemyCubeGeometry } from "./EnemyCubeGeometry/EnemyCubeGeometry";
import { TestCube } from "./TestCube/TestCube";
import { SphereGeometry } from "./SphereGeometry/SphereGeometry";
import {TextGeometry} from "./TextGeometry/TextGeometry";
import {AutoRotate} from "./AutoRotate/AutoRotate";
import {WaterComponent} from "./WaterComponent/WaterComponent";
import {PlaneShaderMaterial} from "./PlaneShaderMaterial/PlaneShaderMaterial";
import {AudioScaleComponent} from "./AudioScaleComponent/AudioScaleComponent";
import {SoundPlayer} from "./SoundPlayer/SoundPlayer";
import {MeshGeometry} from "./MeshGeometry/MeshGeometry";
import {RPGGameComponent} from "./RPGGame/RPGGameComponent";
import {RPGKernelModuleGameComponent} from "./RPGGame/RPGKernelModuleGameComponent";

export const components = {
  objectLoader: ObjectLoaderMesh,
  cssLabelTo3d: CSSLabelTo3D,
  sprite: SpriteComponent,
  transformUpdate: TransformUpdate,
  shoeGroup: ShoeGroup,
  shoeController: ShoeController,
  testCube: TestCube,
  boardPlaneGeometry: BoardPlaneGeometry,
  directionalLight: DirectionalLight,
  pointLight: PointLight,
  ambientLight: AmbientLight,
  dynamicCameraManager: Camera,
  playerControls: PlayerControls,
  shooter: Shooter,
  shooterGeometry: PlayerShooterGeometry,
  playerBulletGeometry: PlayerBulletGeometry,
  sphereGeometry: SphereGeometry,
  bulletMovement: BulletMovement,
  enemyMovementControls: EnemyMovementControls,
  enemyCubeGeometry: EnemyCubeGeometry,
  textGeometry: TextGeometry,
  autoRotate: AutoRotate,
  water: WaterComponent,
  planeShader: PlaneShaderMaterial,
  audioScale: AudioScaleComponent,
  soundPlayer: SoundPlayer,
  meshGeometryLoader: MeshGeometry,
  rpgGameComponent: RPGGameComponent,
  rpgKernelModuleComponent: RPGKernelModuleGameComponent,
};