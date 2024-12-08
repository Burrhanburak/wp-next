import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const campaignSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  description: z.string().optional(),
  template: z.string().min(1, 'Message template is required'),
  targetGroups: z.array(z.string()).min(1, 'Select at least one target group'),
  scheduledTime: z.string().optional(),
  whatsappConnection: z.string().min(1, 'Select a WhatsApp connection'),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  onSubmit: (data: CampaignFormValues) => void;
  connections: Array<{ id: string; businessName: string }>;
  groups: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

export function CampaignForm({ onSubmit, connections, groups, isLoading }: CampaignFormProps) {
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      targetGroups: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter campaign name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter campaign description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="whatsappConnection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Connection</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                options={connections.map(conn => ({
                  label: conn.businessName,
                  value: conn.id,
                }))}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Template</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your message template. Use {{name}} for personalization."
                  className="h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetGroups"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Groups</FormLabel>
              <Select
                mode="multiple"
                onValueChange={(value) => field.onChange(value)}
                defaultValue={field.value}
                options={groups.map(group => ({
                  label: group.name,
                  value: group.id,
                }))}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schedule (Optional)</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
        </Button>
      </form>
    </Form>
  );
}
