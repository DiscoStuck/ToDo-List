// Array of projects

let arrProjects = [];

const svgContext = require.context("../svg", false, /\.svg$/);
const svg = {};
svgContext.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".svg", "");
  svg[fileName] = svgContext(key);
});

// Random ID

function generateRandomID() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Project
class project {
  constructor(title) {
    this.title = title;
    this.tasks = [];
    this.ID = generateRandomID();
  }
}

// Task
class task {
  constructor(title, description, dueDate, priority, inProject) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.ID = generateRandomID();
    this.project = inProject;
  }

  static addTask(title, description, dueDate, priority, arr, projectTitle) {
    const projectIndex = arr.findIndex(
      (element) => element.title === projectTitle
    );
    console.log(projectIndex);
    const newTask = new task(title, description, dueDate, priority);
    arr[projectIndex].tasks.push(newTask);
    return newTask;
  }
}

// Local Storage
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function saveToStorage() {
  console.log("hola");
  if (storageAvailable("localStorage"))
    localStorage.setItem("arrProjects", JSON.stringify(arrProjects));
}

function getFromStorage() {
  if (storageAvailable("localStorage"))
    arrProjects = JSON.parse(localStorage.getItem("arrProjects"));
}

export { project, task, arrProjects, saveToStorage, getFromStorage };
