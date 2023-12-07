import { validation } from '../../middleware/validation.js'
import *as validators from './reviews.validation.js'
import *as  reviewController from './controller/reviews.js'
import { Router } from "express";
import { endpoint } from './reviews.endpoint.js';
import { author } from '../../middleware/auntication.js';
const router = Router({ mergeParams: true })



router.post('/',
    author(endpoint.create),
    validation(validators.createReview),
    reviewController.createReview)

router.patch('/:reviewId',
    author(endpoint.update),
    validation(validators.updateReview),
    reviewController.updateReview)



export default router