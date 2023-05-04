const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
    {
        recipeName: {
            type: String,
            required: true
        },
        recipeImage: {
            url: String,
        },
        recipeCategory: {
            type: String,
            required: true
        },
        recipeIngredients: {
            type: [
                {
                    type: String,
                    required: true,
                }

            ],
            required: true
        },
        recipeDescription: {
            type: String,
            required: true
        },
        recipeInstruction: {
            type: [
                {
                    type: String,
                    required: true
                }
            ],
            required: true
        },
        recipeServes: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);