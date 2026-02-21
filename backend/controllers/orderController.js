import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import razorpay from 'razorpay'
import dotenv from 'dotenv'
dotenv.config()

const currency = 'inr'
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// for User
export const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;
        const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }

        const newOrder = new Order(orderData)
        await newOrder.save()

        await User.findByIdAndUpdate(userId, { cartData: {} })

        return res.status(201).json({ message: 'Order Place' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Order Place error' })
    }
}

export const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.userId;
        const orderData = {
            items,
            amount,
            userId,
            address,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now()
        }

        const newOrder = new Order(orderData)
        await newOrder.save()

        // For Demo purposes, if you don't have active keys, 
        // you can return a mock order object if the real one fails
        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                // DEMO FALLBACK: If keys are missing/invalid, send a fake order ID back
                console.log("Razorpay Error (Using Demo Fallback):", error.description)
                return res.status(200).json({
                    id: "order_DEMO_" + newOrder._id,
                    amount: amount * 100,
                    currency: "INR",
                    receipt: newOrder._id
                })
            }
            res.status(200).json(order)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId
        const { razorpay_order_id, razorpay_signature } = req.body

        // --- DEMO BYPASS LOGIC ---
        // If the frontend sends our special demo signature, we skip Razorpay verification
        if (razorpay_signature === "demo_signature_bypass") {
            // We extract the original order ID from our mock ID (order_DEMO_XXXXX) 
            // or just use the receipt if you sent it.
            // Let's assume we find the latest unpaid order for this user:
            const latestOrder = await Order.findOne({ userId, paymentMethod: 'Razorpay', payment: false }).sort({ date: -1 });

            if (latestOrder) {
                await Order.findByIdAndUpdate(latestOrder._id, { payment: true });
                await User.findByIdAndUpdate(userId, { cartData: {} });
                return res.status(200).json({ success: true, message: 'Demo Payment Successful' });
            }
            return res.status(404).json({ message: "Order not found" });
        }

        // --- REAL RAZORPAY LOGIC (kept for when you want real payments) ---
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await User.findByIdAndUpdate(userId, { cartData: {} })
            res.status(200).json({ message: 'Payment Successful' })
        }
        else {
            res.json({ message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

export const userOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({ userId })
        return res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "userOrders error" })
    }
}

// for Admin
export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
        res.status(200).json(orders)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "adminAllOrders error" })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await Order.findByIdAndUpdate(orderId, { status })
        return res.status(201).json({ message: 'Status Updated' })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}