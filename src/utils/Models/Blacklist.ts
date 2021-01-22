import { Schema, model } from "mongoose";

const Blacklist = new Schema({
    userID: {
        type: String,
        required: true
    }
});

export default model("Blacklist", Blacklist);
