import { supabaseAdmin } from '../config/supabase.js';

export const taskService = {
  // Get all tasks for a specific user
  async getUserTasks(userId) {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return data || [];
  },

  // Create a new task for a specific user
  async createTask(userId, { title }) {
    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert([
        {
          user_id: userId,
          title: title.trim(),
          completed: false
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return data;
  },

  // Update a task (must match both taskId and userId)
  async updateTask(taskId, userId, updateData) {
    // Verify ownership and existence first
    const { data: existing, error: findError } = await supabaseAdmin
      .from('tasks')
      .select('id, user_id')
      .eq('id', taskId)
      .single();

    if (findError || !existing) {
      const err = new Error('Task not found.');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (existing.user_id !== userId) {
      const err = new Error('Unauthorized to modify this task.');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return data;
  },

  // Delete a task (must match both taskId and userId)
  async deleteTask(taskId, userId) {
    const { data: existing, error: findError } = await supabaseAdmin
      .from('tasks')
      .select('id, user_id')
      .eq('id', taskId)
      .single();

    if (findError || !existing) {
      const err = new Error('Task not found.');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (existing.user_id !== userId) {
      const err = new Error('Unauthorized to delete this task.');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }

    const { error } = await supabaseAdmin
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return true;
  }
};
