import moment from "moment/moment.js";
import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";

export const createJobController = async (req, res, next) => {
    const { company, position } = req.body
    if (!company || !position) {
        next('plase Provide All the Feildswd')
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(202).json({ job });
};

export const getAlljobsController = async (req, res, next) => {
    const {status, workType, search,sort} = req.query
    //const jobs = await jobsModel.find({ createdBy: req.user.userId });
    const queryObject = {
        createdBy : req.user.userId
    }
    if(status && status !== 'all'){
        queryObject.status = status
    }
    if(workType && workType !== 'all'){
        queryObject.workType = workType
    }
    if(search){
        queryObject.position = {$regex: search, $options:'i'}
    }

    let queryResult = jobsModel.find(queryObject)
    if(sort === 'latest'){
        queryResult = queryResult.sort('-createdAt');   
    }
    if(sort === 'oldest'){
        queryResult = queryResult.sort('createdAt');   
    }
    if(sort === 'a-z'){
        queryResult = queryResult.sort('position');   
    }
    if(sort === 'z-a'){
        queryResult = queryResult.sort('-position');   
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit
    queryResult = queryResult.skip(skip).limit(limit)
    const totalJobs = await jobsModel.countDocuments(queryResult)
    const numOfPages = Math.ceil(totalJobs/limit)
    const jobs = await queryResult;
    res.status(200).json({ totalJobs, jobs, numOfPages })
};
export const updateJobController = async (req, res, next) => {
    const { id } = req.params
    const { company, position } = req.body

    if (!company || !position) {
        next('Plase provide All the Fielddf')
    }
    const job = await jobsModel.findOne({ _id: id })
    if (!job) {
        next(`no jobs are found with this id ${id}`)
    }
    if (!req.user.userId === job.createdBy.toString()) {
        next('you are not authorized to update this job')
        return;
    }
    const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true
    })
    res.status(200).json({ updateJob })
};
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params

    const job = await jobsModel.findOne({ _id: id })

    if (!job) {
        next(`No Job Found on this id ${id}`)
    }
    if (!req.user.userId === job.createdBy.toString()) {
        next('you are not Authorized to delete this job')
        return;
    }
    await job.deleteOne()
    res.status(200).json({ message: 'Success, job delete' })
};

export const jobStatsController = async (req, res, next) => {
    const stats = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            },
        },
    ]);
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0
    };
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: {
                    $sum: 1
                }
            }
        }
    ]);
    monthlyApplication = monthlyApplication.map(item =>{
        const {_id:{year, month}, count} = item;
        const date = moment().month(month-1).year(year).format('MMMM YYYY');
        return {date, count};
    }).reverse();
    res.status(200).json({ totaljobs: stats.length, defaultStats, monthlyApplication });
}