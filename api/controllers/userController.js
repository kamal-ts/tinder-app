import User from "../models/User.js";

const updateProfile = async (req, res, next) => {
    try {
        // Ambil data dari req.body
        let updatedData = req.body;

        // Tambahkan URL gambar jika ada file yang diunggah
        if (req.file) {
            updatedData.image = req.file.path;
        }

        // Perbarui data user di database
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

        res.status(200).json({
            user: updatedUser
        });
    } catch (error) {
        console.log('Error in updateProfile controller:', error);
        next(error);
    }
};

export default {
    updateProfile
}