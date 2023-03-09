import {Request, Response, NextFunction} from 'express';
import {PROJECT_ID} from '../env';

export const authorization = (req:Request, res:Response, next:NextFunction) => {
    try{
        const appId:string = req.body.appId;
        const timestamp:Date = new Date(req.body.timestamp);
        if(!(appId===PROJECT_ID)){
            throw new Error('project id error');
        }
        if((Math.floor(Math.abs(timestamp.getTime() - new Date().getTime())/360000))>24){
            throw new Error('timestamp error');
        }
        next();
    }
    catch(err:any){
        res.status(401).json();
    }
}