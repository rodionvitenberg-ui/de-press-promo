import { C } from "./constants";
import { getStage } from "./stage";
import { customCubicSpline, monotoneCubicSpline, type Spline } from "./splines";
import type { Dog } from "./dog";

/**
 * Camera behaviour for one state — port of the legacy
 * `modules/behaviours/states` (dog.js module 41). Each state provides 7 pose
 * arrays; the behaviour builds splines over them and, for every frame,
 * interpolates camera depth/height and dog rotation/offsets from the
 * animation progress (smoothed with a 0.9/0.1 lerp).
 */

type StateData = {
  POSES_COUNT: number;
  CAM_Y: number[];
  DEPTH: number[];
  H_ROTATION: number[];
  V_ROTATION: number[];
  X_OFFSET: number[];
  Y_OFFSET: number[];
  MOUSE_INFLUENCE: number[];
};

export class StatesBehaviour {
  readonly STATE_NAME: string;
  data: StateData;

  mouse = { x: 0, y: 0 };

  private dog: Dog;
  private keyLength = 0;
  private distanceSpline!: Spline;
  private thetaSpline!: Spline;
  private phiSpline!: Spline;
  private verticalParallaxSpline!: Spline;
  private xOffsetSpline!: Spline;
  private yOffsetSpline!: Spline;
  private mouseInfluenceSpline!: Spline;
  private currentPosition = 0;
  private targetPosition = 0;
  private readonly ratioCurrent = 0.9;
  private readonly ratioTarget = 0.1;

  constructor(state: string, dog: Dog) {
    this.STATE_NAME = C.APP_STATES[state] ?? state;
    this.data = C.JSON_DATA?.STATES[this.STATE_NAME] as StateData;
    this.dog = dog;
    this.setKeyPoints();
  }

  setKeyPoints(): void {
    const data = this.data;
    this.keyLength = data.CAM_Y.length;
    const keyPoints: number[] = [];
    const verticalKeysPoints: number[] = [];
    const distanceKeysPoints: number[] = [];
    const thetaKeysPoints: number[] = [];
    const phiKeysPoints: number[] = [];
    const xOffsets: number[] = [];
    const yOffsets: number[] = [];
    const mouseInfluences: number[] = [];

    for (let t = 0; t < this.keyLength; t++) {
      keyPoints[t] = t;
      verticalKeysPoints[t] = data.CAM_Y[t];
      distanceKeysPoints[t] = data.DEPTH[t];
      thetaKeysPoints[t] = data.V_ROTATION[t];
      phiKeysPoints[t] = data.H_ROTATION[t];
      xOffsets[t] = data.X_OFFSET[t];
      yOffsets[t] = data.Y_OFFSET[t];
      mouseInfluences[t] = data.MOUSE_INFLUENCE[t];
    }

    this.distanceSpline = customCubicSpline(keyPoints, distanceKeysPoints);
    this.thetaSpline = monotoneCubicSpline(keyPoints, thetaKeysPoints);
    this.phiSpline = monotoneCubicSpline(keyPoints, phiKeysPoints);
    this.verticalParallaxSpline = monotoneCubicSpline(keyPoints, verticalKeysPoints);
    this.xOffsetSpline = monotoneCubicSpline(keyPoints, xOffsets);
    this.yOffsetSpline = monotoneCubicSpline(keyPoints, yOffsets);
    this.mouseInfluenceSpline = monotoneCubicSpline(keyPoints, mouseInfluences);
  }

  moveCamera(
    depth: number,
    theta: number,
    phi: number,
    camY: number,
    xOffset: number,
    yOffset: number,
    mouseInfluence: number,
  ): void {
    const { cameraPivot } = getStage();
    this.dog.rotation.y = (theta * Math.PI) / 180 + this.mouse.x * mouseInfluence;
    this.dog.rotation.x = (phi * Math.PI) / 180 + this.mouse.y * mouseInfluence;
    cameraPivot.position.z = depth;
    cameraPivot.position.y = camY;
    this.dog.position.x = xOffset;
    this.dog.position.y = yOffset;
  }

  setAnimationProgress(progress: number, hard?: boolean): void {
    if (hard === true) {
      this.currentPosition = progress * (this.keyLength - 1);
    }
    this.targetPosition = progress * (this.keyLength - 1);
  }

  setMouse(mouse: { x: number; y: number }): void {
    this.mouse.x = mouse.x;
    this.mouse.y = mouse.y;
    this.update();
  }

  update(): void {
    this.currentPosition =
      this.currentPosition * this.ratioCurrent +
      this.targetPosition * this.ratioTarget;
    const p = this.currentPosition;
    this.moveCamera(
      this.distanceSpline(p),
      this.thetaSpline(p),
      this.phiSpline(p),
      this.verticalParallaxSpline(p),
      this.xOffsetSpline(p),
      this.yOffsetSpline(p),
      this.mouseInfluenceSpline(p),
    );
  }

  // Kept for call parity with the legacy activate/desactivate flow.
  activate(): void {}

  desactivate(): void {}
}
