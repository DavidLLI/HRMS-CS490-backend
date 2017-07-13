import mongoose from 'mongoose';
import express from 'express';
import Employee from './model';
import _ from 'lodash';

const skillsRouter = express.Router();

mongoose.connect('localhost:27017');



export default skillsRouter;