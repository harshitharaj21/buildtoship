import { taskService } from '../services/task.service.js';

export const taskController = {
  // GET /api/tasks
  async getTasks(req, res, next) {
    try {
      const userId = req.user.id;
      const tasks = await taskService.getUserTasks(userId);

      return res.status(200).json({
        success: true,
        count: tasks.length,
        tasks
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/tasks
  async createTask(req, res, next) {
    try {
      const userId = req.user.id;
      const { title } = req.body;

      const task = await taskService.createTask(userId, { title });

      return res.status(201).json({
        success: true,
        task
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/tasks/:id
  async updateTask(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updatePayload = req.body;

      const updatedTask = await taskService.updateTask(id, userId, updatePayload);

      return res.status(200).json({
        success: true,
        task: updatedTask
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/tasks/:id
  async deleteTask(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await taskService.deleteTask(id, userId);

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
};
