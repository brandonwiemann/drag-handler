
# Drag Handler

A tiny (1kb gzipped), high-performance, zero-dependency mouse/touch event wrapper for handling drag and swipe interactions. Useful for creating drag and drop interactions or detecting swipes on a touch device.
Inspired by [Matt Hinchliffe](https://www.matthinchliffe.dev/2015/02/16/high-performance-touch-interactions.html).

## Installation

TODO:

## Usage
```typescript
import { createDragHandler } from 'drag-handler'

let draggable = document.getElementById('myDraggableElement');
let handler = createDragHandler(draggable);

handler.on('dragstart' (e: CustomEvent<DragGesture>) => {
	// Do something at the start of the drag
});

handler.on('drag' (e: CustomEvent<DragGesture>) => {
	// Do something during the drag interaction
});

handler.on('dragend' (e: CustomEvent<DragGesture>) => {
	// Do something at the end of the drag
});
```

## Handler Methods
|Name|Type|Description
|--|--|--|
|eventName| `string`| The event name to listen for
|callback| `function`| The event listener callback function

## Handler Event Names
|Name|Description
|--|--|
|`"dragstart"`| Triggered on the initial touchstart/mousedown event
|`"drag"`| Triggered between dragstart and dragend when the pointer position moves
|`"dragend"`| Triggered on the next touchend/mouseup event, when the drag is finished

## Handler Event Details
Each handler event will include a `DragGesture` object as the event details. This object contains several pieces of information about the drag event.

```typescript
handler.on('drag' (e: CustomEvent<DragGesture>) => {
	let { distance, direction, position, timeStamp,velocity } = e.details;
});
```
### DragGesture
|Property|Type|Description
|--|--|--|
|direction| object|The direction of the drag from the previous gesture
|distance| object|The horizontal and vertical distance from the first gesture
|position| object|The position of the drag event relative to the window
|timeStamp| number| The event timestamp in milliseconds
|velocity| object| The velocity of the drag from the previous gesture

### DragGesture.direction
|Property|Type|Description
|--|--|--|
|x| string| The horizontal direction as a string "left" or "right"
|y| string| The vertical direction as a string "up" or "down"

### DragGesture.distance
|Property|Type|Description
|--|--|--|
|x| number| The horizontal distance from the first event in px
|y| number| The vertical distance from the first event in px

### DragGesture.position
|Property|Type|Description
|--|--|--|
|x| number| The touch/mouse event pageX property
|y| number| The touch/mouse event pageY property

### DragGesture.velocity
|Property|Type|Description
|--|--|--|
|x| number| The horizontal velocity of the gesture
|y| number| The vertical velocity of the gesture

## Example Usages
#### Dragging and dropping an element
```typescript
import { createDragHandler } from 'drag-handler'

let draggable = document.getElementById('myDraggableElement');
let handler = createDragHandler(draggable);

handler.on('drag' (e: CustomEvent<DragGesture>) => {
	let { x, y } = e.details.distance;
	draggable.style.transform = `translate3d(${x}, ${y}, 0)`;
});
```

#### Dragging and swiping horizontal carousel slides
```typescript
import { createDragHandler } from 'drag-handler'

let carousel = new ExampleCarouselLibrary('#myCarousel');
let handler = createDragHandler(carousel.viewport as HTMLElement);
let paginationDistance = carousel.width() / 3;

handler.on('drag' (e: CustomEvent<DragGesture>) => {
	let { x } = e.details.distance;
	carousel.activeSlide.style.transform = `translate3d(${x}, 0, 0)`;
});

handler.on('dragend' (e: CustomEvent<DragGesture>) => {
	if(e.details.distance.x > paginationDistance) {
		let direction = e.details.direction.x;
		if(direction === 'left') carousel.slideNext();
		if(direction === 'right') carousel.slidePrevious();
	} else {
		carousel.activeSlide.style.transform = 'none';
	}
});
```

## License - MIT