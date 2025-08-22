"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDownloadsForSession = exports.createPlanCheckoutSession = exports.createCheckoutSession = void 0;
const GrowthPlan_1 = __importDefault(require("../models/GrowthPlan"));
const stripe_1 = __importDefault(require("stripe"));
const models_1 = require("../models");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = req.body;
        console.log('Received checkout items:', items);
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'No items in cart.' });
        }
        // Fetch product details from DB
        const productIds = items.map((item) => item.productId);
        console.log('Looking up productIds:', productIds);
        const products = yield models_1.Product.find({ _id: { $in: productIds } });
        console.log('Products found in DB:', products.map((p) => p._id.toString()));
        if (products.length !== items.length) {
            const foundIds = products.map((p) => p._id.toString());
            const missing = productIds.filter((id) => !foundIds.includes(id));
            console.error('Some products not found. Missing IDs:', missing);
            // Fallback: treat as free if any product is missing
            return res.json({ free: true, downloadUrl: `/download?session_id=free-missing-${Date.now()}` });
        }
        // Calculate total
        const lineItems = products.map((product) => {
            const cartItem = items.find((i) => i.productId === String(product._id));
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: cartItem.quantity,
            };
        });
        // Log all product prices for debugging
        console.log('Cart items:', items);
        console.log('Product prices:', products.map((p) => ({ id: p._id, price: p.price })));
        // If ANY product is free or price < 50, skip Stripe for the whole cart (to avoid Stripe error)
        const anyFreeOrLow = products.some((p) => {
            let price = p.price;
            if (typeof price === 'string')
                price = parseFloat(price);
            if (typeof price !== 'number' || isNaN(price))
                price = 0;
            return price < 50;
        });
        if (anyFreeOrLow || products.length === 0) {
            console.log('Skipping Stripe: at least one product is free, price < 50, or products array is empty');
            // Generate a download URL (simulate)
            return res.json({ free: true, downloadUrl: `/download?session_id=free-${Date.now()}` });
        }
        // Create Stripe session
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/download?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cart?cancelled=1`,
            metadata: {
                productIds: productIds.join(','),
            },
        });
        res.json({ id: session.id });
    }
    catch (err) {
        console.error('Stripe checkout error:', err);
        res.status(500).json({ error: 'Failed to create checkout session.', details: err && err.message ? err.message : err });
    }
});
exports.createCheckoutSession = createCheckoutSession;
const createPlanCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { planId } = req.body;
        if (!planId) {
            console.error('[Plan Checkout] Missing planId in request body:', req.body);
            return res.status(400).json({ error: 'Missing planId in request body.' });
        }
        const plan = yield GrowthPlan_1.default.findOne({ id: planId });
        if (!plan) {
            console.error(`[Plan Checkout] No plan found for planId: ${planId}`);
            return res.status(404).json({ error: 'Plan not found' });
        }
        if (!plan.stripeProductId || !plan.price) {
            console.error(`[Plan Checkout] Plan missing stripeProductId or price:`, plan);
            return res.status(500).json({ error: 'Plan is missing Stripe product ID or price.' });
        }
        try {
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product: plan.stripeProductId,
                            unit_amount: plan.price,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT_URL}/plans`,
            });
            res.json({ url: session.url });
        }
        catch (stripeErr) {
            const details = typeof stripeErr === 'object' && stripeErr !== null && 'message' in stripeErr
                ? stripeErr.message
                : JSON.stringify(stripeErr);
            console.error('[Plan Checkout] Stripe error:', stripeErr);
            res.status(500).json({ error: 'Failed to create Stripe session', details });
        }
    }
    catch (err) {
        const details = typeof err === 'object' && err !== null && 'message' in err
            ? err.message
            : JSON.stringify(err);
        console.error('[Plan Checkout] Unexpected error:', err);
        res.status(500).json({ error: 'Unexpected error in plan checkout', details });
    }
});
exports.createPlanCheckoutSession = createPlanCheckoutSession;
const getDownloadsForSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { sessionId } = req.params;
        console.log('[DOWNLOAD] sessionId:', sessionId);
        if (!sessionId)
            return res.status(400).json({ error: 'Missing sessionId' });
        if (sessionId.startsWith('free-')) {
            // Simulate free download
            return res.json({
                success: true,
                files: [
                    // Example static file URLs
                    '/files/sample1.pdf',
                    '/files/sample2.pdf',
                ],
            });
        }
        // Fetch session from Stripe
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        console.log('[DOWNLOAD] Stripe session:', session);
        if (!session || session.payment_status !== 'paid') {
            console.log('[DOWNLOAD] Payment not completed or session missing');
            return res.status(403).json({ error: 'Payment not completed.' });
        }
        // Get product IDs from metadata
        const productIds = ((_b = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.productIds) === null || _b === void 0 ? void 0 : _b.split(',')) || [];
        console.log('[DOWNLOAD] productIds:', productIds);
        // Fetch product files from DB (real file URLs, single file per product)
        const products = yield models_1.Product.find({ _id: { $in: productIds } });
        console.log('[DOWNLOAD] products:', products);
        // For each product, get the first file's URL if available
        // product.files is an array of file paths/URLs (strings)
        const files = products.map((product) => {
            console.log('[DOWNLOAD] product.files:', product.files);
            if (product.files && Array.isArray(product.files) && product.files.length > 0) {
                return product.files[0];
            }
            return null;
        }).filter(Boolean);
        console.log('[DOWNLOAD] files to return:', files);
        if (!files || files.length === 0) {
            console.log('[DOWNLOAD] No files found for these products');
            return res.status(404).json({ success: false, error: 'No files available for download for these products.' });
        }
        res.json({ success: true, files });
    }
    catch (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to fetch downloads.' });
    }
});
exports.getDownloadsForSession = getDownloadsForSession;
