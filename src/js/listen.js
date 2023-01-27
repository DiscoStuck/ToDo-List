function addListener(icon, action, parameter1, parameter2) {
  icon.addEventListener("click", function () {
    action(parameter1, parameter2);
  });
}

export { addListener };
