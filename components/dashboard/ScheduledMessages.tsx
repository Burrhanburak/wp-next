import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export async function ScheduledMessages() {
  const session = await getServerSession();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return null;

  const scheduledMessages = await prisma.message.findMany({
    where: {
      userId: user.id,
      status: 'SCHEDULED',
      scheduledAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });

  const handleCancel = async (messageId: string) => {
    'use server';
    
    const response = await fetch(`/api/messages/schedule?id=${messageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to cancel message');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Messages</CardTitle>
        <CardDescription>
          View and manage your upcoming scheduled messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        {scheduledMessages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No scheduled messages
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Scheduled For</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{message.recipient}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {message.content}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {format(message.scheduledAt, 'PPp')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(message.id)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
