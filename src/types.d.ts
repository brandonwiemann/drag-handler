interface Point {
	x: number,
	y: number
}

interface DragDirection {
	x: 'left' | 'right' | null,
	y: 'up' | 'down' | null
}

interface DragGesture {
	position: Point;
	timeStamp: number,
	direction: DragDirection;
	distance: DragDistance;
	velocity: DragVelocity;
}

type DragHandlerEvent = 'dragstart' | 'drag' | 'dragend';
interface DragVelocity extends Point {}
interface DragDistance extends Point {}

interface Dimensions {
	height: number;
	width: number;
}

interface Offset {
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

declare module 'drag-handler' {
	export function createDragHandler(el: HTMLElement): DragHandler;
	export function calculateDragDirection(start: DragGesture, end: DragGesture): DragDirection;
	export function calculateDragVelocity(start: DragGesture, end: DragGesture): Point;
	export function calculateDragDistance(start: DragGesture, end: DragGesture): Point;
}