import { Askanswer, DeleteAnswer } from "../controller/answer.js";
import express from 'express'
import auth from "../middleware/auth.js";
const router = express.Router()
router.post('/postanswer/:id', auth, Askanswer)
router.delete('/delete/:id', auth, DeleteAnswer)
export default router;