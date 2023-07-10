const Cart = require("../models/cart");

module.exports.addtocart = async (req, res) => {
  try {
    // Fetching user details after it being passed through the middlare
    const userId = req.user._id
    const itemsArray = req.body.items
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ userId, items: {} });
    }

    // Update the cart items
    const { items } = cart;
    for (const item of itemsArray) {
      const { productId, quantity } = item;
      if (items.hasOwnProperty(productId)) {
        items[productId] += quantity;
      } else {
        items[productId] = quantity;
      }
    }
   cart.markModified('items');
    await cart.save();
    return res.status(200).json({message:"Items Added Successfully",Current_Cart : cart.items })
    
  } catch (err) {
    console.log("Error Occured ", err);
    res.status(404).json({ message: "Server Error Occured" });
  }
};

module.exports.fetchcart = async (req, res) => {
  try {
    // Tracking id of the user whose cart has to be fetched
    const userId = req.user._id;
    // Finding the cart associated with the user
    const result = await Cart.findOne({ userId });
    if (!result) {
      // If there is no cart associated with account
      return res
        .status(200)
        .json({ message: "This user has no items in his cart" });
    } else {
      // If cart is associated,return it
      return res
        .status(200)
        .json({
          message: "Cart Items Fetched successfully",
          cart: result.items,
        });
    }
  } catch (err) {
    // In case an error occurs
    console.log(err)
    return res.status(400).json({ message: "Server Error Occured" });
  }
};