import { Router } from 'express';
import {
    saveUser,
    findFriends,
    searchUsers,
    deleteUser,
    updateUser,
    getAllUsers,
    fetchUserData,
    saveUserWithRepos
} from '../controllers/userController';

const router: Router = Router();

router.post('/users', saveUser);
router.get('/users/:username/friends', findFriends);
router.get('/users/search', searchUsers);
router.delete('/users/:username', deleteUser);
router.put('/users/:username', updateUser);
router.get('/users', getAllUsers);
router.get('/users/:username', fetchUserData);
router.post('/users/repo', saveUserWithRepos );



export default router;
