import PostSchema from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      user: req.userId,
      imageUrl: req.body.imageUrl,
    });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти статьи",
    });
  }
};

export const getAllByViews = async (req, res) => {
  try {
    const posts = await PostSchema.find()
      .sort({ viewsCount: -1 })
      .populate("user")
      .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти статьи",
    });
  }
};

export const getOne = (req, res) => {
  try {
    const postId = req.params.id;
    PostSchema.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Ошибка поиска статьи",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти статью",
    });
  }
};

export const remove = (req, res) => {
  try {
    const postId = req.params.id;
    PostSchema.findOneAndDelete({ _id: postId }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Ошибка удаления статьи",
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostSchema.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        user: req.userId,
        imageUrl: req.body.imageUrl,
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};

export const upload = (req, res) => {
  try {
    res.json({
      url: `../upload/${req.file.originalname}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось загрузить изображение",
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const posts = await PostSchema.find().limit(5).exec();
    const tags = posts
      .map((item) => item.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось загрузить теги",
    });
  }
};
