import cloudinary from "../config/cloudinary.js";
import { ResponseError } from "../error/response-error.js";
import User from "../models/User.js";

const updateProfile = async (req, res, next) => {
    try {
        const { image, ...otherData } = req.body;
        let updateData = otherData;
        console.table([updateData, req.user.id, req.body])

        // TODO: EXPLAIN THIS ONCE AGAIN IN THE UI PART
        if (image) {
            // base64 format
            if (image.starstWith("data:image")) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image);
                    updateData.image = uploadResponse.secure_url;
                } catch (error) {
                    console.log('error uploading image', error);
                    throw new ResponseError(400, "Error uploading image");
                }
            }
        }
        
        const updateUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
        res.status(200).json({
            user: updateUser
        });

    } catch (error) {
        console.log('error in updateProfile controller', error);
        next(error);
    }
}

export default {
    updateProfile
}