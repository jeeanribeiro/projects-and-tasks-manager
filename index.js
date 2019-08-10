const express = require("express");
const app = express();

app.use(express.json());

let requestsAmount = 0;
const projects = [];

// Middleware that checks if a project exists
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

// Middleware that logs the amount of requests
function logRequests(req, res, next) {
  requestsAmount++;

  console.log(`Requests amount: ${requestsAmount}`);

  return next();
}

app.use(logRequests);

/*
 * Projects
 */

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.get("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  return res.json(project);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

app.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

app.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/*
 * Tasks
 */

app.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

app.listen(3000);
