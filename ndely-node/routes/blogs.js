const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Blog, validate } = require("../models/blog");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

function createSlug(s) {
  const timeStamp = Date.now().toString();
  return `${timeStamp}-${s}`;
}
const upload = multer({ storage: storage }).single("images");

router.get("/", async (req, res) => {
  const blogs = await Blog.find().select("-__v");
  res.send(blogs);
});

router.post("/", [auth, admin, upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let blog = new Blog({
    title: req.body.title,
    slug: createSlug(req.body.title.split(" ").join("-")),
    content: req.body.content,
    images: req.file.filename,
  });
  await blog.save();

  res.send(blog);
});

router.put(
  "/:id",
  [auth, admin, validateObjectId, upload],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        slug: createSlug(req.body.title.split(" ").join("-")),
        content: req.body.content,
        images: req.file.filename,
      },
      {
        new: true,
      }
    );

    if (!blog)
      return res.status(404).send("The blog with the given ID was not found.");

    res.send(blog);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const blog = await Blog.findByIdAndRemove(req.params.id);

  if (!blog)
    return res.status(404).send("The blog with the given ID was not found.");

  res.send(blog);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const blog = await Blog.findById(req.params.id).select("-__v");

  if (!blog)
    return res.status(404).send("The blog with the given ID was not found.");

  res.send(blog);
});

module.exports = router;
