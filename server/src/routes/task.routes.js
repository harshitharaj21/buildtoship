import { Router } from 'express';
import { taskController } from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validateBody, validateParams } from '../middleware/validate.middleware.js';
import { createTaskSchema, updateTaskSchema, taskIdParamSchema } from '../schemas/task.schema.js';

const router = Router();

// All task routes require authentication
router.use(requireAuth);

// GET /api/tasks - Get all tasks for authenticated user
router.get('/', taskController.getTasks);

// POST /api/tasks - Create a task
router.post('/', validateBody(createTaskSchema), taskController.createTask);

// PATCH /api/tasks/:id - Update a task
router.patch(
  '/:id',
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  taskController.updateTask
);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', validateParams(taskIdParamSchema), taskController.deleteTask);

export default router;
