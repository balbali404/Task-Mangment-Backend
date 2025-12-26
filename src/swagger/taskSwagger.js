/**
 * @swagger
 * /api/taskList:
 *   get:
 *     summary: Get tasks
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Task List
 *     responses:
 *       200:
 *         description: Task list fetched successfully
 */

/**
 * @swagger
 * /api/taskList/{id}:
 *   get:
 *     summary: Get task by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Task List
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       404:
 *         description: Task not found
 */
/**
 * @swagger
 * /api/taskList:
 *   post:
 *     summary: Create task list
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Task List
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *                 format: date
 *               assignees:
 *                 type: array
 *                 items:
 *                   type: string
 *              
 *     responses:
 *       201:
 *         description: Task list created successfully
 */
/**
 * @swagger
 * /api/taskList/{id}:
 *   put:
 *     summary: Update task list by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Task List
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task list ID
 *     responses:
 *       200:
 *         description: Task list updated successfully
 *       404:
 *         description: Task list not found
 */

/**
 * @swagger
 * /api/taskList/{id}:
 *   delete:
 *     summary: Delete task list by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Task List
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task list ID
 *     responses:
 *       200:
 *         description: Task list deleted successfully
 *       404:
 *         description: Task list not found
 */