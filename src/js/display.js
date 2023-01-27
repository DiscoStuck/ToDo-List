import { format, isSameDay, isSameWeek } from "date-fns";
import * as listen from "./listen.js";
import * as manage from "./manage.js";
import * as index from "./index.js";

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
  listen.addListener(
    deleteIcon,
    manage.project.deleteProject,
    project.title,
    index.arrProjects
  );
  projectAccess.appendChild(deleteIcon);
}

function deleteProject(project) {
  const projectDiv = document.querySelector(`.${project.title}`);
  projectDiv.remove();
}

function displayALlProjects(arr) {
  arr.foreach((element) => displayProject(element));
}

function deleteAllProjects() {
  const projectList = document.querySelector("projectLists");
  projectList.innerHTML = "";
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
  console.log(svg);
  if (task.priority === "low") flag.src = svg.greenFlagIcon;
  else if (task.priority === "medium") flag.src = svg.yellowFlagIcon;
  else flag.src = svg.redFlagIcon;
  mainRow.appendChild(flag);
  const title = document.createElement("h3");
  title.innerText = task.title;
  mainRow.appendChild(title);
  const date = document.createElement("div");
  date.classList.add("date");
  date.innerText = task.dueDate;
  mainRow.appendChild(date);
  const arrow = document.createElement("img");
  arrow.src = svg.arrow;
  arrow.classList.add("arrow");
  mainRow.appendChild(arrow);
}

function displayTasksProject(project) {
  project.tasks.forach((element) => displayTask(element));
}

function displayTasksToday(arr) {
  arr.foreach((element) =>
    element.foreach((e) => {
      if (isSameDay(e.date, new Date())) displayTask(e);
    })
  );
}

function displayTasksWeek(arr) {
  arr.foreach((element) =>
    element.foreach((e) => {
      if (isSameWeek(e.date, new Date())) displayTask(e);
    })
  );
}

function expandTask(task) {
  const projectCard = document.querySelector(`.projectCard.${task.title}`);
  const extendedRow = document.createElement("div");
  console.log(projectCard);
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
  const moveArrow = projectCard.querySelector(".arrow");
  moveArrow.classList.add("down");
}

function contractTask(task) {
  const projectCard = document.querySelector(`.projectCard ${task.title}`);
  const extendedRow = projectCard.querySelector(".extendedRow");
  extendedRow.remove();
  const moveArrow = projectCard.querySelector(".arrow");
  moveArrow.classList.remove("down");
}

// PopUps

function createPopUp(title) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
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

export {
  displayProject,
  displayTask,
  createProject,
  editProject,
  createTask,
  editTask,
  expandTask,
};
