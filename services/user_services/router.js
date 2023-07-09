require('dotenv').config()

const { FieldValue } = require("@google-cloud/firestore");
const express = require("express");
const { db } = require("../../lib/firebase/main");
const { fail, sendSuccess } = require("../../utils/res.utils");
const { verifyToken } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validation.middleware");
const { postUserSchema } = require('./schemas');

const router = express.Router();

/** checks if the username is taken */
router.head("/:username", async (req, res, next) => {
    try {
        const { username } = req.params;
        const collectionRef = db.collection('users');
        const snapshot = await collectionRef.where("username_lc", "==", username.toLowerCase()).get();
        if (!snapshot.empty) {
            console.log('test');
            fail("Username is taken", 401);
        }
        return sendSuccess(res)
    } catch (err) {
        console.log('err', err);
        next(err)
    }
})

router.get("/:uid", verifyToken, async (req, res, next) => {
    try {
        const { uid } = req.params;
        const snapshot = await db.collection("users").doc(uid).get();
        if (!snapshot.exists) {
            fail("User not found", 401);
        }
        return sendSuccess(res, snapshot.data())
    } catch (err) {
        next(err)
    }
})

router.post("/", verifyToken, validate(postUserSchema), async (req, res, next) => {
    const { email, username } = req.body;
    const docRef = db.collection('users').doc(req.uid);
    const userData = {
        username,
        username_lc: username.toLowerCase(),
        primary_email: email,
        created: FieldValue.serverTimestamp(),
    }
    try {
        await docRef.set(userData);
        return sendSuccess(res, userData)
    } catch (err) {
        next(err)
    }
})

// router.get("/health", verifyToken, async (req, res) => {
//     console.log('health check request:', req);
//     return sendSuccess(res, { message: "User service is healthy" })
// })

// router.patch("/:id", validate(userPatchSchema), async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         const docRef = db.collection("users").doc(id);
//         const snapshot = await docRef.get();

//         if (!snapshot.exists) {
//             fail("User not found");
//         }

//         const { changes } = req.body;

//         try {
//             const updatedUser = await docRef.ref.update({
//                 ...changes,
//                 updated: FieldValue.serverTimestamp()
//             });

//             return sendSuccess(res, updatedUser)
//         } catch (err) {
//             fail("Error updating the user");
//         }
//     } catch (err) {
//         next(err)
//     }
// })

// router.delete("/:id", async (req, res, next) => {
//     const { id } = req.params;

//     try {
//         const docRef = db.collection("users").doc(id);
//         const snapshot = await docRef.get();

//         if (!snapshot.exists) {
//             fail("User not found");
//         }
        
//         try {
//             await docRef.delete();
//             return sendSuccess(res)

//         } catch (err) {
//             fail("Error deleting the user");
//         }
//     } catch (err) {
//         next(err)
//     }
// })

module.exports = router;