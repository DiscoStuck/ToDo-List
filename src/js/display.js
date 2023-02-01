import {
  format,
  formatDuration,
  isSameDay,
  isSameWeek,
  isToday,
  parseISO,
} from "date-fns";
import * as listen from "./listen.js";
import * as manage from "./manage.js";

// Import SVG
const svgContext = require.context("../svg", false, /\.svg$/);
const svg = {};
svgContext.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".svg", "");
  svg[fileName] = svgContext(key);
});

// Projects

function displayProject(project) {
  const projectList = document.querySelector(".projectList");
  const projectAccess = document.createElement("div");
  projectAccess.classList.add("projectAccess");
  projectAccess.id = project.ID;
  listen.addListener(projectAccess, displayTasksProject, project);
  listen.addListener(projectAccess, changeActiveFilter, project);
  projectList.appendChild(projectAccess);
  const p = document.createElement("p");
  p.textContent = project.title;
  projectAccess.appendChild(p);
  const edit = document.createElement("img");
  edit.src = svg.edit;
  edit.classList.add("editIcon");
  listen.addListener(edit, editProject, project);
  projectAccess.appendChild(edit);
  const deleteIcon = document.createElement("img");
  deleteIcon.src = svg.delete;
  deleteIcon.classList.add("deleteIcon");
  listen.addListener(deleteIcon, deleteProject, project);
  projectAccess.appendChild(deleteIcon);
}

function deleteProject(project) {
  const projectDiv = document.querySelector(`#${project.ID}`);
  projectDiv.remove();
  const projectIndex = manage.arrProjects.findIndex((x) => x.id === project.ID);
  manage.arrProjects.splice(projectIndex, 1);
}

function displayAllProjects(arr) {
  arr.forEach((element) => displayProject(element));
}

function displayNewProjectButton() {
  const leftBar = document.querySelector(".leftBar");
  const projectAccess = document.createElement("div");
  projectAccess.classList.add("projectAccess");
  leftBar.appendChild(projectAccess);
  const newProjectLeft = document.createElement("div");
  newProjectLeft.classList.add("newProjectLeft");
  projectAccess.appendChild(newProjectLeft);
  const newIcon = document.createElement("img");
  newIcon.classList.add("newIcon");
  newIcon.src = svg.new;
  newProjectLeft.appendChild(newIcon);
  const p = document.createElement("p");
  p.innerText = "New Project";
  newProjectLeft.appendChild(p);
  listen.addListener(projectAccess, createProject);
}

function changeActiveFilter(next) {
  const previousDiv = document.querySelector(".activeFilter");
  previousDiv.classList.remove("activeFilter");
  console.log(next);
  if ("ID" in next) {
    const nextDiv = document.querySelector(`#${next.ID}`);
    nextDiv.classList.add("activeFilter");
  } else next.classList.add("activeFilter");
}

// Tasks

function displayTask(task) {
  const newTaskButton = document.querySelector(".newTaskButton");
  const projectCard = document.createElement("div");
  projectCard.classList.add(`projectCard`);
  projectCard.id = task.ID;
  newTaskButton.before(projectCard);
  const mainRow = document.createElement("div");
  mainRow.classList.add("projectRow");
  mainRow.classList.add("mainRow");
  projectCard.appendChild(mainRow);
  const flag = document.createElement("img");
  flag.classList.add("flag");
  if (task.priority === "low") flag.src = svg.greenFlagIcon;
  else if (task.priority === "medium") flag.src = svg.yellowFlagIcon;
  else flag.src = svg.redFlagIcon;
  mainRow.appendChild(flag);
  const title = document.createElement("h3");
  title.innerText = task.title;
  mainRow.appendChild(title);
  const date = document.createElement("div");
  date.classList.add("date");
  date.innerText = format(task.dueDate, "dd-MM-yyyy");
  mainRow.appendChild(date);
  const arrow = document.createElement("img");
  arrow.src = svg.arrow;
  arrow.classList.add("arrow");
  listen.addListenerOnce(arrow, expandTask, task);
  mainRow.appendChild(arrow);
}

function deleteAllTasks() {
  const divs = document.querySelectorAll(".projectCard");
  divs.forEach((element) => element.remove());
}

function displayTasksProject(project) {
  deleteAllTasks();
  project.tasks.forEach((element) => displayTask(element));
}

function findProjectIndex(ID) {
  const projectIndex = manage.arrProjects.findIndex((x) => x.id === ID);
  return projectIndex;
}

