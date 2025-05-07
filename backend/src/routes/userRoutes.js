console.log('✅ userRoutes.js has been loaded');
import express from 'express';
import {
    createUser,
    getUser,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.route('/')
    .get(getUser)
    .post(createUser)

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

export default router;

