import mongoose from 'mongoose'
import question from '../models/question.js'

export const AskQuestion = async (req, res) => {
    const { postquestiondata } = req.body

    const postques = new question({ ...postquestiondata })
    try {
        await postques.save()
        return res.status(200).json({ success: true, data: postques })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: "Something Went Wrong...", Reason: error.message })
    }
}
export const GetAllQuestions = async (req, res) => {
    try {
        const Questions = await question.find().sort({ askedon: -1 })
        return res.status(200).json({ success: true, data: Questions })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: "Something Went Wrong..." })
    }
}
export const DeleteQuestion = async (req, res) => {
    const { id: _id } = req.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(401).json({ success: false, message: "Question Not available" })
    }
    try {
        await question.findByIdAndDelete(_id)
        return res.status(200).json({ success: true, message: "Deleted SuccessFully" })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: "Something Went Wrong..." })
    }
}
export const VoteQuestion = async (req, res) => {
    const { id: _id } = req.params
    const { value, userid } = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(401).json({ success: false, message: "Question Not available" })
    }
    try {

        const grabQuestion = await question.findById(_id)

        const upIndex = grabQuestion.upvote.findIndex((id) => id === String(userid))
        const downIndex = grabQuestion.downvote.findIndex((id) => id === String(userid))
        if (value === "upvote") {
            if (downIndex !== -1) {
                grabQuestion.downvote = grabQuestion.downvote.filter(
                    (id) => id !== String(userid)
                )
            }

            if (upIndex === -1) {
                grabQuestion.upvote.push(String(userid))
            } else {
                grabQuestion.upvote = grabQuestion.upvote.filter(
                    (id) => id !== String(userid)
                )
            }
        }

        const newQuestionVote = await question.findByIdAndUpdate(
            _id,
            grabQuestion,
            { returnDocument: "after" }
        );

        return res.status(200).json({ success: true, data: newQuestionVote })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: "Something Went Wrong..." })
    }
}
