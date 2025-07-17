const { Router } = require("express");
const Project = require("../models/project");
const cloudinary = require('cloudinary').v2;
const upload = require("../middleware/multerConfig");

const router = Router();

router.get("/view", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const query = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { title: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};
    const projects = await Project.find(query);
    res.render("view-project", { projects, message: null, searchQuery });
  } catch (error) {
    res.status(500).render("view-project", {
      projects: [],
      message: `Error loading projects: ${error.message}`,
      searchQuery: "",
    });
  }
});

router.get("/json", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to load projects", error: error.message });
  }
});

router.get("/create", (req, res) => {
  res.render("edit-project", { project: {}, message: null });
});

router.post("/create", upload.single("projectImg"), async (req, res) => {
  try {
    const { name, title, description, projectsUrl, projectCodeViewurl } = req.body;
    if (!name || !title || !description || !projectsUrl || !projectCodeViewurl) {
      return res.status(400).render("edit-project", {
        project: req.body,
        message: "All fields are required, including Project URL and Code View URL",
      });
    }
    let projectImg = "";
    if (req.file && req.file.path) {
      projectImg = req.file.path;
    }
    const newProject = new Project({
      name,
      title,
      description,
      projectImg,
      projectsUrl,
      projectCodeViewurl,
    });
    await newProject.save();
    res.redirect("/api/projects/view");
  } catch (error) {
    res.status(500).render("edit-project", {
      project: req.body,
      message: `Failed to create project: ${error.message}`,
    });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const projects = await Project.find();
      return res.status(404).render("view-project", {
        projects,
        message: "Project not found",
        searchQuery: "",
      });
    }
    res.render("edit-project", { project, message: null });
  } catch (error) {
    const projects = await Project.find();
    res.status(500).render("view-project", {
      projects,
      message: `Error loading project: ${error.message}`,
      searchQuery: "",
    });
  }
});

router.post("/update/:id", upload.single("projectImg"), async (req, res) => {
  try {
    const { name, title, description, projectsUrl, projectCodeViewurl } = req.body;
    let project = await Project.findById(req.params.id);
    if (!project) {
      const projects = await Project.find();
      return res.status(404).render("view-project", {
        projects,
        message: "Project not found",
        searchQuery: "",
      });
    }
    if (!name || !title || !description || !projectsUrl || !projectCodeViewurl) {
      return res.status(400).render("edit-project", {
        project,
        message: "All fields are required, including Project URL and Code View URL",
      });
    }
    let projectImg = project.projectImg;
    if (req.file && req.file.path) {
      if (projectImg) {
        const publicId = projectImg.split('/').pop().split('.')[0];
        try {
          await cloudinary.uploader.destroy(`blogifyer_uploads/${publicId}`);
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      projectImg = req.file.path;
    }
    await Project.findByIdAndUpdate(req.params.id, {
      name,
      title,
      description,
      projectImg,
      projectsUrl,
      projectCodeViewurl,
    });
    res.redirect("/api/projects/view");
  } catch (error) {
    const project = await Project.findById(req.params.id);
    res.status(500).render("edit-project", {
      project,
      message: `Failed to update project: ${error.message}`,
    });
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const projects = await Project.find();
      return res.status(404).render("view-project", {
        projects,
        message: "Project not found",
        searchQuery: "",
      });
    }
    if (project.projectImg) {
      const publicId = project.projectImg.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`blogifyer_uploads/${publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }
    await Project.findByIdAndDelete(req.params.id);
    res.redirect("/api/projects/view");
  } catch (error) {
    const projects = await Project.find();
    res.status(500).render("view-project", {
      projects,
      message: `Failed to delete project: ${error.message}`,
      searchQuery: "",
    });
  }
});

module.exports = router;
