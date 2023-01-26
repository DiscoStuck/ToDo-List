import { format, isSameDay, isSameWeek } from "date-fns";

const svgContext = require.context("../svg", false, /\.svg$/);
const svg = {};
svgContext.keys().forEach((key) => {
  const fileName = key.replace("./", "").replace(".svg", "");
  svg[fileName] = svgContext(key);
});

console.log(svg);

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
  projectAccess.appendChild(edit);
  const deleteIcon = document.createElement("img");
  deleteIcon.src = svg.delete;
  deleteIcon.classList.add("deleteIcon");
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
  projectCard.classList.add(`projectCard ${task.title}`);
  rightBar.appendChild(projectCard);
  const mainRow = document.createElement("div");
  mainRow.classList.add("projectRow mainROw");
  projectCard.appendChild(mainRow);
  const flag = document.createElement("img");
  flag.classList.add("flag");
  if (task.priority === "low") flag.src = "svg/green-flag-icon.svg";
  else if (task.priority === "medium") flag.src = "svg/yellow-flag-icon.svg";
  else flag.src = "svg/red-flag-icon.svg";
  mainRow.appendChild(flag);
  const title = document.createElement("h3");
  title.innerText = task.title;
  mainRow.appendChild(title);
  const date = document.createElement("div");
  date.classList.add("date");
  date.innerText = task.dueDate;
  mainRow.appendChild(date);
  const arrow = document.createElement("img");
  arrow.src = "svg/arrow.svg";
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
  const projectCard = document.querySelector(`.projectCard ${task.title}`);
  const extendedRow = document.createElement("div");
  extendedRow.classList.add("projectRow extendedRow");
  projectCard.appendChild(extendedRow);
  const description = document.createElement("p");
  description.classList.add("description");
  description.innerText = task.description;
  extendedRow.appendChild(description);
  const editIcon = document.createElement("img");
  editIcon.classList.add("editIcon");
  editIcon.src = "./svg/edit.svg";
  extendedRow.appendChild(editIcon);
  const deleteIcon = document.createElement("img");
  deleteIcon.classList.add("deleteIcon");
  deleteIcon.src = "./svg/delete.svg";
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

export { displayProject };
