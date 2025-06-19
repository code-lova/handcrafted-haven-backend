import createHttpError from "http-errors";
import orderService from "../services/orderService.js";
import userService from "../services/userService.js";
import storyService from "../services/storyService.js";
import stripe from "../utils/stripe.js";

const createOrder = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(createHttpError(401, "Unauthorized: No user info"));
    }
    const buyerId = req.user.id;
    const user = await userService.findUserById(buyerId);
    if (!user) return next(createHttpError(404, "User not found"));

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(createHttpError(400, "At least one item is required"));
    }

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const story = await storyService.getStoryById(item.storyId);

      if (!story) {
        return next(createHttpError(404, `Story not found: ${item.storyId}`));
      }

      const price = story.price; // Ensure backend price is used
      const quantity = item.quantity;

      if (quantity < 1) {
        return next(createHttpError(400, "Quantity must be at least 1"));
      }

      totalAmount += price * quantity;

      validatedItems.push({
        storyId: story._id,
        name: story.name,
        price,
        quantity,
      });
    }

    const orderData = {
      buyerId,
      items: validatedItems,
      totalAmount,
      phone: user.phone,
      address: user.address,
    };

    const order = await orderService.createOrder(orderData);

    if (!order) {
      return next(createHttpError(500, "Failed to create new order"));
    }

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    next(err);
  }
};

//For Stripe payment
const createStripeCheckoutSession = async (req, res, next) => {
  try {
    const buyerId = req.user?.id;
    const user = await userService.findUserById(buyerId);
    if (!user) return next(createHttpError(404, "User not found"));

    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return next(createHttpError(400, "Cart cannot be empty"));
    }

    const line_items = [];
    let totalAmount = 0;

    for (const item of items) {
      const story = await storyService.getStoryById(item.storyId);
      if (!story) {
        return next(createHttpError(404, `Story not found: ${item.storyId}`));
      }

      const price = story.price;
      const quantity = item.quantity;
      if (quantity < 1) {
        return next(createHttpError(400, "Quantity must be at least 1"));
      }

      totalAmount += price * quantity;

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: story.name,
          },
          unit_amount: price * 100, // Stripe uses cents
        },
        quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      metadata: {
        buyerId: buyerId,
        phone: user.phone || "",
        address: user.address || "",
        totalAmount,
        items: JSON.stringify(items), // ⚠️ Store raw cart for later
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// Create order with stripe session id
const handleStripeSuccess = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return next(createHttpError(400, "Missing session ID"));
    }

    // Fetch session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    if (!session || session.payment_status !== "paid") {
      return next(createHttpError(400, "Payment not completed"));
    }

    // Extract buyer ID and order info from session metadata
    // (You need to pass buyerId and items in metadata during Stripe session creation)
    const buyerId = session.metadata?.buyerId;
    if (!buyerId) {
      return next(createHttpError(400, "Missing buyer ID in session metadata"));
    }

    // Find buyer info in DB
    const user = await userService.findUserById(buyerId);
    if (!user) {
      return next(createHttpError(404, "Buyer user not found"));
    }

    // Parse items from metadata JSON string (you must stringify items when creating Stripe session)
    let rawItems;
    try {
      rawItems = JSON.parse(session.metadata.items); // Only has storyId and quantity
    } catch (err) {
      //console.error("Failed to parse items from metadata:", session.metadata.items);
      return next(createHttpError(400, "Invalid items data in session metadata", err));
    }

    // Enrich with story data
    const items = [];
    for (const rawItem of rawItems) {
      const story = await storyService.getStoryById(rawItem.storyId);
      if (!story) {
        return next(createHttpError(404, `Story not found for item: ${rawItem.storyId}`));
      }

      items.push({
        storyId: rawItem.storyId,
        name: story.name,
        price: story.price,
        quantity: rawItem.quantity,
      });
    }

    // Calculate totalAmount from line items or from metadata (your choice)
    const totalAmount = session.amount_total / 100; // Stripe amount is in cents

    // Prepare order data
    const orderData = {
      buyerId,
      items,
      totalAmount,
      phone: user.phone,
      address: user.address,
      status: "confirmed",
      paymentStatus: "paid",
      paymentIntentId: session.payment_intent,
    };

    // Save order in DB
    const order = await orderService.createOrder(orderData);

    if (!order) {
      return next(createHttpError(500, "Failed to create order"));
    }

    return res.status(201).json({ message: "Order saved successfully", order });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(createHttpError(401, "Unauthorized: No user info"));
    }
    const buyerId = req.user.id;
  
    const orders = await orderService.getOrdersByUser(buyerId);
    if (!orders || orders.length === 0) {
      return next(createHttpError(404, "No orders found for this user"));
    }
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const updated = await orderService.updateOrder(req.params.id, req.body);
    if (!updated) {
      return next(createHttpError(404, "Order not found"));
    }
    res.status(200).json({ message: "Order updated successfully", updated });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderService.deleteOrder(req.params.id);
    if (!deleted) {
      return next(createHttpError(404, "Order not found"));
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  createStripeCheckoutSession,
  handleStripeSuccess,
};
