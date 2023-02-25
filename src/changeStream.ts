import { MongoClient, ChangeStreamInsertDocument, ChangeStreamDocumentCommon, ChangeStream } from 'mongodb';
import {  } from 'mongoose';
import { MONGO_URI, PROJECT_ID } from './env';
import { createBugQuery, queryAPI, getBugsQuery } from './queries';
import { ErrorLogType } from 'intersection';
import dotenv from 'dotenv';
dotenv.config();

const pipeline = [{
    $match: {
       "operationType": "insert",
       "fullDocument.appId": PROJECT_ID
    }
}]

export const changeStreamHandler = async () => {
    try {
      const client = new MongoClient(MONGO_URI!);
      const logs = client.db('errors').collection('logs');
      const storedToken = await client.db('errors').collection('token').findOne({_id: 'resume_token'});
      const changeStream = storedToken ? logs.watch(pipeline, {resumeAfter: storedToken}) : logs.watch(pipeline);
      changeStream.on('change', async (next:ChangeStreamInsertDocument) => {
        const resumeToken = (next as ChangeStreamInsertDocument & {_id: {_data: string}})._id._data;
        await client.db('errors').collection('token').findOneAndUpdate({_id: 'resume_token'},{$set:{token: resumeToken}},{upsert:true});
        const stack = next.fullDocument.stack;
        const name = stack.split('at').slice(0,2).join(' at');
        const bugs = await queryAPI(getBugsQuery(name));
        if (bugs.items_by_column_values.length===0){
            queryAPI(createBugQuery({...next.fullDocument, name} as ErrorLogType<Date>)).then(data => console.log(data));
        }
      })
      changeStream.on('error', async () => await changeStream.close().catch(err => {throw err}));
    }
    catch (err:any){
      console.log(err.message);
    }
}