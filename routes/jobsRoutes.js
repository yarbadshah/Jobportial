
import express from 'express'
import userAuth from '../middlewares/authMiddlewares.js'
import { createJobController, deleteJobController, getAlljobsController, jobStatsController } from '../controllers/jobsController.js'
import { updataUserController } from '../controllers/userController.js'
import { updateJobController } from './../controllers/jobsController.js';

const router = express.Router()

router.post('/create-job', userAuth, createJobController)
router.get('/get-job', userAuth, getAlljobsController)
router.patch('/update-job/:id', userAuth, updateJobController)
router.delete('/delete-job/:id', userAuth, deleteJobController)
router.get('/job-stats', userAuth, jobStatsController)
export default router