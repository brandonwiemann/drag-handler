// Inspired by Matt Hinchliffe
// https://www.matthinchliffe.dev/2015/02/16/high-performance-touch-interactions.html


export function createDragHandler(el: HTMLElement): DragHandler {
    let animationFrame: number | null = null;
    let dimensions: Dimensions | null = null;
    let dragInterval = 16;
    let element: HTMLElement | null = el;
    let eventTarget: EventTarget = new EventTarget();
    let firstGesture: DragGesture | null = null;
    let lastGesture: DragGesture | null = null;
    let offset: Offset | null = null;

    /* Public
    ============================================*/

    function on(eventType: DragHandlerEvent,
        fn: (event: CustomEvent<DragGesture>) => any): void {
        eventTarget.addEventListener(eventType, fn as EventListener);
    };

    function destroy(): void {
        offset = null;
        dimensions = null;
        firstGesture = null;
        lastGesture = null;
        animationFrame = null;
        window.removeEventListener('mousemove', dragMove, false);
        window.removeEventListener('mouseup', dragEnd, false);
        window.removeEventListener('touchmove', dragMove, false);
        window.removeEventListener('touchend', dragEnd, false);

        if(element) {
            element.removeEventListener('mousedown', dragStart, false);
            element.removeEventListener('touchstart', dragStart, false);
            element = null;
        }
    };

    /* Private
    ============================================*/

    function dragStart(e: TouchOrMouseEvent): void {
        if (!element || (e.touches && e.touches.length > 1)) return;
        let position = element.getBoundingClientRect();
        let pointer = e.touches ? e.touches[0] : e as MouseEvent;

        offset = {
            left: pointer.pageX - position.left,
            top: pointer.pageY - position.top
        };

        dimensions = {
            width: position.width,
            height: position.height
        };

        firstGesture = createNewGesture(e);
        lastGesture = createNewGesture(e);

        let options = { passive: false, capture: false };
        window.addEventListener('mousemove', dragMove, options);
        window.addEventListener('mouseup', dragEnd, options);
        window.addEventListener('touchmove', dragMove, options);
        window.addEventListener('touchend', dragEnd, options);
        dispatchGestureEvent('dragstart', firstGesture);
        e.preventDefault();
    };

    function dragMove(e: TouchOrMouseEvent): void {
        if(!offset || !lastGesture) return;

        if ((e.timeStamp - lastGesture.timeStamp) > dragInterval) {
            lastGesture = createNewGesture(e, firstGesture, lastGesture);
        }

        let pointer = e.touches ? e.touches[0] : e as MouseEvent;
        let posX = pointer.pageX - offset.left || 0;
        let posY = pointer.pageY - offset.top || 0;

        if (posX < 0) {
            posX = 0;
        } else if ((posX + dimensions.width) > window.innerWidth) {
            posX = window.innerWidth - dimensions.width;
        }

        if (posY < 0) {
            posY = 0;
        } else if ((posY + dimensions.height) > window.innerHeight) {
            posY = window.innerHeight - dimensions.height;
        }

        if(animationFrame) {
            window.cancelAnimationFrame(animationFrame);
        }

        animationFrame = window.requestAnimationFrame(() => {
            dispatchGestureEvent('drag', lastGesture);
        });

        e.preventDefault();
    };

    function dragEnd(e: TouchEvent | MouseEvent): void {
        if(animationFrame) {
            window.cancelAnimationFrame(animationFrame);
        }

        dispatchGestureEvent('dragend', lastGesture);

        offset = null;
        dimensions = null;
        firstGesture = null;
        lastGesture = null;
        animationFrame = null;

        e.stopPropagation();
        e.preventDefault();

        window.removeEventListener('mousemove', dragMove, false);
        window.removeEventListener('mouseup', dragEnd, false);
        window.removeEventListener('touchmove', dragMove, false);
        window.removeEventListener('touchend', dragEnd, false);
    };

    function dispatchGestureEvent(eventName: DragHandlerEvent, detail: DragGesture | null): void {
        eventTarget.dispatchEvent(new CustomEvent<DragGesture>(eventName, {
            detail: detail || undefined
        }));
    };

    el.addEventListener('mousedown', dragStart, false);
    el.addEventListener('touchstart', dragStart, {
        capture: false,
        passive: false
    });

    return { on, destroy };
};

/**
 * Calculates the direction between two drag gestures
 */
 export function calculateDragDirection(start: DragGesture, end: DragGesture): DragDirection {
    let diffX = start.position.x - end.position.x;
    let diffY = start.position.y - end.position.y;

    return {
        x: Math.abs(diffX) > 0 ? (diffX > 0 ? 'left' : 'right') : null,
        y: Math.abs(diffY) > 0 ? (diffY > 0 ? 'up' : 'down') : null
    };
}

/**
 * Calculates the velocity of drag between two gestures
 */
export function calculateDragVelocity(start: DragGesture, end: DragGesture): DragVelocity {
    let deltaTime = end.timeStamp - start.timeStamp;
    let ratioX = (100 / window.innerWidth) * (start.position.x - end.position.x);
    let ratioY = (100 / window.innerHeight) * (start.position.y - end.position.y);

    return {
        x: Math.abs(ratioX / deltaTime),
        y: Math.abs(ratioY / deltaTime)
    };
}

/**
 * Calculates the distance between two drag gestures
 */
export function calculateDragDistance(start: DragGesture, end: DragGesture): DragDistance {
    return {
        x: end.position.x - start.position.x,
        y: end.position.y - start.position.y
    };
}

function createNewGesture(e: TouchOrMouseEvent, firstGesture?: DragGesture, lastGesture?: DragGesture): DragGesture {
    let pointer = e.touches ? e.touches[0] : e as MouseEvent;
    let newGesture: DragGesture = {
        position: { x: pointer.pageX, y: pointer.pageY },
        timeStamp: e.timeStamp,
        direction: { x: null, y: null },
        distance: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 }
    }

    if(!lastGesture) return newGesture;
    newGesture.velocity = calculateDragVelocity(lastGesture, newGesture);
    newGesture.direction = calculateDragDirection(lastGesture, newGesture);

    if(!firstGesture) return newGesture;
    newGesture.distance = calculateDragDistance(firstGesture, newGesture);

    return newGesture;
}