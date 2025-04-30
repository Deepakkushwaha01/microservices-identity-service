import mongoose from "mongoose";
import { userRole } from "../utils/enums/user-role.enum";
import { Models } from "../utils/enums/model.enums";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: Object.values(userRole),
        required: true,
        default: userRole.USER,
    },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });


const User = mongoose.model(Models.USER, userSchema);
export default User;