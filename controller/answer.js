import mongoose from "mongoose";
import question from "../models/question.js";

export const Askanswer = async (req, res) => {
    const { id: _id } = req.params

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Question UnAvailable" })
    }
    const { noofanswer, answerbody, useranswered, userid } = req.body
    await updateNoOfAnswer(_id, noofanswer)
    try {
        const updatedquestion = await question.findByIdAndUpdate(_id, { $push: { answer: { answerbody, useranswered, userid, answeredon: new Date() } }, $inc: { noofanswer: 1 } }, { returnDocument: "after" });
        const newAnswer = updatedquestion.answer[updatedquestion.answer.length - 1];
        return res.status(200).json({ sucess: true, data: newAnswer })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Something went Wrong" })
    }
}
const updateNoOfAnswer = async (_id, noofanswer) => {
    try {
        await question.findByIdAndUpdate(_id, { $set: { noofanswer: noofanswer } })
    } catch (error) {
        console.log(error)
    }
}
export const DeleteAnswer = async (req, res) => {
    const { id: _id } = req.params
    const { noofanswer, answerid } = req.body
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Question UnAvailable" })
    }
    if (!mongoose.Types.ObjectId.isValid(answerid)) {
        console.log("answer id is :: ", answerid)
        return res.status(400).json({ success: false, message: "answer UnAvailable" })
    }
    await updateNoOfAnswer(_id, noofanswer)
    try {
        const updatedquestion = await question.findByIdAndUpdate(_id, { $pull: { answer: { _id: answerid } } }, { returnDocument: "after" });

        return res.status(200).json({ sucess: true, data: updatedquestion, message: "deleted Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Something went Wrong" })
    }
}
