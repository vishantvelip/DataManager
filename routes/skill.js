const { Router } = require("express");
const Skill = require("../models/Skills");
const cloudinary = require('cloudinary').v2;
const upload = require("../middleware/multerConfig");

const router = Router();

// Render all skills (normal view)
router.get("/view", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.render("view-skill", { skills, message: null });
  } catch (error) {
    res.status(500).render("view-skill", {
      skills: [],
      message: `Error loading skills: ${error.message}`,
    });
  }
});

// Return all skills as JSON
router.get("/json", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to load skills", error: error.message });
  }
});

// Create skill (form)
router.get("/create", (req, res) => {
  res.render("edit-skill", { skill: {}, message: null });
});

router.post("/create", upload.single("projectImg"), async (req, res) => {
  try {
    const { skillName, description } = req.body;
    if (!skillName || !description) {
      return res.status(400).render("edit-skill", {
        skill: req.body,
        message: "All fields are required",
      });
    }
    let projectImg = "";
    let publicId = "";
    if (req.file) {
      projectImg = req.file.path; // Cloudinary URL
      publicId = req.file.filename; // Cloudinary public_id
    }
    await Skill.create({ skillName, description, projectImg, publicId });
    res.redirect("/api/skills/view");
  } catch (error) {
    res.status(500).render("edit-skill", {
      skill: req.body,
      message: `Failed to create skill: ${error.message}`,
    });
  }
});

// Edit skill form
router.get("/edit/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).render("view-skill", {
        skills: [],
        message: "Skill not found",
      });
    }
    res.render("edit-skill", { skill, message: null });
  } catch (error) {
    res.status(500).render("view-skill", {
      skills: [],
      message: `Error loading skill: ${error.message}`,
    });
  }
});

// Update a skill
router.post("/update/:id", upload.single("projectImg"), async (req, res) => {
  try {
    const { skillName, description } = req.body;
    let skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).render("view-skill", {
        skills: [],
        message: "Skill not found",
      });
    }
    if (!skillName || !description) {
      return res.status(400).render("edit-skill", {
        skill,
        message: "All fields are required",
      });
    }
    let projectImg = skill.projectImg;
    let publicId = skill.publicId;
    if (req.file) {
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`portfolio_uploads/${publicId}`);
        } catch (err) {
          console.error("Error deleting old image from Cloudinary:", err);
        }
      }
      projectImg = req.file.path; // New Cloudinary URL
      publicId = req.file.filename; // New Cloudinary public_id
    }
    await Skill.findByIdAndUpdate(req.params.id, {
      skillName,
      description,
      projectImg,
      publicId,
    });
    res.redirect("/api/skills/view");
  } catch (error) {
    res.status(500).render("edit-skill", {
      skill: req.body,
      message: `Failed to update skill: ${error.message}`,
    });
  }
});

// Delete a skill
router.post("/delete/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).render("view-skill", {
        skills: [],
        message: "Skill not found",
      });
    }
    if (skill.publicId) {
      try {
        await cloudinary.uploader.destroy(`portfolio_uploads/${skill.publicId}`);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }
    await Skill.findByIdAndDelete(req.params.id);
    res.redirect("/api/skills/view");
  } catch (error) {
    res.status(500).render("view-skill", {
      skills: [],
      message: `Failed to delete skill: ${error.message}`,
    });
  }
});

module.exports = router;
