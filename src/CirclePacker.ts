import { sendWorkerMessage, isCircleValid, isSizeValid } from './util.js';
import PackedCircle from './PackedCircle.js';
import { Size, Bounds } from './PackedCircleManager.js';
import Vector, { VectorType } from './Vector.js';
import { EventHandlerTypes, eventHandler } from './CirclePackWorker.js';
export type IdObj = {id : string}
export type IdPosObj = IdObj & {position : VectorType}

export type PackedCircleObject = { [id: string]: PackedCircle }
export type OnEvent = (updatedCirclePositions: PackedCircleObject) => void
export type EventTypes = "movestart" | "move" | "moveend"

// this class keeps track of the drawing loop in continuous drawing mode
// and passes messages to the worker
export default class CirclePacker {
	private onMoveStart: OnEvent
	private onMove: OnEvent
	private onMoveEnd: OnEvent

	private isLooping = false;
	private areItemsMoving = true;
	private animationFrameId = NaN;
	private initialized = true;
	private isContinuousModeActive: boolean;
	private e:EventHandlerTypes

	constructor(params: {
		onMoveStart?: OnEvent,
		onMove?: OnEvent,
		onMoveEnd?: OnEvent,
		centeringPasses?: number,
		collisionPasses: number,
		circles?: PackedCircle[],
		size?: Size
		bounds?: Bounds
		target?: VectorType,
		continuousMode?: boolean
	}) {
		this.e = eventHandler( (newPositions) => {
			this.areItemsMoving = this.hasItemMoved(newPositions);
		})
		this.isContinuousModeActive = typeof params.continuousMode === 'boolean' ? params.continuousMode : true;

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
		this.setSizeAndBounds(params.size || { width: 100, height: 100 }, params.bounds || { left : 0, right : 0, top : 0, bottom : 0 });
		this.setTarget(params.target || { x: 50, y: 50 });


		if (this.isContinuousModeActive) {
			this.startLoop();
		}
	}


	updateListeners(type: EventTypes, message?: PackedCircleObject) {
		if (type === 'movestart' && typeof this.onMoveStart === 'function') {
			this.onMoveStart(message);
		}

		if (type === 'move' && typeof this.onMove === 'function') {
			this.onMove(message);
		}

		if (type === 'moveend' && typeof this.onMoveEnd === 'function') {
			this.onMoveEnd(message);
		}
	}

	addCircles(circles : PackedCircle[]) {
		if (Array.isArray(circles) && circles.length) {
			const circlesToAdd = circles.filter(isCircleValid);

			if (circlesToAdd.length) {

				this.e.addcircles(circlesToAdd);
			}
		}

		this.startLoop();
	}

	addCircle(circle : PackedCircle) {
		this.addCircles([circle]);
	}

	removeCircle(circle : PackedCircle) {
		if (circle) {
			if (circle.id) {

				this.e.removecircle(circle.id);
			} else {
				throw Error("No Id associated with circle")
			}

			this.startLoop();
		}
	}

	setSizeAndBounds(size : Size, bounds : Bounds) {
		if (isSizeValid(size)) {
			this.e.bounds( bounds);
			this.e.size( size);
			this.startLoop();
		}
	}

	setTarget(targetPos : VectorType) {

		this.e.target( targetPos);
		this.startLoop();
	}

	setCenteringPasses(numberOfCenteringPasses : number) {

		this.e.centeringpasses( numberOfCenteringPasses);
	}

	setCollisionPasses(numberOfCollisionPasses : number) {

		this.e.collisionpasses( numberOfCollisionPasses);
	}

	setDamping(damping) {

		this.e.damping( damping);
	}

	update() {

		this.e.update();
	}

	dragStart(id : string) {

		this.e.dragstart( id );
		this.startLoop();
	}

	drag(id : string, position : VectorType) {
		this.e.drag(position);
		this.startLoop();
	}

	dragEnd(id : string) {
		this.e.dragend();
		this.startLoop();
	}

	updateLoop() {
		this.update();

		if (this.isLooping) {
			if (this.areItemsMoving) {
				this.animationFrameId = requestAnimationFrame(this.updateLoop.bind(this));
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

			this.updateListeners('movestart');
			this.animationFrameId = requestAnimationFrame(this.updateLoop.bind(this));
		}
	}

	stopLoop() {
		if (this.isLooping) {
			this.isLooping = false;
			this.updateListeners('moveend');
			cancelAnimationFrame(this.animationFrameId);
		}
	}

	hasItemMoved(circleObj : PackedCircleObject) {
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