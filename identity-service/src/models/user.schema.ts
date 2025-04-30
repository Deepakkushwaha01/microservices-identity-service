import mongoose from "mongoose";
import { userRole } from "../utils/enums/user-role.enum";

const userSchema = new mongoose.Schema({
    name: {
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
    },
    role: {
        type: String,
        enum: Object.values(userRole),
        required: true,
        default: userRole.USER,
    },
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;