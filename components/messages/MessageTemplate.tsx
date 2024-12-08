import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface MessageTemplateProps {
  template: {
    id: string;
    name: string;
    content: string;
    isGlobal: boolean;
  };
  onUse: (template: { id: string; content: string }) => void;
  onEdit?: (template: { id: string; name: string; content: string }) => void;
  onDelete?: (id: string) => void;
}

export const MessageTemplate: React.FC<MessageTemplateProps> = ({
  template,
  onUse,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
          {template.isGlobal && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Global Template
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onUse({ id: template.id, content: template.content })}
          >
            Use Template
          </Button>
          {onEdit && !template.isGlobal && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit(template)}
            >
              Edit
            </Button>
          )}
          {onDelete && !template.isGlobal && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(template.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {template.content}
        </pre>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900">Available Variables:</h4>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {getTemplateVariables(template.content).map((variable) => (
            <li
              key={variable}
              className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1"
            >
              {variable}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

// Helper function to extract variables from template content
function getTemplateVariables(content: string): string[] {
  const regex = /\{\{(.*?)\}\}/g;
  const matches = content.match(regex) || [];
  return [...new Set(matches.map(match => match.replace(/[{}]/g, '').trim()))];
}
