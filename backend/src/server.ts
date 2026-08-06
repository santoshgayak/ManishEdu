import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import contactRoutes from './routes/contact.routes.js';
import saveCustomerInfoRoutes from './routes/save-customer-info.routes.js';
import saveStudentInfoRoutes from './routes/save-student-info.routes.js';
import "dotenv/config";
import { MongoClient, Db } from "mongodb";
import  getDataRoutes  from './routes/data.routes.js';
import {connectDB} from './db/mongo.js';
import  loginRoutes from './routes/login.routes.js';
import getOrderRoutes from './routes/order.routes.js';
import getClassRoutes from './routes/class.routes.js';
import getProductRoutes from './routes/product.routes.js';
import getSaveClassRoutes from './routes/saveClass.routes.js'
import getDeleteClassRoutes from './routes/deleteClass.routes.js';
import getSaveProductRoutes from './routes/saveProduct.routes.js';
import getDeleteProductRoutes from './routes/deleteProduct.routes.js';
import { verifyToken } from "./middleware/auth.middleware.js";

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://localhost:4300',
    'http://localhost:62519',
    'https://manisheduserver.onrender.com',
    'https://manish-edu.vercel.app',
    'https://manish-edu-admin1.vercel.app',

  ],
  methods: ['GET', 'POST','PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


await connectDB();

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/save-customer-info', saveCustomerInfoRoutes);
app.use('/api/save-student-info', saveStudentInfoRoutes);
app.use('/api/data',getDataRoutes);
app.use('/api/login',loginRoutes);
app.use('/api/data/order',verifyToken,getOrderRoutes);
app.use('/api/data/class',verifyToken, getClassRoutes);
app.use('/api/data/product',verifyToken, getProductRoutes);
app.use('/api/save/class',verifyToken,getSaveClassRoutes);
app.use('/api/save/product',verifyToken,getSaveProductRoutes);
app.use('/api/delete/class',verifyToken,getDeleteClassRoutes);
app.use('/api/delete/product',verifyToken,getDeleteProductRoutes);


app.get('/health', (req, res) => {
  console.log("Health endpoint hit");
  res.json({ status: "OK", time: new Date() });
});
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Backend is running...'
  });
});

// Stripe setup (secured with env variable)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
});

const myDomain = 'http://localhost:4200';


app.post('/create-checkout-session', async (req, res) => {
    const {items}  = req.body;
  try {
    console.log("🔥 Create checkout session hit..daata",req.body);

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      mode: 'payment',

      line_items:items.map((item:any)=>({
        price:item.id,
        quantity: item.quantity || 1

      }))
      ,

      return_url: 'https://manish-edu.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
    });

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




app.post('/create-checkout-session1', async (req, res) => {
    const {id}  = req.body;

  try {

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded_page',
      mode: 'payment',

       line_items: [
        {
          price: id,
          quantity: 1
        }
      ],
      
      return_url: 'https://manish-edu-git-main-manish-edu.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
    });

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

app.get('/session-status', async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.session_id as string;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

        const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent as string,
        {
            expand: ['payment_method', 'latest_charge']
        }
        );

        const paymentMethod =
        paymentIntent.payment_method as Stripe.PaymentMethod;

        const charge =
        paymentIntent.latest_charge as Stripe.Charge;

        res.json({
        sessionId: session.id,

        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status,

        amount: paymentIntent.amount,
        currency: paymentIntent.currency,

        customerEmail: session.customer_details?.email,

        cardBrand: paymentMethod.card?.brand,
        cardLast4: paymentMethod.card?.last4,

        chargeId: charge.id,
        receiptUrl: charge.receipt_url
        });

  } catch (error) {
    console.error("Session fetch error:", error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});


// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Server running now !!');
});