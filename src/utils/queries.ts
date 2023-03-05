import axios from 'axios';
import { API_KEY } from '../env';
import { ErrorLogType } from 'intersection';

export const createBugQuery = (values: ErrorLogType<Date>) => {
    const date = new Date(values.timestamp);
    const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate().toString().padStart(2, '0')}`;
    return {
        query: `mutation ($itemName: String!, $columnValues: JSON!) {
                    create_item(
                        board_id: 1148727305, 
                        group_id: topics, 
                        item_name: $itemName,
                        column_values: $columnValues
                        ){
                            id
                            column_values {
                                value
                            }
                        }
        }`,
        variables: {
            itemName: values.stack.split('at').slice(0,2).join(' at'),
            columnValues: JSON.stringify({
                date4: {date:dateStr},
                text: values.name,
                text3: values.message,
                text34: values.stack,
                text1: values.browserVersion,
                text13: JSON.stringify(values)
            })
        }
}};

export const queryAPI = async (body:{query:string, variables?: Object}, options:Object) => {
    try {
        const response = await axios({
            url:"https://api.monday.com/v2",
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `${API_KEY}`
            },
            data: JSON.stringify(body),
            ...options
        });
        return response;
    }
    catch(err:any){
        console.log(err.message);
        throw err;
    }
}