function displayTasksToday(arr) {
  deleteAllTasks();
  arr.forEach((element) => {
    element.tasks.forEach((e) => {
      if (isSameDay(e.dueDate, new Date())) displayTask(e);
    });
  });
}

function displayTasksThisWeek(arr) {
  deleteAllTasks();
  arr.forEach((element) =>
    element.tasks.forEach((e) => {
      if (isSameWeek(e.dueDate, new Date())) displayTask(e);
    })
  );
}

function expandTask(task) {
  const projectCard = document.querySelector(`#${task.ID}`);
  const extendedRow = document.createElement("div");
  extendedRow.classList.add("projectRow");
  extendedRow.classList.add("extendedRow");
  projectCard.appendChild(extendedRow);
  const description = document.createElement("p");
  description.classList.add("description");
  description.innerText = task.description;
  extendedRow.appendChild(description);
  const editIcon = document.createElement("img");
  editIcon.classList.add("editIcon");
  editIcon.src = svg.edit;
  listen.addListener(editIcon, editTask, task);
  extendedRow.appendChild(editIcon);
  const deleteIcon = document.createElement("img");
  deleteIcon.classList.add("deleteIcon");
  deleteIcon.src = svg.delete;
  listen.addListener(deleteIcon, deleteTask, task);
  extendedRow.appendChild(deleteIcon);
  const moveArrow = projectCard.querySelector("img.arrow");
  listen.addListenerOnce(moveArrow, contractTask, task);
  moveArrow.classList.add("down");
}

function contractTask(task) {
  const thisProjectCard = document.querySelector(`#${task.ID}`);
  const extendedRow = thisProjectCard.querySelector(".extendedRow");
  extendedRow.remove();
  const moveArrow = thisProjectCard.querySelector(".arrow");
  listen.addListenerOnce(moveArrow, expandTask, task);
  moveArrow.classList.remove("down");
}

function deleteTask(task) {
  const div = document.querySelector(`#${task.ID}`);
  div.remove();
  const arr = task.project.tasks;
  const taskIndex = arr.indexOf(task);
  arr.splice(taskIndex, 1);
}

function displayNewTaskButton() {
  const rightBar = document.querySelector(".rightBar");
  const projectCard = document.createElement("div");
  projectCard.classList.add("newTaskButton");
  rightBar.appendChild(projectCard);
  const newIcon = document.createElement("img");
  newIcon.classList.add("newIcon");
  newIcon.src = svg.new;
  projectCard.appendChild(newIcon);
  const p = document.createElement("p");
  p.innerText = "New Task";
  projectCard.appendChild(p);
  listen.addListener(projectCard, createTask);
}

// PopUps

function createPopUp(title) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  listen.addListener(overlay, closePopUp);
  document.body.appendChild(overlay);
  const popDiv = document.createElement("div");
  popDiv.classList.add("popUp");
  document.body.appendChild(popDiv);
  const h2 = document.createElement("h2");
  h2.innerText = title;
  popDiv.appendChild(h2);
  const hr = document.createElement("hr");
  popDiv.appendChild(hr);
  return popDiv;
}

function createInputText(div, name, fill) {
  const inputDiv = document.createElement("div");
  inputDiv.classList.add("inputDiv");
  div.appendChild(inputDiv);
  const label = document.createElement("label");
  label.innerText = name;
  label.for = name;
  inputDiv.appendChild(label);
  const input = document.createElement("input");
  input.name = name;
  input.value = fill;
  inputDiv.appendChild(input);
  return input;
}

function createInputDate(div, name, date) {
  const inputDiv = document.createElement("div");
  inputDiv.classList.add("inputDiv");
  div.appendChild(inputDiv);
  const label = document.createElement("label");
  label.innerText = name;
  label.for = name;
  inputDiv.appendChild(label);
  const input = document.createElement("input");
  input.name = name;
  input.type = "date";
  input.value = date;
  inputDiv.appendChild(input);
  return parseISO(input.value);
}

function createInputProject(div, arr) {
  const inputDiv = document.createElement("div");
  inputDiv.classList.add("inputDiv");
  div.appendChild(inputDiv);
  const label = document.createElement("label");
  label.innerText = "Project";
  label.for = "project";
  inputDiv.appendChild(label);
  const select = document.createElement("select");
  select.name = "project";
  inputDiv.appendChild(select);
  arr.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.title;
    option.ID = project.ID;
    option.innerText = project.title;
    select.appendChild(option);
  });
  return select;
}

