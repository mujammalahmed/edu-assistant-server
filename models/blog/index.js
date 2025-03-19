const { model, Schema, mongoose } = require("mongoose");
const slugify = require("slugify");

const blogSchema = new Schema(
  {
    blog_title: {
      type: String,
      required: true,
    },
    blog_slug: {
      type: String,
      required: false,
      unique: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
    },
    total_views: {
      type: Number,
      default: 0,
    },
    blog_description: {
      type: String,
      required: true,
    },
    featured_image: {
      type: String,
      required: false,
    },
    blog_likes: {
      type: Number,
    },
    like_users: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        isLike: {
          type: Boolean,
          default: false,
        },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

blogSchema.pre("save", function (next) {
  const currentDate = new Date().toISOString().slice(0, 10);
  const uniqueIdentifier = Date.now();
  this.blog_slug =
    slugify(this.blog_title, {
      lower: true,
      remove: /[*+~.()'"!?:@]/g,
    }) +
    "-" +
    currentDate +
    "-" +
    uniqueIdentifier;
  next();
});

blogSchema.index({ blog_slug: 1 }, { unique: true });

module.exports = model("Blog", blogSchema);
