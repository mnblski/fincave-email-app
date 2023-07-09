
const express = require("express");
const crypto = require("crypto");
const { fail } = require("assert");
const { sendSuccess } = require("../utils/res.utils");

    // 1. product look up - get product data with product ids (if not existing, create new product and return product ids);
    // 2. asset creation - use provided product ids and return asset ids;
    // 3. pass product ids and asset ids to order creation;
    // ** ORDER (all purchase details) -> ASSETS (single purchase data) -> PRODUCTS (single product data) **

const router = express.Router();

router.get("/test", async (req, res) => {
    res.send("Hello from orders router");
})

router.get("/", async (req, res, next) => {

    // get user id from middleware
    const uid = '1234567890';

    try {
        const subCollectionRef = db.collection("users").doc(uid).collection("orders");
        const snapshot = await subCollectionRef.get();

        if (!snapshot.exists) {
            fail("Orders for this user not found");
        }

        return sendSuccess(res, snapshot.docs.map(doc => doc.data()))
    } catch (err) {
        next(err)
    }
})

// get ONE order
router.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    // get user id from middleware
    const uid = '1234567890';

    try {
        const orderDocRef = db.collection("users").doc(uid).collection("orders").doc(id);
        const snapshot = await orderDocRef.get();

        if (!snapshot.exists) {
            fail("Order not found");
        }

        return sendSuccess(res, snapshot.data())
    } catch (err) {
        next(err)
    }
})

// post ONE order
router.post("/", async (req, res, next) => {
    // get user id from middleware
    const uid = '1234567890';

    // this should include all the data from the order + owner id, product ids and related asset ids etc.
    const orderData = req.body;
    const uuid = crypto.randomUUID();

    const data = {
        ...orderData,
        uuid,
        created_at: FieldValue.serverTimestamp()
    }      

    try {
        const ordersCollectionRef = db.collection("users").doc(uid).collection("orders");
        await ordersCollectionRef.set(data);
        return sendSuccess(res, { uuid })
    } catch (err) {
        next(err)
    }
})

// put ONE order
router.put("/:id", async (req, res, next) => {
    const { id } = req.params;
    const uid = '1234567890';

    // turn into a fn
    const changes = req.body;
    const data = { ...changes, updated_at: FieldValue.serverTimestamp()}      

    try {
        const orderDocRef = db.collection("users").doc(uid).collection("orders").doc(id);
        const snapshot = await orderDocRef.get();

        if (!snapshot.exists) {
            fail("Order not found");
        }

        await orderDocRef.set(data, { merge: true });
        return sendSuccess(res);
    } catch (err) {
        next(err)
    }
})

// delete ONE order
router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    const uid = '1234567890';

    try {
        const orderDocRef = db.collection("users").doc(uid).collection("orders").doc(id);
        const snapshot = await orderDocRef.get();

        if (!snapshot.exists) {
            fail("Order not found");
        }

        const deletedFlag = { 
            deleted: true,
            deleted_at: FieldValue.serverTimestamp()
         }

        await orderDocRef.set(deletedFlag, { merge: true });
        return sendSuccess(res);
    } catch (err) {
        next(err)
    }
})


module.exports = router;