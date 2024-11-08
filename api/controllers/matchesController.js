import { ResponseError } from "../error/response-error.js";
import User from "../models/User.js";

const swipeRight = async (req, res, next) => {
    try {
        const { likedUserId } = req.params;
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likedUserId);

        if (!likedUser) {
            throw new ResponseError(404, "User not found");
        }

        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId);
            await currentUser.save();


            // if the other user already liked us, it's a match, so let's update both user
            if (likedUser.likes.includes(currentUser.id)) {
                currentUser.matches.push(likedUserId);
                likedUser.matches.push(currentUser.id);

                // save both of them
                await Promise.all([
                    await currentUser.save(), 
                    await likedUser.save()
                ])
            }

            // TODO SEND NOTIFICATION IF IT IS A MATCH => SOCKET.IO

        }

        res.status(200).json({
            user: currentUser
        })

    } catch (error) {
        next(error);
    }
}

const swipeLeft = async (req, res, next) => {
    try {
        const { dislikedUserId } = req.params;
        const currentUser = await User.findById(req.user.id);

        if (!currentUser.dislikes.includes(dislikedUserId)) {
            currentUser.dislikes.push(dislikedUserId);
            await currentUser.save();
        }

        res.status(200).json({
            user: currentUser
        })

    } catch (error) {
        next(error);
    }
}

const getMatches = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate("matches", "email image");
        res.status(200).json({
            data: user.matches
        });
    } catch (error) {
        next(error);
    }
}

const getUserProfiles = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user.id);

        /** Bagian ini melakukan pencarian di dalam koleksi User menggunakan beberapa kondisi pada operator $and, 
         *  sehingga semua kondisi harus terpenuhi. Kondisi ini memastikan pengguna yang ditemukan memenuhi kriteria berikut:
    
         *      - { _id: { $ne: currentUser.id } }: Menemukan pengguna lain yang tidak memiliki ID yang sama dengan 
         *        pengguna saat ini (currentUser). Dengan kata lain, ini menghindari menampilkan pengguna saat ini dalam hasil pencarian.
        
         *      - { _id: { $nin: currentUser.likes } }: Menemukan pengguna yang tidak ada dalam daftar likes dari currentUser. 
         *        Ini memastikan pengguna dalam hasil pencarian belum di-like oleh pengguna saat ini.
    
         *      - { _id: { $nin: currentUser.dislikes } }: Menemukan pengguna yang tidak ada dalam daftar dislikes dari currentUser. 
         *        Ini memastikan pengguna dalam hasil pencarian belum di-dislike oleh pengguna saat ini.
    
         *      - { _id: { $nin: currentUser.matches } }: Menemukan pengguna yang tidak ada dalam daftar matches dari currentUser. 
         *        Ini menghindari menampilkan pengguna yang sudah menjadi match dengan pengguna saat ini.
    
         *      - gender kriteria: Mencari pengguna dengan gender yang sesuai dengan preferensi gender pengguna saat ini.
         *        Jika preferensi gender pengguna saat ini adalah "both", maka hasilnya termasuk gender male dan female. 
         *        Jika preferensi gender tertentu (misalnya male atau female), hasil hanya akan mencakup gender yang sesuai.
    
         *      - {genderPreference: {$in: [currentUser.gender, "both"]}}: Memastikan bahwa pengguna yang ditemukan memiliki genderPreference 
         *        yang sesuai dengan gender currentUser atau terbuka untuk keduanya (both).
         */

        const users = await User.find({
            $and: [
                { _id: { $ne: currentUser.id } },
                { _id: { $nin: currentUser.likes } },
                { _id: { $nin: currentUser.dislikes } },
                { _id: { $nin: currentUser.matches } },
                {
                    gender: currentUser.genderPreference === "both"
                        ? { $in: ["male", "female"] }
                        : currentUser.genderPreference
                },
                { genderPreference: { $in: [currentUser.gender, "both"] } }

            ]
        })

        res.status(200).json({
            data: users
        })
    } catch (error) {
        next(error);
    }
}

export default {
    swipeLeft,
    swipeRight,
    getMatches,
    getUserProfiles
}