const mongoose = require("mongoose");

const recipeCommentSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        recipeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe"
        },
        comment: {
            type: [String],
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("RecipeComment",recipeCommentSchema);
