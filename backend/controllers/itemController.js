import Item from "../models/Item.js";


export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    const updatedItems = items.map((item) => {
      const discount = item.discount || 0; // safe fallback

      const finalPrice =
        item.price - (item.price * discount) / 100;

      return {
        ...item._doc,
        finalPrice,
      };
    });

    res.status(200).json(updatedItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};


export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const discount = item.discount || 0;

    const finalPrice =
      item.price - (item.price * discount) / 100;

    res.status(200).json({
      ...item._doc,
      finalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item" });
  }
};


export const createItem = async (req, res) => {
  try {
    const newItem = await Item.create({
      ...req.body,
      discount: req.body.discount || 0, // safety fix
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
};


export const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        discount: req.body.discount || 0, // safety fix
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
};


export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};