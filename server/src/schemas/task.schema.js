import { z } from 'zod';

// UUID validation helper for route params
export const taskIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid task ID format. Must be a valid UUID.' })
});

// Schema for creating a task
export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .trim()
    .min(1, { message: 'Title cannot be empty.' })
    .max(255, { message: 'Title cannot exceed 255 characters.' })
});

// Schema for updating a task
export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title cannot be empty.' })
    .max(255, { message: 'Title cannot exceed 255 characters.' })
    .optional(),
  completed: z
    .boolean({ invalid_type_error: 'Completed must be a boolean value.' })
    .optional()
}).refine(data => data.title !== undefined || data.completed !== undefined, {
  message: 'At least one field (title or completed) must be provided for update.'
});
