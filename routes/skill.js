
const { Router } = require("express");
const Skill = require("../models/Skills");
const upload = require("../middleware/multerConfig");
const path = require("path");
const fs = require("fs").promises;
const router = Router();

// Render all skills (normal view)
router.get("/view", async (req, res) => {
  const skills = await Skill.find();
  res.render("view-skill", { skills, message: null });
});

// Return all skills as JSON
router.get("/json", async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

router.get("/create", (req, res) => {
  res.render("edit-skill", { skill: {}, message: null });
});

router.post("/create", upload.single("projectImg"), async (req, res) => {
  try {
    const { skillName, description } = req.body;
    let projectImg = "";
    if (req.file) projectImg = `uploads/${req.file.filename}`;
    if (!skillName || !description) {
      return res.status(400).render("edit-skill", {
        skill: req.body,
        message: "All fields are required",
      });
    }
    await Skill.create({ skillName, description, projectImg });
    res.redirect("/api/skills/view");
  } catch (error) {
    res.status(500).render("edit-skill", { skill: req.body, message: error.message });
  }
});

router.get("/edit/:id", async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  res.render("edit-skill", { skill, message: null });
});

router.post("/update/:id", upload.single("projectImg"), async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    let projectImg = skill.projectImg;
    if (req.file) {
      if (projectImg) {
        try { await fs.unlink(path.join(__dirname, "../public", projectImg)); } catch {}
      }
      projectImg = `uploads/${req.file.filename}`;
    }
    await Skill.findByIdAndUpdate(req.params.id, {
      skillName: req.body.skillName,
      description: req.body.description,
      projectImg
    });
    res.redirect("/api/skills/view");
  } catch (error) {
    res.status(500).render("edit-skill", { skill: req.body, message: error.message });
  }
});

router.post("/delete/:id", async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (skill.projectImg) {
    try { await fs.unlink(path.join(__dirname, "../public", skill.projectImg)); } catch {}
  }
  await Skill.findByIdAndDelete(req.params.id);
  res.redirect("/api/skills/view");
});

module.exports = router;
