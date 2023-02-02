import "/src/reset.css";
import "/src/styles.css";
import * as manage from "./manage.js";
import * as display from "./display.js";
import * as listen from "./listen.js";

// manage.arrProjects[0] = new manage.project("Project1");
// manage.arrProjects[1] = new manage.project("Project2");
// manage.arrProjects[0].tasks[0] = new manage.task(
//   "titulo",
//   "descripcion",
//   new Date(),
//   "medium",
//   manage.arrProjects[0]
// );
// manage.arrProjects[1].tasks[0] = new manage.task(
//   "titulo2",
//   "descripcion",
//   new Date(),
//   "medium"
// );

// Local Storage
console.log(localStorage);

if (localStorage.arrProjects === "null") localStorage.clear();
if (localStorage.length > 0) manage.getFromStorage();

// Initial Listeners

(function initialListeners() {
  const tasksToday = document.querySelector(".quickAccess.today");
  listen.addListener(tasksToday, display.displayTasksToday, manage.arrProjects);
  listen.addListener(tasksToday, display.changeActiveFilter, tasksToday);
  const tasksThisWeek = document.querySelector(".quickAccess.thisWeek");
  listen.addListener(
    tasksThisWeek,
    display.displayTasksThisWeek,
    manage.arrProjects
  );
  listen.addListener(tasksThisWeek, display.changeActiveFilter, tasksThisWeek);
})();

display.displayNewProjectButton();
display.displayNewTaskButton();

console.log(manage.arrProjects.length);
console.log(manage.arrProjects);

if (manage.arrProjects.length != 0) {
  display.displayAllProjects(manage.arrProjects);
  display.displayTasksToday(manage.arrProjects);
}
