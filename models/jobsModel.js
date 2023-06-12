import mongoose from "mongoose";
const jobSclema = new mongoose.Schema({
    company: {
        type: String,
        requied: [true, 'Company Name is required'],
    },
    position: {
        type: String,
        requied: [true, 'Posistion is Required'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['pending', 'reject', 'interview'],
        default: 'pending'
    },
    workType: {
        type: String,
        enum: ['full-time', 'part-time', 'intership', 'contaract'],
        default: 'full-time'
    },
    workLocation: {
        type: String,
        default: 'Mumbi',
        requied: [true, 'work location is required']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

export default mongoose.model('job', jobSclema)