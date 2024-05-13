import Client from '../models/client.model.js';
import { errorHandler } from '../utils/error.js';
import slugify from 'slugify'


export const createClient = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a client'));
  }

  if (!req.body.name || !req.body.description || !req.body.birthday || !req.body.gender) {
    return next(errorHandler(400, 'Please provide all required client fields'));
  }

  const slug = req.body.name
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '')
  const newClient = new Client({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    next(error);
  }
};

export const getclients = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const clients = await Client.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.gender && { gender: req.query.gender }),
      ...(req.query.name && { name: req.query.name }),
      ...(req.query.chinesename && { chinesename: req.query.chinesename }),
      ...(req.query.birthday && { birthday: req.query.birthday }),
      ...(req.query.description && { description: req.query.description }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.clientId && { _id: req.query.clientId }),
      ...(req.query.searchClientTerm && {
        $or: [
          { name: { $regex: req.query.searchClientTerm, $options: 'i' } },
          { chinesename: { $regex: req.query.searchClientTerm, $options: 'i' } },
          { gender: { $regex: req.query.searchClientTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalClients = await Client.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthClients = await Client.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      clients,
      totalClients,
      lastMonthClients,
    });
  } catch (error) {
    next(error);
  }
  // res.send("get clients")
};

export const deleteclient = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this client'));
  }
  try {
    await Client.findByIdAndDelete(req.params.clientId);
    res.status(200).json('The client has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updateclient = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this client'));
  }
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.clientId,
      {
        $set: {
          name: req.body.name,
          chinesename:req.body.chinesename,
          birthday: req.body.birthday,
          gender: req.body.gender,
          description:req.body.description,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (error) {
    next(error);
  }
};