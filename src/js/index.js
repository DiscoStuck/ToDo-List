import "/src/reset.css";
import "/src/styles.css";
import * as manage from "./manage.js";
import * as display from "./display.js";

const arrProjects = [];

arrProjects[0] = new manage.project("Prueba");
arrProjects[0].tasks = new manage.task(
  "titulo",
  "descripcion",
  "fecha",
  "prioridad"
);

display.displayProject(arrProjects[0]);
display.createTask();

console.log(arrProjects);
