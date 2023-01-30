import "/src/reset.css";
import "/src/styles.css";
import * as manage from "./manage.js";
import * as display from "./display.js";
import * as listen from "./listen.js";
import { format, isSameDay, isSameWeek } from "date-fns";
import { cursorListeners } from "./listen.js";

manage.arrProjects[0] = new manage.project("Project1");
manage.arrProjects[1] = new manage.project("Project2");
manage.arrProjects[0].tasks[0] = new manage.task(
  "titulo",
  "descripcion",
  new Date(),
  "medium",
  manage.arrProjects[0]
);
manage.arrProjects[1].tasks[0] = new manage.task(
  "titulo2",
  "descripcion",
  new Date(),
  "medium"
);

// Initial Listeners

(function initialListeners() {
  const tasksToday = document.querySelector(".quickAccess.today");
  listen.addListener(tasksToday, display.displayTasksToday, manage.arrProjects);
  const tasksThisWeek = document.querySelector(".quickAccess.thisWeek");
  listen.addListener(
    tasksThisWeek,
    display.displayTasksThisWeek,
    manage.arrProjects
  );
})();

display.displayAllProjects(manage.arrProjects);

display.displayTasksToday(manage.arrProjects);

display.displayNewProjectButton();