function createSelectPriority(div) {
  const inputDiv = document.createElement("div");
  inputDiv.classList.add("inputDiv");
  div.appendChild(inputDiv);
  const label = document.createElement("label");
  label.innerText = "Priority";
  label.name = "priority";
  inputDiv.appendChild(label);
  const select = document.createElement("select");
  select.name = "priority";
  inputDiv.appendChild(select);
  const low = document.createElement("option");
  low.value = "low";
  low.innerText = "Low";
  select.appendChild(low);
  const mid = document.createElement("option");
  mid.value = "mid";
  mid.innerText = "Medium";
  select.appendChild(mid);
  const high = document.createElement("option");
  high.value = "high";
  high.innerText = "High";
  select.appendChild(high);
  return select.value;
}

function createProject() {
  const popDiv = createPopUp("New Project");
  const input = createInputText(popDiv, "Title", "");
  const button = document.createElement("button");
  button.classList.add("sendForm");
  button.innerText = "Create Project";
  popDiv.appendChild(button);
  const addProject = (arr) => {
    arr.push(new manage.project(input.value));
    displayProject(arr[arr.length - 1]);
  };
  listen.addListener(button, addProject, manage.arrProjects);
  listen.addListener(button, closePopUp);
}

function editProject(project) {
  const popDiv = createPopUp("Edit Project");
  const input = createInputText(popDiv, "Title", project.title);
  const button = document.createElement("button");
  button.classList.add("sendForm");
  button.innerText = "Edit";
  button.addEventListener("click", function () {
    const projectDiv = document.querySelector(`#${project.ID}`);
    const p = projectDiv.querySelector("p");
    project.title = input.value;
    p.innerText = input.value;
    closePopUp();
  });
  popDiv.appendChild(button);
}

function createTask() {
  const popDiv = createPopUp("New Task");
  const title = createInputText(popDiv, "Title", "");
  const description = createInputText(popDiv, "Description", "");
  const date = createInputDate(
    popDiv,
    "Date",
    format(new Date(), "yyyy-MM-dd")
  );
  const inProject = createInputProject(popDiv, manage.arrProjects);
  const priority = createSelectPriority(popDiv);
  const button = document.createElement("button");
  button.classList.add("sendForm");
  button.innerText = "Create Task";
  button.addEventListener("click", function () {
    const task = manage.task.addTask(
      title.value,
      description.value,
      date,
      priority,
      manage.arrProjects,
      inProject.value
    );
    console.log(inProject.value);
    const projectIndex = findProjectIndex(inProject.ID);
    displayTasksProject(manage.arrProjects[projectIndex]);
    changeActiveFilter(manage.arrProjects[projectIndex]);
    closePopUp();
  });
  popDiv.appendChild(button);
}

function editTask(task) {
  const popDiv = createPopUp("Edit Task");
  const taskDiv = document.querySelector(`#${task.ID}`);
  const title = createInputText(popDiv, "Title", task.title);
  const description = createInputText(popDiv, "Description", task.description);
  const date = createInputDate(
    popDiv,
    "Date",
    format(task.dueDate, "yyyy-MM-dd")
  );
  const priority = createSelectPriority(popDiv);
  const inProject = createInputProject(popDiv, manage.arrProjects);
  const button = document.createElement("button");
  button.classList.add("sendForm");
  button.innerText = "Edit";
  button.addEventListener("click", function () {
    task.title = title.value;
    task.description = description.value;
    task.dueDate = date;
    task.priority = priority;
    task.project = inProject.value;
    updateTaskDiv(task, priority);
    const h3 = taskDiv.querySelector("h3");
    h3.innerText = title.value;
    const dateField = taskDiv.querySelector(".date");
    dateField.innerText = format(date, "dd-MM-yyyy");
    closePopUp();
  });
  popDiv.appendChild(button);
}

function updateTaskDiv(task, priority) {
  const taskDiv = document.querySelector(`#${task.ID}`);
  const flag = taskDiv.querySelector(".flag");
  if (priority === "low") flag.src = svg.greenFlagIcon;
  else if (priority === "medium") flag.src = svg.yellowFlagIcon;
  else flag.src = svg.redFlagIcon;
}

function closePopUp() {
  const popUp = document.querySelector(".popUp");
  const overlay = document.querySelector(".overlay");
  popUp.remove();
  overlay.remove();
}

export {
  displayProject,
  displayAllProjects,
  displayNewProjectButton,
  displayTask,
  displayTasksToday,
  displayTasksThisWeek,
  displayNewTaskButton,
  createProject,
  editProject,
  createTask,
  editTask,
  expandTask,
  svg,
  changeActiveFilter,
};
