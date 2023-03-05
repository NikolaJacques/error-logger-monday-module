import { Router } from 'express';
import {postToMondayGrapQLAPI} from '../controllers/changeStream';

const router = Router();

router.post('/', postToMondayGrapQLAPI);

export default router;