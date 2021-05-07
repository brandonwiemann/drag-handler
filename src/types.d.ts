type DragDirection = {
	x: 'left' | 'right' | null,
	y: 'up' | 'down' | null
}

type DragGesture = {
	position: DragVector;
	timeStamp: number,
	direction?: DragDirection;
	distance?: DragVector;
	velocity?: DragVector;
}

type DragHandlerEvent = 'dragstart' | 'drag' | 'dragend';

type DragVector = { x: number, y: number }

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
	export function calculateDragVelocity(start: DragGesture, end: DragGesture): DragVector;
	export function calculateDragDistance(start: DragGesture, end: DragGesture): DragVector;
}