import { eventHandler, EventHandlerTypes } from "./CirclePackWorker";
import PackedCircle from "./PackedCircle";
import { Bounds, Size } from "./PackedCircleManager";
import { convertToPackedCircle, isSizeValid } from "./util";
import { VectorType } from "./Vector";

export type IdObj = { id: string };
export type IdPosObj = IdObj & { position: VectorType };
export type CircleInputType = {
  id: string;
  radius: number;
  position: VectorType;
  locked: boolean;
};
export type PackedCircleObject = { [id: string]: PackedCircle };
export type OnEvent =
  | ((updatedCirclePositions: PackedCircleObject) => void)
  | null;
export type EventTypes = "movestart" | "move" | "moveend";
export interface CirclePackerProps {
  onMoveStart?: OnEvent;
  onMove?: OnEvent;
  onMoveEnd?: OnEvent;
  centeringPasses?: number;
  collisionPasses: number;
  circles?: CircleInputType[];
  padding?: number;
  size?: Size;
  bounds?: Bounds;
  target?: VectorType;
  continuousMode?: boolean;
}
// this class keeps track of the drawing loop in continuous drawing mode
// and passes messages to the worker
export default class CirclePacker {
  private onMoveStart: OnEvent;
  private onMove: OnEvent;
  private onMoveEnd: OnEvent;

  private isLooping = false;
  private areItemsMoving = true;
  private animationFrameId = NaN;
  private initialized = true;
  private isContinuousModeActive: boolean;
  private e: EventHandlerTypes;

  constructor(params: CirclePackerProps) {
    this.e = eventHandler(newPositions => {
      this.areItemsMoving = this.hasItemMoved(newPositions);

      this.updateListeners("move", newPositions);
    }, params.padding);
    this.isContinuousModeActive =
      typeof params.continuousMode === "boolean" ? params.continuousMode : true;

    this.onMoveStart = params.onMoveStart || null;
    this.onMove = params.onMove || null;
    this.onMoveEnd = params.onMoveEnd || null;

    if (params.centeringPasses) {
      this.setCenteringPasses(params.centeringPasses);
    }

    if (params.collisionPasses) {
      this.setCollisionPasses(params.collisionPasses);
    }

    this.addCircles(params.circles || []);
    this.setSizeAndBounds(
      params.size || { width: 100, height: 100 },
      params.bounds || { left: 0, right: 0, top: 0, bottom: 0 }
    );
    this.setTarget(params.target || { x: 50, y: 50 });

    if (this.isContinuousModeActive) {
      this.startLoop();
    }
  }

  updateListeners(type: EventTypes, message?: PackedCircleObject) {
    if (message) {
      if (type === "movestart" && typeof this.onMoveStart === "function") {
        this.onMoveStart(message);
      }

      if (type === "move" && typeof this.onMove === "function") {
        this.onMove(message);
      }

      if (type === "moveend" && typeof this.onMoveEnd === "function") {
        this.onMoveEnd(message);
      }
    }
  }

  addCircles(circles: CircleInputType[]) {
    if (Array.isArray(circles) && circles.length) {
      const circlesToAdd = circles.map(convertToPackedCircle);

      if (circlesToAdd.length) {
        this.e.addcircles(circlesToAdd);
      }
    }

    this.startLoop();
  }

  addCircle(circle: CircleInputType) {
    this.addCircles([circle]);
  }

  removeCircle(circle: PackedCircle) {
    if (circle) {
      if (circle.id) {
        this.e.removecircle(circle.id);
      } else {
        throw Error("No Id associated with circle");
      }

      this.startLoop();
    }
  }

  setSizeAndBounds(size: Size, bounds: Bounds) {
    if (isSizeValid(size)) {
      this.e.bounds(bounds);
      this.e.size(size);
      this.startLoop();
    }
  }

  setTarget(targetPos: VectorType) {
    this.e.target(targetPos);
    this.startLoop();
  }

  setCenteringPasses(numberOfCenteringPasses: number) {
    this.e.centeringpasses(numberOfCenteringPasses);
  }

  setCollisionPasses(numberOfCollisionPasses: number) {
    this.e.collisionpasses(numberOfCollisionPasses);
  }

  setDamping(damping: number) {
    this.e.damping(damping);
  }

  update() {
    this.e.update();
  }

  dragStart(id: string) {
    this.e.dragstart(id);
    this.startLoop();
  }

  drag(id: string, position: VectorType) {
    this.e.drag(position);
    this.startLoop();
  }

  dragEnd(id: string) {
    this.e.dragend();
    this.startLoop();
  }

  updateLoop() {
    this.update();

    if (this.isLooping) {
      if (this.areItemsMoving) {
        this.animationFrameId = requestAnimationFrame(
          this.updateLoop.bind(this)
        );
      } else {
        this.stopLoop();
      }
    }
  }

  startLoop() {
    if (!this.isLooping && this.initialized && this.isContinuousModeActive) {
      this.isLooping = true;

      // in case we just added another circle:
      // keep going, even if nothing has moved since the last message from the worker
      if (this.isContinuousModeActive) {
        this.areItemsMoving = true;
      }

      this.updateListeners("movestart");
      this.animationFrameId = requestAnimationFrame(this.updateLoop.bind(this));
    }
  }

  stopLoop() {
    if (this.isLooping) {
      this.isLooping = false;
      this.updateListeners("moveend");
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  hasItemMoved(circleObj: PackedCircleObject) {
    let result = false;

    for (let id in circleObj) {
      if (
        Math.abs(circleObj[id].delta.x) > 0.005 &&
        Math.abs(circleObj[id].delta.y) > 0.005
      ) {
        result = true;
      }
    }
    return result;
  }

  destroy() {
    this.stopLoop();
    this.onMove = null;
    this.onMoveStart = null;
    this.onMoveEnd = null;
  }
}
