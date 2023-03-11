import { NextFunction, Response } from 'express';
import { TypedRequest } from 'delivery-backend';
import { ExtendedErrorLogType } from 'intersection';
import { AxiosResponse } from 'axios';
import { createBugQuery, queryAPI } from '../utils/queries';
import { delay } from '../utils/delay';
import WebhookLog from "../models/webhookLogs";
import dotenv from 'dotenv';
dotenv.config();

export const postToMondayGrapQLAPI = async (req:TypedRequest<ExtendedErrorLogType<Date>, any>, res:Response, _: NextFunction) => {
    try {
        res.status(200).json();
        let response = await fetch(req.body);
        let backoffCoefficient = 0;
        while (response!.status>=400 && backoffCoefficient < 10){
            ++backoffCoefficient;
            await delay(backoffCoefficient);
            response = await fetch(req.body);
        }
        await saveLog(response, req.body);
    } catch(err:any) {
        console.log(err);
        await saveLog(err.response, req.body);
    }
}

const fetch = async (requestBody: ExtendedErrorLogType<Date>) => await queryAPI(createBugQuery(requestBody), {validateStatus: (status:number) => !(status >=400 && status < 600) || [400,408].includes(status)});

const saveLog = async (responseObject: AxiosResponse, requestBody:ExtendedErrorLogType<Date>) => {
    const newLog = await WebhookLog.create({status: responseObject.status?responseObject.status:null, payload:requestBody?requestBody:null});
    await newLog.save();
}