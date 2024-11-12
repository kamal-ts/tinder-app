import cloudinary from "../config/cloudinary.js";
import { ResponseError } from "../error/response-error.js";
import User from "../models/User.js";

const updateProfile = async (req, res, next) => {
    try {
        const { image, ...otherData } = req.body;

        let updatedData = otherData;
        
        if (image) {
            // base64 format
            if (image.startsWith("data:image")) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image);
                    console.log("image data:", image);
                    console.log("uploadResponse:", uploadResponse);
                    updatedData.image = uploadResponse.secure_url;
                } catch (error) {
                    console.error("Error uploading image:", uploadError);
                    console.error(error) 
                    throw new ResponseError(400, "Error uploading image");
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

        res.status(200).json({
            user: updatedUser
        });

    } catch (error) {
        console.log('error in updateProfile controller', error);
        next(error);
    }
}

export default {
    updateProfile
}