declare module 'drag-handler' {
	export function createDragHandler(el: HTMLElement): DragHandler;
	export function calculateDragDirection(start: DragGesture, end: DragGesture): DragDirection;
	export function calculateDragVelocity(start: DragGesture, end: DragGesture): Point;
	export function calculateDragDistance(start: DragGesture, end: DragGesture): Point;
	export type DragHandlerEvent = 'dragstart' | 'drag' | 'dragend';

	interface Point {
		x: number,
		y: number
	}

	interface DragDirection {
		x: 'left' | 'right' | null,
		y: 'up' | 'down' | null
	}

	interface DragGesture {
		elementPoint: Point,
		windowPoint: Point;
		timeStamp: number,
		direction: DragDirection;
		distance: DragDistance;
		velocity: DragVelocity;
	}

	interface DragVelocity extends Point {}
	interface DragDistance extends Point {}

	interface Dimensions {
		height: number;
		width: number;
	}

	interface DragOffset {
		left: number,
		top: number
	}

	interface TouchOrMouseEvent extends Event {
		touches?: TouchList;
	}

	interface DragHandler {
		on(eventType: DragHandlerEvent, fn: (event: CustomEvent<DragGesture>) => any): void;
		destroy(): void;
	}
}