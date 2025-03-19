// const express = require("express");
// const Item = require("../models/Item");
// const upload = require("../middleware/upload");
// const router = express.Router();

// // Post Auction Item (POST /items)
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const { itemname, itemprice, auctionstatus, userwhouploded, description, endDate } = req.body;
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

//     const newItem = new Item({
//       itemname,
//       itemprice,
//       bidprice: 0, // Default bid price is 0
//       auctionstatus,
//       userwhouploded,
//       description,
//       imageUrl,
//       endDate,  // 🟢 Save auction end date/time
//     });

//     await newItem.save();
//     res.status(201).json({ message: "Item posted successfully", item: newItem });
//   } catch (err) {
//     console.error("Error posting item:", err.message);
//     res.status(400).json({ error: "Error posting item" });
//   }
// });

// // Get Open Auction Items (GET /items/open)
// router.get("/open", async (req, res) => {
//   try {
//     const now = new Date();
//     const openItems = await Item.find({
//       auctionstatus: "open",
//       endDate: { $gt: now }, // 🟢 Only items that haven't expired
//     });
//     res.json(openItems);
//   } catch (err) {
//     console.error("Error fetching open auction items:", err.message);
//     res.status(400).json({ error: "Error fetching open auction items" });
//   }
// });

// // Update Auction Item (PUT /items/:id)
// router.put("/:id", async (req, res) => {
//   try {
//     const { auctionstatus, bidprice, userwhobuyed } = req.body;
    
//     const updatedItem = await Item.findByIdAndUpdate(
//       req.params.id,
//       { auctionstatus, bidprice, userwhobuyed },
//       { new: true }
//     );

//     if (!updatedItem) {
//       return res.status(404).json({ error: "Item not found" });
//     }

//     res.json(updatedItem);
//   } catch (err) {
//     console.error("Error updating item:", err.message);
//     res.status(400).json({ error: "Error updating item" });
//   }
// });

// // Get Auction Items by Buyer (GET /items/bought/:userId)
// router.get("/bought/:userId", async (req, res) => {
//   try {
//     const items = await Item.find({ userwhobuyed: req.params.userId });
//     res.json(items);
//   } catch (err) {
//     console.error("Error fetching bought items:", err.message);
//     res.status(400).json({ error: "Error fetching items" });
//   }
// });

// // Get Auction Items by Uploader (GET /items/uploaded/:userId)
// router.get("/uploaded/:userId", async (req, res) => {
//   try {
//     const items = await Item.find({ userwhouploded: req.params.userId });
//     res.json(items);
//   } catch (err) {
//     console.error("Error fetching uploaded items:", err.message);
//     res.status(400).json({ error: "Error fetching items" });
//   }
// });

// // 🟢 Optional: Route to mark expired items as sold (can be called manually or via cron)
// router.put("/expire/check", async (req, res) => {
//   try {
//     const now = new Date();
//     const result = await Item.updateMany(
//       { endDate: { $lt: now }, auctionstatus: "open" },
//       { $set: { auctionstatus: "sold" } }
//     );
//     res.json({ message: "Expired items updated", result });
//   } catch (err) {
//     console.error("Error expiring items:", err.message);
//     res.status(400).json({ error: "Error expiring items" });
//   }
// });

// module.exports = router;
const express = require("express");
const Item = require("../models/Item");
const upload = require("../middleware/upload");
const router = express.Router();

// Post Auction Item (POST /items)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { itemname, itemprice, auctionstatus, userwhouploded, description, auctioneddate } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newItem = new Item({
      itemname,
      itemprice,
      bidprice: 0,
      auctionstatus,
      userwhouploded,
      description,
      auctioneddate,
      imageUrl,
    });

    await newItem.save();
    res.status(201).json({ message: "Item posted successfully", item: newItem });
  } catch (err) {
    console.error("Error posting item:", err.message);
    res.status(400).json({ error: "Error posting item" });
  }
});

// Get Open Auction Items
router.get("/open", async (req, res) => {
  try {
    const openItems = await Item.find({ auctionstatus: "open" });
    res.json(openItems);
  } catch (err) {
    console.error("Error fetching open auction items:", err.message);
    res.status(400).json({ error: "Error fetching open auction items" });
  }
});

// Update Auction Item (PUT /items/:id)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    console.error("Error updating item:", err.message);
    res.status(400).json({ error: "Error updating item" });
  }
});

// Delete Auction Item (DELETE /items/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err.message);
    res.status(400).json({ error: "Error deleting item" });
  }
});

// Buyer & Seller specific routes (already in your code)
router.get("/bought/:userId", async (req, res) => {
  try {
    const items = await Item.find({ userwhobuyed: req.params.userId });
    res.json(items);
  } catch (err) {
    console.error("Error fetching bought items:", err.message);
    res.status(400).json({ error: "Error fetching items" });
  }
});

router.get("/uploaded/:userId", async (req, res) => {
  try {
    const items = await Item.find({ userwhouploded: req.params.userId });
    res.json(items);
  } catch (err) {
    console.error("Error fetching uploaded items:", err.message);
    res.status(400).json({ error: "Error fetching items" });
  }
});

module.exports = router;
