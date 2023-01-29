import {
  format,
  formatDuration,
  isSameDay,
  isSameWeek,
  isToday,
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
  projectAccess.classList.add(project.title);
  listen.addListener(projectAccess, displayTasksProject, project);
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
  const projectDiv = document.querySelector(`.${project.title}`);
  projectDiv.remove();
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

// Tasks

function displayTask(task) {
  const rightBar = document.querySelector(".rightBar");
  const projectCard = document.createElement("div");
  projectCard.classList.add(`projectCard`);
  projectCard.classList.add(task.title);
  rightBar.appendChild(projectCard);
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
  date.innerText = format(task.dueDate, "dd-mm-yyyy");
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
  const projectCard = document.querySelector(`.projectCard.${task.title}`);
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
  extendedRow.appendChild(editIcon);
  const deleteIcon = document.createElement("img");
  deleteIcon.classList.add("deleteIcon");
  deleteIcon.src = svg.delete;
  extendedRow.appendChild(deleteIcon);
  const moveArrow = projectCard.querySelector("img.arrow");
  listen.addListenerOnce(moveArrow, contractTask, task);
  moveArrow.classList.add("down");
}

function contractTask(task) {
  console.log(task);
  const thisProjectCard = document.querySelector(`.projectCard.${task.title}`);
  console.log(thisProjectCard);
  const extendedRow = thisProjectCard.querySelector(".extendedRow");
  console.log(extendedRow);
  extendedRow.remove();
  const moveArrow = thisProjectCard.querySelector(".arrow");
  listen.addListenerOnce(moveArrow, expandTask, task);
  moveArrow.classList.remove("down");
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
}

function createProject() {
  const popDiv = createPopUp("New Project");
  createInputText(popDiv, "Title", "");
  const button = document.createElement("button");
  button.classList.add("sendForm");
  button.innerText = "Create Project";
  popDiv.appendChild(button);
}

function editProject(project) {
  const popDiv = createPopUp("Edit Project");
  createInputText(popDiv, "Title", project.title);
  const button = document.createElement("button");
  button.classList.add("sendForm");
  button.innerText = "Edit";
  popDiv.appendChild(button);
}

function createTask(project) {
  const popDiv = createPopUp("New Task");
  createInputText(popDiv, "Title", "");
  createInputText(popDiv, "Description", "");
  createInputDate(popDiv, "Date", format(new Date(), "yyyy-MM-dd"));
  createSelectPriority(popDiv);
  const button = document.createElement("button");
  button.classList.add("sendForm");
  button.innerText = "Create Task";
  popDiv.appendChild(button);
}

function editTask(task) {
  const popDiv = createPopUp("Edit Task");
  createInputText(popDiv, "Title", task.title);
  createInputText(popDiv, "Description", task.description);
  createInputDate(popDiv, "Date", format(task.dueDate, "yyyy-MM-dd"));
  createSelectPriority(popDiv);
  const button = document.createElement("button");
  button.classList.add("sendForm");
  button.innerText = "Edit";
  popDiv.appendChild(button);
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
  createProject,
  editProject,
  createTask,
  editTask,
  expandTask,
  svg,
};
