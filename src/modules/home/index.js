import catchError from '../../utils/catchError';
import getHome from './getHome';

export default (router) => {
  // I'm not setting up swagger, because I think that's out of scope of the assessment
  // but this is general idea
  /**
   * @swagger
   * /activityTypes:
   *   get:
   *     tags:
   *       - Shows
   *     description: List of shows with cast
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *        description: A list of shows
   */
  router.get('/', catchError(getHome));
};
