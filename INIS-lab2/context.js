const targets = Array.from(document.getElementsByClassName("target"));
let activeTarget = null;
let tempEvents = [];
let touchTimer = null;
let zoom = null;

export default {
  targets,
  activeTarget,
  tempEvents,
  touchTimer,
  zoom
}