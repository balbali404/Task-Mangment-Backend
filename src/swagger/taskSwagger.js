/**
 * @swagger
 * /api/task-list:
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
 * /api/tasks/{id}:
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
 * /api/task-list/{id}:
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
 * /api/task-list/{id}:
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