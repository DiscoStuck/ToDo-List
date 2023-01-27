import "/src/reset.css";
import "/src/styles.css";
import * as manage from "./manage.js";
import * as display from "./display.js";
import { format, isSameDay, isSameWeek } from "date-fns";

const arrProjects = [];

arrProjects[0] = new manage.project("Prueba");
arrProjects[0].tasks[0] = new manage.task(
  "titulo",
  "descripcion",
  format(new Date(), "yyyy-MM-dd"),
  "medium"
);

display.displayProject(arrProjects[0]);

console.log(arrProjects[0].tasks[0].title);

display.displayTask(arrProjects[0].tasks[0]);
display.expandTask(arrProjects[0].tasks[0]);

export { arrProjects };
