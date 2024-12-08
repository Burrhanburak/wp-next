'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createTemplate, getTemplates } from '@/app/actions/templates';
import { Toaster, toast } from 'sonner'

interface Template {
  id: string;
  name: string;
  content: string;
}

export function MessageTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');


  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load templates');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTemplate({ name, content });
      setIsOpen(false);
      setName('');
      setContent('');
      toast.success('Template created successfully!');
      loadTemplates(); // Reload templates
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Message Templates</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Create Template</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
              <DialogDescription>
                Create a new message template.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Template Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Template Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save Template</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="p-4 border rounded-lg space-y-2"
          >
            <h3 className="font-medium">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
