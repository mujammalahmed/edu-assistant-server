const { model, Schema } = require("mongoose");

const commentSchema = new Schema(
  {
    commenter: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment_body: {
      type: String,
      required: true,
    },
    comment_likes: {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Comment", commentSchema);
