import { Schema, model, Document } from "mongoose";

const Respect = new Schema({
    total: {
        type: Number,
        default: 0
    },
    guild: String
});

export interface RespectDoc extends Document {
    total: {
        type: number;
        default: 0;
    };
}

export default model<RespectDoc>("Respect", Respect);
