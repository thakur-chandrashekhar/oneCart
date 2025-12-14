import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../model/orderModel.js";
import User from "../model/userModel.js";

const currency = "INR";

// ✅ Razorpay instance (FIXED)
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =======================
// COD ORDER
// =======================
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    const newOrder = new Order({
      items,
      amount,
      address,
      userId: req.userId,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();
    await User.findByIdAndUpdate(req.userId, { cartData: {} });

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order Place error" });
  }
};

// =======================
// RAZORPAY ORDER CREATE
// =======================
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    const newOrder = new Order({
      items,
      amount,
      address,
      userId: req.userId,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency,
      receipt: newOrder._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// VERIFY RAZORPAY PAYMENT
// =======================
export const verifyRazorpay = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    await Order.findByIdAndUpdate(
      razorpay_order_id,
      { payment: true },
      { new: true }
    );

    await User.findByIdAndUpdate(req.userId, { cartData: {} });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// USER ORDERS
// =======================
export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "userOrders error" });
  }
};

// =======================
// ADMIN
// =======================
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "adminAllOrders error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.status(201).json({ message: "Status Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
