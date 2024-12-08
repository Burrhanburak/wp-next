import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface MessageComposerProps {
  initialContent?: string;
  onSend: (data: { content: string; recipients: string[] }) => void;
  isLoading?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  initialContent = '',
  onSend,
  isLoading = false,
}) => {
  const [content, setContent] = useState(initialContent);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleAddRecipient = () => {
    if (!recipientInput.trim()) return;

    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(recipientInput.trim())) {
      alert('Please enter a valid phone number');
      return;
    }

    setRecipients([...new Set([...recipients, recipientInput.trim()])]);
    setRecipientInput('');
  };

  const handleRemoveRecipient = (recipient: string) => {
    setRecipients(recipients.filter((r) => r !== recipient));
  };

  const handleSend = () => {
    if (!content.trim()) {
      alert('Please enter a message');
      return;
    }

    if (recipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    onSend({ content, recipients });
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const numbers = text
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter((n) => n.match(/^\+?[1-9]\d{1,14}$/));
    
    if (numbers.length > 0) {
      setRecipients([...new Set([...recipients, ...numbers])]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recipients Section */}
      <Card title="Recipients">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
              placeholder="Enter phone number"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <Button onClick={handleAddRecipient}>Add</Button>
          </div>
          <div
            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-sm text-gray-500"
            onPaste={handlePaste}
          >
            Paste phone numbers here (comma or newline separated)
          </div>
          {recipients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipients.map((recipient) => (
                <span
                  key={recipient}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {recipient}
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient(recipient)}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Message Content Section */}
      <Card title="Message Content">
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Type your message here..."
          />
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <div className="text-sm text-gray-500">
              {content.length} characters
            </div>
          </div>
        </div>
      </Card>

      {/* Preview Section */}
      {showPreview && (
        <Card title="Message Preview">
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {content}
            </pre>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="primary"
          isLoading={isLoading}
          onClick={handleSend}
          className="w-full sm:w-auto"
        >
          Send Message{recipients.length > 0 ? ` to ${recipients.length} recipients` : ''}
        </Button>
      </div>
    </div>
  );
};
