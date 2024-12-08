'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { DatePickerDemo } from '@/components/ui/date-time-picker';
import { toast } from 'sonner';

export function MessageComposer() {
  const [message, setMessage] = useState('');
  const [numbers, setNumbers] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Date>();
  const [activeTab, setActiveTab] = useState('single');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          numbers: numbers.split(',').map(n => n.trim()),
          scheduledAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully!');
      setMessage('');
      setNumbers('');
      setScheduledAt(undefined);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Tabs defaultValue="single" className="w-full">
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
          <CardDescription>
            Send WhatsApp messages to single or multiple recipients
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Message</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Message</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="single">
              <div className="space-y-2">
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  placeholder="Enter phone number"
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  required
                />
              </div>
            </TabsContent>
            <TabsContent value="bulk">
              <div className="space-y-2">
                <Label htmlFor="numbers">Phone Numbers</Label>
                <Textarea
                  id="numbers"
                  placeholder="Enter phone numbers (comma separated)"
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter multiple numbers separated by commas
                </p>
              </div>
            </TabsContent>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Schedule (Optional)</Label>
              <DatePickerDemo
                date={scheduledAt}
                setDate={setScheduledAt}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
}
