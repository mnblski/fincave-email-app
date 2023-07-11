require('dotenv').config()

const { FieldValue } = require("@google-cloud/firestore");
const express = require("express");
const { db } = require("../../lib/firebase/main");
const { fail, sendSuccess } = require("../../utils/res.utils");
const { verifyToken } = require("../../middleware/auth.middleware");
const { validate } = require("../../middleware/validation.middleware");
const { postUserSchema, putUserSchema } = require('./schemas');

const router = express.Router();

/** checks if the username is taken */
router.head("/:username", async (req, res, next) => {
    const { username } = req.params;

    /** also check prev usernames */
    db.collection('users')
    .where("username_lc", "==", username.toLowerCase())
    .get()
    .then((snapshot) => {
        if (!snapshot.empty) {
            fail("Username is taken", 401);
        }
        return sendSuccess(res)
    }).catch((err) => {
        next(err)
    })
})

router.get("/", verifyToken, async (req, res, next) => {
    db.collection("users").doc(req.uid)
    .get()
    .then((snapshot) => {
        if (!snapshot.exists) {
            fail("User not found", 401);
        }
        return sendSuccess(res, snapshot.data())
    })
    .catch((err) => {
        next(err)
    })
})

router.post("/", verifyToken, validate(postUserSchema), async (req, res, next) => {
    const { email, username } = req.body;

    const data = {
        username,
        username_lc: username.toLowerCase(),
        primary_email: email,
        fc_email: `${username.toLowerCase()}@${process.env.FC_EMAIL_DOMAIN}`,
        created_at: FieldValue.serverTimestamp(),
    }

    db.collection('users').doc(req.uid)
    .set(data)
    .then(() => {
        return sendSuccess(res)
    })
    .catch((err) => {
        next(err)
    });
})

router.patch("/", verifyToken, validate(putUserSchema), async (req, res, next) => {
    const { email, username, ...rest } = req.body;

    let data = {
        ...rest,
        updated_at: FieldValue.serverTimestamp()
    };
    if (username) {
        /**
         * store previously used in separete collection/table
         */
        data.username = username;
        data.username_lc = username.toLowerCase(),
        /** this below should be an array
         * what if user changes the username? what happens to the old email? will the mail be redirected to the new email?s 
         */
        data.fc_email = `${username.toLowerCase()}@${process.env.FC_EMAIL_DOMAIN}`;
    }
    if (email) {
       data.primary_email = email;
    }

    db.collection('users').doc(req.uid)
    .update(data)
    .then(() => {
        return sendSuccess(res)
    })
    .catch((err) => {
        next(err)
    })
})

router.delete("/", verifyToken, async (req, res, next) => {
    db.collection('users').doc(req.uid)
    .delete()
    .then(() => {
        return sendSuccess(res)
    })
    .catch((err) => {
        next(err)
    });
})

module.exports = router;