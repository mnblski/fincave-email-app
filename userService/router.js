require('dotenv').config()

const express = require("express");
const crypto = require("crypto");

const { db } = require("../firebaseService/init");
const { fail, sendSuccess } = require("../utils/res.utils");
const { validate } = require("../middleware/validation.middleware");
const { userPatchSchema, userPostSchema } = require('./schemas');
// const {authMiddleware} = require("../middleware/auth.middleware");

/** ? should this atually delete data or mark as DELETED */
/** ? should I always do READ and get the snapshot to check if exists? */

const router = express.Router();

router.get("/test", async (req, res) => {
    res.send("Hello from user router");
})

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const snapshot = await db.collection("users").doc(id).get();

        if (!snapshot.exists) {
            fail("User not found");
        }

        return sendSuccess(res, snapshot.data())
    } catch (err) {
        next(err)
    }
})

router.post("/", validate(userPostSchema), async (req, res, next) => {
    const { username, password, emailSync } = req.body;
    const uuid = crypto.randomUUID();
    const docRef = db.collection('users').doc(uuid);

    const userData = {
        username,
        password,
        uuid,
        created: FieldValue.serverTimestamp(),
        // email_sync: emailSync, // false or  e.g. ['gmail', 'outlook'],
        // first_name: null,
        // last_name: null,
        // dob: null,
        // is_business: false,
        // sso, // false or  e.g. ['google', 'microsoft'],
        // product,
        // settings,
        // recomendation_tags,
        // features,
        // assets,
        // orders
    }

    try {
        await docRef.set(userData);
        return sendSuccess(res, { uuid })
    } catch (err) {
        next(err)
    }
})

router.patch("/:id", validate(userPatchSchema), async (req, res, next) => {
    const { id } = req.params;

    try {
        const docRef = db.collection("users").doc(id);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            fail("User not found");
        }

        const { changes } = req.body;

        try {
            const updatedUser = await docRef.ref.update({
                ...changes,
                updated: FieldValue.serverTimestamp()
            });

            return sendSuccess(res, updatedUser)
        } catch (err) {
            fail("Error updating the user");
        }
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
        const docRef = db.collection("users").doc(id);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            fail("User not found");
        }
        
        try {
            await docRef.delete();
            return sendSuccess(res)

        } catch (err) {
            fail("Error deleting the user");
        }
    } catch (err) {
        next(err)
    }
})

module.exports = router;