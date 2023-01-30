function addListener(button, action, parameter1, parameter2) {
  button.style.cursor = "pointer";
  button.addEventListener("click", function () {
    action(parameter1, parameter2);
  });
}

function addListenerOnce(button, action, parameter1, parameter2) {
  button.style.cursor = "pointer";
  button.checkListener = true;
  button.addEventListener("click", function listenerFunction() {
    button.removeEventListener("click", listenerFunction);
    action(parameter1, parameter2);
  });
}
export { addListener, addListenerOnce };
