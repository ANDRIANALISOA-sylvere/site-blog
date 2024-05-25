import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

// Function to create a new post
export const create = async (req, res, next) => {
  // Check if the user is an admin
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'Unauthorized to create a post'));
  }
  // Check if all required fields are provided
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'All required fields must be provided'));
  }
  // Generate a URL-friendly slug from the title
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  // Create a new post object
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  // Save the new post to the database
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// Function to retrieve posts with pagination and sorting
export const getposts = async (req, res, next) => {
  try {
    // Parse query parameters for pagination and sorting
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    // Retrieve posts based on query filters
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Count total posts and posts from the last month
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Return the posts data
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

// Function to delete a post
export const deletepost = async (req, res, next) => {
  // Check if the user is authorized to delete the post
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'Unauthorized to delete this post'));
  }
  // Delete the post from the database
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('Post deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Function to update a post
export const updatepost = async (req, res, next) => {
  // Check if the user is authorized to update the post
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'Unauthorized to update this post'));
  }
  // Update the post in the database
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};