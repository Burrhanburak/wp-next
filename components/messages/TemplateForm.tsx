import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  content: z.string().min(1, 'Content is required').max(4096),
  isGlobal: z.boolean().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  initialData?: {
    id?: string;
    name: string;
    content: string;
    isGlobal?: boolean;
  };
  onSubmit: (data: TemplateFormData) => Promise<void>;
  isLoading?: boolean;
}

export function TemplateForm({ initialData, onSubmit, isLoading }: TemplateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData || {
      name: '',
      content: '',
      isGlobal: false,
    },
  });

  const content = watch('content');

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting template:', error);
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <Card>
        <div className="space-y-4">
          {/* Template Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Template Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Welcome Message"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Template Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Template Content
            </label>
            <div className="mt-1 space-y-2">
              <textarea
                id="content"
                rows={6}
                {...register('content')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your message template here..."
              />
              <p className="text-sm text-gray-500">
                Use {{variable}} syntax for dynamic content. Example: Hello {{name}}!
              </p>
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
          </div>

          {/* Character Count */}
          <div className="text-sm text-gray-500">
            {content?.length || 0} / 4096 characters
          </div>

          {/* Variables Preview */}
          {content && (
            <div>
              <h4 className="text-sm font-medium text-gray-700">Template Variables:</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(new Set((content.match(/\{\{([^}]+)\}\}/g) || []))).map(
                  (variable) => (
                    <span
                      key={variable}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {variable}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Preview */}
      <Card title="Preview">
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {content || 'No content'}
          </pre>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          {initialData?.id ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
}
