import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import Stripe from "stripe";
import contactRoutes from "./routes/contact.routes.js";
import saveCustomerInfoRoutes from "./routes/save-customer-info.routes.js";
import saveStudentInfoRoutes from "./routes/save-student-info.routes.js";
import "dotenv/config";
import { MongoClient, Db } from "mongodb";
import getDataRoutes from "./routes/data.routes.js";
import { connectDB } from "./db/mongo.js";
import loginRoutes from "./routes/login.routes.js";
import getOrderRoutes from "./routes/order.routes.js";
import getClassRoutes from "./routes/class.routes.js";
import getProductRoutes from "./routes/product.routes.js";
import getSaveClassRoutes from "./routes/saveClass.routes.js";
import getDeleteClassRoutes from "./routes/deleteClass.routes.js";
import getSaveProductRoutes from "./routes/saveProduct.routes.js";
import getDeleteProductRoutes from "./routes/deleteProduct.routes.js";
import { verifyToken } from "./middleware/auth.middleware.js";
import { DataService } from "./services/data.service.js";
import { error } from "node:console";
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "http://localhost:4300",
      "http://localhost:62519",
      "https://manisheduserver.onrender.com",
      "https://manish-edu.vercel.app",
      "https://manish-edu-admin1.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/save-customer-info", saveCustomerInfoRoutes);
app.use("/api/save-student-info", saveStudentInfoRoutes);
app.use("/api/data", getDataRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/data/order", verifyToken, getOrderRoutes);
app.use("/api/data/class", verifyToken, getClassRoutes);
app.use("/api/data/product", verifyToken, getProductRoutes);
app.use("/api/save/class", verifyToken, getSaveClassRoutes);
app.use("/api/save/product", verifyToken, getSaveProductRoutes);
app.use("/api/delete/class", verifyToken, getDeleteClassRoutes);
app.use("/api/delete/product", verifyToken, getDeleteProductRoutes);

app.get("/health", (req, res) => {
  console.log("Health endpoint hit");
  res.json({ status: "OK", time: new Date() });
});
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Backend is running...",
  });
});

// Stripe setup (secured with env variable)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

const myDomain = "http://localhost:4200";

app.post("/create-checkout-session", async (req, res) => {
  const { items, customerId } = req.body;
  try {
    const orderPayload = {
      customerId,
      orderId: "",
      items: items.map((item: any) => ({
        itemId: item.id,
        itemName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      })),

      totalPrice: items.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0,
      ),
      type: "Product",
      paymentStatus: "Pending",
      stripeSessionId: "",
      createdAt: new Date(),
    };

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",

      line_items: items.map((item: any) => ({
        price: item.id,
        quantity: item.quantity || 1,
      })),

      return_url:
        "https://manish-edu.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
    });

    orderPayload.stripeSessionId = session.id;
    const dataService = new DataService();
    const result = await dataService.saveData("orders", orderPayload);

    if (!session.client_secret) {
      throw new Error("Missing client_secret from Stripe session");
    }
    res.json({
      clientSecret: session.client_secret,
    });
  } catch (error: any) {
    console.error("❌ Stripe session error:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});
app.post("/create-checkout-session1", async (req, res) => {
  const { id, customerId } = req.body;
  console.log("CUSTOMER ID IS ", customerId);
  const dataService = new DataService();
  const course = await dataService.getOne("courses", { id: id });
  console.log("COURSE IS :", course);
  if (!course) {
    return res.status(404).json({
      error: "Course not found",
    });
  }
  try {
    const orderPayload = {
      customerId,
      orderId: "",
      items: [
        {
          itemId: course.id,
          itemName: course.title,
          quantity: 1,
          unitPrice: course.price,
          totalPrice: course.price,
        },
      ],

      type: "Class",
      paymentStatus: "Pending",
      stripeSessionId: "",
      createdAt: new Date(),
    };

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",

      line_items: [
        {
          price: course.id,
          quantity: 1,
        },
      ],
      return_url:
        "https://manish-edu.vercel.app/success?session_id={CHECKOUT_SESSION_ID}",
    });

    orderPayload.stripeSessionId = session.id;

    const result = await dataService.saveData("orders", orderPayload);

    if (!session.client_secret) {
      throw new Error("Missing client_secret from Stripe session");
    }

    res.json({
      clientSecret: session.client_secret,
    });
  } catch (error: any) {
    console.error("❌ Stripe session error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET SESSION STATUS

app.get("/session-status", async (req: Request, res: Response) => {
  let newOrderId = "";
  try {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string,
      {
        expand: ["payment_method", "latest_charge"],
      },
    );
    const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod;
    const charge = paymentIntent.latest_charge as Stripe.Charge;

    const dataService = new DataService();

    console.log("💳 PAYMENT STATUS:", paymentIntent.status);

    if (paymentIntent.status === "succeeded") {
      newOrderId = await dataService.getNextOrderId();

      console.log("🆔 NEW ORDER ID:", newOrderId);

      const result = await dataService.updateOne(
        "orders",
        {
          stripeSessionId: sessionId,
        },
        {
          orderId: newOrderId,
          paymentStatus: "Paid",
          paidAt: new Date(),
        },
      );

      console.log("💾 ORDER UPDATED:", result);
    } else {
      console.log("❌ PAYMENT NOT SUCCESSFUL:", paymentIntent.status);
    }

    res.json({
      sessionId: session.id,
      orderId: newOrderId,
      paymentIntentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customerEmail: session.customer_details?.email,
      cardBrand: paymentMethod.card?.brand,
      cardLast4: paymentMethod.card?.last4,
      chargeId: charge.id,
      receiptUrl: charge.receipt_url,
    });
  } catch (error) {
    console.error("Session fetch error:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running now !!");
});
