import { Router } from 'express';
import {postToMondayGrapQLAPI} from '../controllers/receiver';
import {authorization} from '../middleware/authorization';

const router = Router();

router.post('/', authorization, postToMondayGrapQLAPI);

export default router;