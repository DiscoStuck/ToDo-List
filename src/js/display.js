function displayProject(project) {
  const projectList = document.querySelector(".projectList");
  const projectAccess = document.createElement("div");
  project.classList.add("projectAccess");
  project.classList.add(project.title);
  projectList.appendChild(projectAccess);
  const p = document.createElement("p");
  p.textContent = project.title;
  projectAccess.appendChild(p);
  const edit = document.createElement("img");
  edit.src = "svg/edit.svg";
  edit.classList.add("editIcon");
  projectAccess.appendChild(edit);
  const deleteIcon = document.createElement("img");
  deleteIcon.src = "svg/delete.svg";
  deleteIcon.classList.add("deleteIcon");
  projectAccess.appendChild(deleteICon);
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
