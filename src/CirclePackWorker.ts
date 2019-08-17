// this code is mostly for message passing between the
// PackedCircleManager and CirclePacker classes

import { PackedCircleObject } from "./CirclePacker";
import PackedCircle from "./PackedCircle";
import PackedCircleManager, { Bounds, Size } from "./PackedCircleManager";
import Vector, { VectorType } from "./Vector";

export type EventHandlerTypes<T> = {
  bounds: (message: Bounds) => void;
  target: (message: VectorType) => void;
  addcircles: (message: PackedCircle<T>[]) => void;
  removecircle: (message: string) => void;
  dragstart: (message: string) => void;
  drag: (message: VectorType) => void;
  dragend: () => void;
  centeringpasses: (message: number) => void;
  collisionpasses: (message: number) => void;
  damping: (message: number) => void;
  update: () => void;
  size: (message: Size) => void;
};

export const eventHandler = <T>(
  moveCallback: (position: PackedCircleObject<T>) => void,
  padding?: number
) => {
  const circleManager = new PackedCircleManager<T>(padding);

  const bounds = (message: Bounds) => {
    circleManager.setBounds(message);
  };
  const size = (message: Size) => {
    circleManager.setSize(message);
  };

  const target = (message: VectorType) => {
    setTarget(message);
  };

  const addcircles = (message: PackedCircle<T>[]) => {
    addCircles(message);
  };

  const removecircle = (message: string) => {
    circleManager.removeCircle(message);
  };

  const dragstart = (message: string) => {
    circleManager.dragStart(message);
  };

  const drag = (message: VectorType) => {
    circleManager.drag(message);
  };

  const dragend = () => {
    circleManager.dragEnd();
  };

  const centeringpasses = (message: number) => {
    if (typeof message === "number" && message > 0) {
      circleManager.numberOfCenteringPasses = message;
    }
  };

  const collisionpasses = (message: number) => {
    if (typeof message === "number" && message > 0) {
      circleManager.numberOfCollisionPasses = message;
    }
  };

  const damping = (message: number) => {
    if (typeof message === "number" && message > 0) {
      circleManager.damping = message;
    }
  };

  const addCircles = (circles: PackedCircle<T>[]) => {
    if (Array.isArray(circles) && circles.length) {
      circles.forEach(circleManager.addCircle.bind(circleManager));
    }
  };

  const setTarget = (target: VectorType) => {
    if (
      target &&
      typeof target.x === "number" &&
      typeof target.y === "number"
    ) {
      circleManager.setTarget(new Vector(target.x, target.y));
    }
  };

  const update = () => {
    circleManager.updatePositions();

    sendPositions();
  };

  const sendPositions = () => {
    const positions = circleManager.allCircles.reduce(
      (
        result: {
          [id: string]: PackedCircle<T>;
        },
        circle
      ) => {
        result[circle.id] = circle;
        return result;
      },
      {}
    );

    moveCallback(positions);
  };

  return {
    bounds,
    update,
    target,
    addcircles,
    removecircle,
    dragstart,
    drag,
    dragend,
    centeringpasses,
    collisionpasses,
    damping,
    size
  } as EventHandlerTypes<T>;
};
