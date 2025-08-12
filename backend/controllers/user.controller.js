
import { User } from '../Models/user.model.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import registerSchema from '../lib/validator.js';
import { Resend } from "resend";
import dotenv from "dotenv";


dotenv.config();



const resend = new Resend(process.env.RESAND_KEY);




export const register = async (req, res) => {
    try {

        // ✅ Validate input
        const parsedData = registerSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.errors[0].message, // first error message
                success: false
            });
        }


        const { firstName, lastName, email, password } = parsedData.data
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "Someting is missing",
                success: false
            })

        }

        // const user = await User.findOne({ email })
        // if (user) {
        //     return res.status(400).json({
        //         message: "User already exist with this email.",
        //         success: false
        //     })
        // }

        const hashedPassword = await bcrypt.hash(password, 10);

        // const userdata = await User.create({
        //     firstName,
        //     lastName,
        //     email,
        //     password: hashedPassword,

        // })
        const userdata = true

        if (!userdata) {
            return res.status(401).json({
                message: "Some Error Occured While creating user",
                success: false
            })
        }

        const { data, error } = await resend.emails.send({
            from: "Acme <agnihotriaman36@gmail.com>",
            to: ["newcource77@gmail.com"],
            subject: "hello world",
            html: "<strong>it works!</strong>",
        });

        if (error) {
            return res.status(400).json({ error });
        }

        res.status(200).json({ data });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Someting is missing",
                success: false
            })
        }

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        }

        if (role != user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' })

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 1000 }, { httpsOnly: true }, { sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })

    } catch (error) {
        console.log(error)
    }


}


// During login our code first check the email or password than if both are correct than jwt generate a token using the payload like userId than it will pass the token to the client side using cookie for session management so user can access the protected routes and will remains login during hole session.

// Logout

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

// ProfileUpdate

// export const updateProfile = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, bio, skills } = req.body


//         let ResumeOriginalName = null;
//         let url = null
//         if (req.file) {
//             console.log("Not Avalilable")
//             url = req.file.path
//             ResumeOriginalName = req.file.originalname
//         }






//         let skillsArray = []
//         if (skills) {
//             skillsArray = skills.split(",")
//         }
//         // skills hamko string mai milege to ham use array mai convert kar dege
//         const userId = req.id
//         //  Yes, you can pass data from middleware to your route handler by attaching it to the req object. The req object is shared between middleware functions and the route handler in an Express.js application, so any data you attach to req in middleware will be available in the subsequent route handlers.
//         // middleware Authentication
//         let user = await User.findById(userId);

//         if (!user) {
//             return res.status(400).json({
//                 message: "User not found",
//                 success: false
//             })
//         }

//         // updating data

//         if (fullname) user.fullname = fullname
//         if (email) user.email = email
//         if (phoneNumber) user.phoneNumber = phoneNumber
//         if (skills) user.profile.skills = skillsArray
//         if (bio) user.profile.bio = bio
//         if (url) user.profile.resume = url
//         if (ResumeOriginalName) user.profile.resumeOriginalName = ResumeOriginalName

//         await user.save()

//         user = {
//             _id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         }

//         return res.status(200).json({
//             message: "Profile updated successfully",
//             user,
//             success: true
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }