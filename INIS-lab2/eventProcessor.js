import context from "./context.js";

const processClickEvent = (event, target) => {
  removeBlue();
  makeBlue(target);
  if (!target.isMoved) {
    activateClickedTarget(target);
  }
  target.isMoved = false;
}

const cancel = () => {
  context.activeTarget.style.left = context.activeTarget.x;
  context.activeTarget.style.top = context.activeTarget.y;
  clearEvents();
}

const processKeydownEvent = (event) => {
  if (event.key === 'Escape') {
    cancel();
  }
}

const processMousedownEvent = (event, target) => {
  context.activeTarget = target;
  const processMousemoveEvent = processMovement(event, 'mousemove');
  document.addEventListener('mousemove', processMousemoveEvent);
  target.onmouseup = () => endMoving();
};

const processDblclickEvent = (event, target) => {
  activateClickedTarget(target);
  removeBlue();
  makeBlue(target);
  activateClickedTarget(target);
  const processMousemoveEvent = processMovement(event, 'mousemove');
  const processTouchmoveEvent = processMovement(event, 'touchmove');
  document.addEventListener('mousemove', processMousemoveEvent);
  document.addEventListener('touchmove', processTouchmoveEvent);
  document.addEventListener('click', () => {
    removeBlue();
    endMoving();
  }, {once: true});
}

const processTouchstartEvent = (event, target) => {
  activateClickedTarget(target);
  if (isDoubleTouch()) {
    const processTouchmoveEvent = processScale(event, 'touchmove');
    target.addEventListener('touchmove', processTouchmoveEvent);
    document.addEventListener('touchend', () => endMoving(), {once: true});
  } else {
    const processTouchmoveEvent = processMovement(event, 'touchmove');
    document.addEventListener('touchmove', processTouchmoveEvent);
    target.ontouchend = () => endMoving();
  }
}

const processTouchendEvent = (event) => {
  clearTimeout(context.touchTimer);
  context.touchTimer = null;
}

const makeBlue = (target) => {
  target.classList.add('blue-color');
}

const removeBlue = () => {
  context.targets.forEach(target => target.classList.remove('blue-color'));
}

const activateClickedTarget = (target) => {
  context.activeTarget = target;
}

const processMovement = (event, type) => {
  let {shiftX, shiftY} = getCoordinates(event);
  const processMoveEvent = (event) => {
    if (event.changedTouches?.length === 2) {
      cancel();
      return;
    }
    context.activeTarget.isMoved = true;
    document.getElementById("workspace").appendChild(context.activeTarget);
    context.activeTarget.style.left = (event.pageX || event.changedTouches[0].pageX) - shiftX + 'px';
    context.activeTarget.style.top = (event.pageY || event.changedTouches[0].pageY) - shiftY + 'px';
  }
  context.tempEvents.push({listener: processMoveEvent, type: type});
  return processMoveEvent;
}

const processScale = (event, type) => {
  const processScaleEvent = (event) => {
    if (event.touches.length <= 1) {
      return;
    }
    const scale = Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    if (context.zoom) {
      context.activeTarget.style.transform = "scale(" + Math.abs(scale / context.zoom) + ")";
    } else {
      context.zoom = scale;
    }
  }
  context.tempEvents.push({listener: processScaleEvent, type: type});
  return processScaleEvent;
}

const endMoving = () => {
  clearEvents();
  if (context.zoom) {
    context.activeTarget.style.left = context.activeTarget.getBoundingClientRect().left + "px";
    context.activeTarget.style.top = context.activeTarget.getBoundingClientRect().top + "px";
    context.activeTarget.style.width = context.activeTarget.getBoundingClientRect().width + "px";
    context.activeTarget.style.height = context.activeTarget.getBoundingClientRect().height + "px";
    context.activeTarget.style.transform = "scale(1)";
  }
  context.activeTarget.x = context.activeTarget.style.left;
  context.activeTarget.y = context.activeTarget.style.top;
  context.activeTarget.isMoved = false;
  context.zoom = null;
}

const getCoordinates = (event) => {
  let shiftX = (event.clientX || event.changedTouches[0].clientX) - +context.activeTarget.style.left.replace("px", "");
  let shiftY = (event.clientY || event.changedTouches[0].clientY) - +context.activeTarget.style.top.replace("px", "");
  return {shiftX, shiftY};
}

const clearEvents = () => {
  context.tempEvents.forEach(event => document.removeEventListener(event.type, event.listener));
  context.tempEvents = [];
}

const isDoubleTouch = () => {
  if (!context.touchTimer) {
    context.touchTimer = setTimeout(() => context.touchTimer = null, 500);
  } else {
    clearTimeout(context.touchTimer);
    return true;
  }
}

export default {
  processClickEvent,
  processMousedownEvent,
  processDblclickEvent,
  processKeydownEvent,
  processTouchstartEvent,
  processTouchendEvent
}