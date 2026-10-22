import expresss from 'express'
import { AskQuestion, DeleteQuestion, GetAllQuestions, VoteQuestion } from '../controller/question.js'
import auth from '../middleware/auth.js'
const router = expresss.Router()
router.post('/ask', auth, AskQuestion)
router.get('/getallquestion', auth, GetAllQuestions)
router.delete('/delete/:id', auth, DeleteQuestion)
router.patch('/vote/:id', auth, VoteQuestion)
export default router;