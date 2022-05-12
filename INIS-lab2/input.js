import eventProcessing from "./eventProcessor.js";
import context from "./context.js";

const initTargetMeta = (target) => {
  target.isMoved = false;
  target.x = target.style.left;
  target.y = target.style.top;
}

const setEventsToTarget = (target) => {
  target.onclick = (event) => {
    console.log("click");
    return eventProcessing.processClickEvent(event, target);
  };
  target.onmousedown = (event) => {
    console.log("mousedown");
    return eventProcessing.processMousedownEvent(event, target)
  };
  target.ondblclick = (event) => {
    console.log("dblclick");
    return eventProcessing.processDblclickEvent(event, target)
  };
  target.ontouchstart = (event) => {
    console.log("touchstart");
    return eventProcessing.processTouchstartEvent(event, target)
  };
}

const setEventsToDocument = () => {
  document.ontouchend = (event) => {
    console.log("touchend");
    return eventProcessing.processTouchendEvent(event)
  };
  document.onkeyup = (event) => eventProcessing.processKeydownEvent(event);
}

const init = (target) => {
  setEventsToTarget(target);
  setEventsToDocument();
  initTargetMeta(target);
}

context.targets.forEach(target => init(target));
