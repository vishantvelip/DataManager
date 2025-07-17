const { Router } = require("express");
const About = require("../models/about");
const router = Router();

// Render all about entries (normal view)
router.get("/view", async (req, res) => {
  try {
    const abouts = await About.find();
    res.render("view-about", { abouts, message: null });
  } catch (error) {
    res.status(500).render("view-about", { abouts: [], message: error.message });
  }
});

// About in JSON format
router.get("/json", async (req, res) => {
  try {
    const abouts = await About.find();
    res.json(abouts);
  } catch (error) {
    res.status(500).json({ message: "Failed to load abouts", error: error.message });
  }
});

router.get("/create", (req, res) => {
  res.render("edit-about", { about: {}, message: null });
});

router.post("/create", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).render("edit-about", { about: req.body, message: "About field is required" });
    }
    await About.create({ content });
    res.redirect("/api/about/view");
  } catch (error) {
    res.status(500).render("edit-about", { about: req.body, message: error.message });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    res.render("edit-about", { about, message: null });
  } catch (error) {
    res.status(500).render("edit-about", { about: {}, message: error.message });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    await About.findByIdAndUpdate(req.params.id, { content: req.body.content });
    res.redirect("/api/about/view");
  } catch (error) {
    res.status(500).render("edit-about", { about: req.body, message: error.message });
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id);
    res.redirect("/api/about/view");
  } catch (error) {
    res.status(500).render("view-about", { abouts: [], message: error.message });
  }
});

module.exports = router;
