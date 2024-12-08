import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Message {
  id: string;
  recipient: string;
  content: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  createdAt: string;
  updatedAt: string;
  error?: string;
}

interface MessageHistoryProps {
  messages: Message[];
  onRetry?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export function MessageHistory({ messages, onRetry, onDelete }: MessageHistoryProps) {
  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'QUEUED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'READ':
        return 'bg-purple-100 text-purple-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (messages.length === 0) {
    return (
      <Card>
        <div className="text-center py-6">
          <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start sending messages to see your history here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id}>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {message.recipient}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {format(new Date(message.createdAt), 'PPpp')}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  message.status
                )}`}
              >
                {message.status}
              </span>
            </div>

            {/* Content */}
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {message.content}
              </pre>
            </div>

            {/* Error Message */}
            {message.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">{message.error}</p>
              </div>
            )}

            {/* Actions */}
            {(onRetry || onDelete) && (
              <div className="flex justify-end space-x-2">
                {message.status === 'FAILED' && onRetry && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onRetry(message.id)}
                  >
                    Retry
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to delete this message?'
                        )
                      ) {
                        onDelete(message.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}

            {/* Delivery Timeline */}
            {message.status !== 'FAILED' && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div className="relative flex justify-between">
                        {['QUEUED', 'SENT', 'DELIVERED', 'READ'].map(
                          (status, index) => {
                            const isActive =
                              [
                                'QUEUED',
                                'SENT',
                                'DELIVERED',
                                'READ',
                              ].indexOf(message.status) >= index;
                            return (
                              <div
                                key={status}
                                className={`h-2 w-2 rounded-full ${
                                  isActive ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>Queued</span>
                      <span>Sent</span>
                      <span>Delivered</span>
                      <span>Read</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
