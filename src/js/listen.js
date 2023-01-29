function addListener(button, action, parameter1, parameter2) {
  button.checkListener = true;
  button.addEventListener("click", function () {
    action(parameter1, parameter2);
  });
}

function addListenerOnce(button, action, parameter1, parameter2) {
  button.checkListener = true;
  button.addEventListener("click", function listenerFunction() {
    button.removeEventListener("click", listenerFunction);
    action(parameter1, parameter2);
  });
}

// Cursor
function cursorListeners() {
  const elements = document.querySelectorAll("button, img, div");

  elements.forEach((element) => {
    if (element.checkListener) element.style.cursor = "pointer";
  });
}
export { addListener, addListenerOnce, cursorListeners };
