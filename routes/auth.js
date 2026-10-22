import expresss from 'express'
import { GetAllUsers, Login, Signup, UpdateProfile } from '../controller/auth.js'
import auth from '../middleware/auth.js'
const router = expresss.Router()
router.post('/signup', Signup)
router.post('/login', Login)
router.get('/getalluser', auth,GetAllUsers)
router.patch('/update/:id', auth,UpdateProfile)
export default router;