const Review = require('../models/Review');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { userId, serviceId, rating, comment } = req.body;
    const review = await Review.create({ userId, serviceId, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a specific service
exports.getReviewsByService = async (req, res) => {
  try {
    const reviews = await Review.findByService(req.params.serviceId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    const { rating, comment } = req.body;
    const updatedReview = await Review.update(req.params.id, { rating, comment });
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    await Review.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};