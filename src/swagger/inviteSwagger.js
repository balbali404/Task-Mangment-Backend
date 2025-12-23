/**
 * @swagger
 * /invite:
 *   post:
 *     summary: Generate team invite
 *     tags:
 *       - Invite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - teamId
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               teamId:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Invite generated successfully
 */

/**
 * @swagger
 * /invite/verify:
 *   post:
 *     summary: Verify team invite
 *     tags:
 *       - Invite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Invite verified successfully
 */

/**
 * @swagger
 * /invite/:id:
 *   post:
 *     summary: Accept or Reject team invite
 *     tags:
 *       - Invite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123"
 *               status:
 *                 type: string
 *                 example: "accepted || rejected"
 *     responses:
 *       200:
 *         description: Invite accepted successfully
 */
