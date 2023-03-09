import { createBugQuery, queryAPI } from '../utils/queries';
import { TypedRequest } from 'delivery-backend';
import { ErrorLogInterface } from 'frontend-backend';
import { NextFunction, Response } from 'express';
import { delay } from '../utils/delay';
import WebhookLog from "../models/webhookLogs";
import dotenv from 'dotenv';
dotenv.config();

export const postToMondayGrapQLAPI = async (req:TypedRequest<ErrorLogInterface, any>, res:Response, next: NextFunction) => {
  try{
    res.status(200).json();
    const fetch = async () => await queryAPI(createBugQuery(req.body), {validateStatus: (status:number) => !(status >=400 && status < 600) || [400,408].includes(status)});
    let response = await fetch();
    let backoffCoefficient = 0;
    while (response!.status>=400 && backoffCoefficient < 10){
        ++backoffCoefficient;
        await delay(backoffCoefficient);
        response = await fetch();
    }
    const newLog = await WebhookLog.create({status: response.status?response.status:null, payload:req.body?req.body:null});
    await newLog.save();
} catch(err:any) {
    console.log(err);
    const newLog = await WebhookLog.create({status: err.response.status?err.response.status:500, payload:req.body?req.body:null});
    await newLog.save();
}
}