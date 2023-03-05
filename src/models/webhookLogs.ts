import { Schema, model } from 'mongoose';

export interface WebhookLog {
    status: Number,
    payload: Object,
    timestamp: Date
}

const webhookLogSchema = new Schema<WebhookLog>({
    status: {
        type: String,
        required: true
    },
    payload: {
        type: Object,
        required: true,
        default: {}
    },
    timestamp: {
        type: Date,
        required: true,
        default: new Date()
    }
});

const WebhookLog = model<WebhookLog>('WebhookLog', webhookLogSchema);

export default WebhookLog;