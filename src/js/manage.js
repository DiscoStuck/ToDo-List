import { format, isSameDay, isSameWeek } from "date-fns";

// Array of projects

const arrProjects = [];

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
    arr[projectIndex].tasks.push(
      new task(title, description, dueDate, priority)
    );
  }

  static editTask(
    title,
    description,
    dueDate,
    priority,
    oldTitle,
    arr,
    projectTitle
  ) {
    const projectIndex = arr.findIndex(
      (element) => element.title === projectTitle
    );
    const taskIndex = arr[projectIndex].tasks.findIndex(
      (element) => element.title === oldTitle
    );
    arr[projectIndex].tasks[taskIndex].title = title;
    arr[projectIndex].tasks[taskIndex].description = description;
    arr[projectIndex].tasks[taskIndex].dueDate = dueDate;
    arr[projectIndex].tasks[taskIndex].priority = priority;
  }
}

export { project, task, arrProjects };
