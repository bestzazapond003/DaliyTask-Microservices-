import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'กรุณากรอกชื่องาน'),
  description: z.string().optional(),
  date: z.string().min(1, 'กรุณาเลือกวันที่ต้องทำ'),
  category: z.enum(['general', 'urgent', 'meeting', 'document']),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
