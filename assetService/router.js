// ? Asset is an entity of a single purchased item
// ? It includes its order details, current status, and purchased product information

const express = require("express");
const crypto = require("crypto");
const { fail } = require("assert");

const router = express.Router();

router.get("/test", async (req, res) => {
    res.send("Hello from asset router");
})

router.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
        const snapshot = await db.collection("assets").doc(id).get();

        if (!snapshot.exists) {
            fail("Asset not found");
        }

        return sendSuccess(res, snapshot.data())
    } catch (err) {
        next(err)
    }
})

router.get("/:uid", async (req, res, next) => {
    const { uid } = req.params;

    try {
        const subCollectionRef = db.collection("users").doc(uid).collection("assets");
        const snapshot = await subCollectionRef.get();

        if (!snapshot.exists) {
            fail("Assets for this user not found");
        }

        return sendSuccess(res, snapshot.docs.map(doc => doc.data()))
    } catch (err) {
        next(err)
    }
})

router.post("/:uid", async (req, res, next) => {
    const { uid } = req.params;
    const data = req.body;
    const uuid = crypto.randomUUID();

    try {
        const subCollectionRef = db.collection("users").doc(uid).collection("assets");
        const snapshot = await subCollectionRef.doc(uuid).set({
            ...data,
            uuid,
            created: FieldValue.serverTimestamp(),
        });

        return sendSuccess(res, snapshot.data())
    } catch (err) {
        next(err)
    }
})

router.post("/:userId", async (req, res) => {
    const { userId } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items)) {
        fail('Wrong body format')
    }

    const subCollectionRef = db.collection("users").doc(userId).collection("assets");

    // get new write batch
    const batch = db.batch();

    // add each item from the body to a batch - ref document, and batch set opration
    // you can mix set, update and delete
    for (const item of items) {
        const uuid = crypto.randomUUID();
        const docRef = subCollectionRef.doc(uuid)

        const data = {
            uuid,
            created_at: FieldValue.serverTimestamp(),
        }

        batch.set(docRef, data, { merge: true })
    }

    // commit batch
    try {
        await batch.commit();
        return sendSuccess(res, batch.docs.map(doc => doc.data()))

    } catch (error) {
        return res.sendStatus(404);

    }
})

router.patch("/test", async (req, res) => {
    res.send("Hello from user router");
})

router.patch("/test", async (req, res) => {
    res.send("Hello from user router");
})

router.delete("/test", async (req, res) => {
    res.send("Hello from user router");
})

router.delete("/test", async (req, res) => {
    res.send("Hello from user router");
})