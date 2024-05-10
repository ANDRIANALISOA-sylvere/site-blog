import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createClient, getclients,deleteclient } from '../controllers/client.controller.js';

const router = express.Router();

router.post('/createclient', verifyToken, createClient)
router.get('/getclients', getclients)
router.delete('/deleteclient/:clientId/:userId', verifyToken, deleteclient)
// router.put('/updateclient/:clientId/:userId', verifyToken, updateclient)


export default router;