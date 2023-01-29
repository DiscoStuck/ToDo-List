import { format, isSameDay, isSameWeek } from "date-fns";

// Array of projects

const arrProjects = [];

const svgContext = require.context("../svg", false, /\.svg$/);
const svg = {};
svgContext.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".svg", "");
  svg[fileName] = svgContext(key);
});

// Project
class project {
  constructor(title) {
    this.title = title;
    this.tasks = [];
  }

  static addProject(title, arr) {
    arr.push(new project(title));
  }

  static editProject(newTitle, oldTitle, arr) {
    const index = arr.findIndex((element) => element.title === oldTitle);
    arr[index].title = newTitle;
  }

  static deleteProject(oldTitle, arr) {
    const index = arr.findIndex((element) => element.title === oldTitle);
    arr.splice(index, 1);
  }
}

// Task
class task {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
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

  static deleteTask(oldTItle, arr, projectTitle) {
    const projectIndex = arr.findIndex(
      (element) => element.title === projectTitle
    );
    const taskIndex = arr[projectIndex].tasks.findIndex(
      (element) => element.title === oldTitle
    );
    arr[projectIndex].tasks.splice(taskIndex, 1);
  }
}

export { project, task, arrProjects };
