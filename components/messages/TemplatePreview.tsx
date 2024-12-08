import { useState, useEffect } from 'react';
import { MessageTemplate } from '@prisma/client';

interface TemplatePreviewProps {
  template: MessageTemplate;
  variables?: Record<string, string>;
  className?: string;
}

export default function TemplatePreview({
  template,
  variables = {},
  className = '',
}: TemplatePreviewProps) {
  const [preview, setPreview] = useState(template.content);
  const [missingVariables, setMissingVariables] = useState<string[]>([]);

  useEffect(() => {
    // Extract variables from template content
    const matches = template.content.match(/\{\{([^}]+)\}\}/g) || [];
    const templateVars = matches.map(match => match.slice(2, -2).trim());

    // Find missing variables
    const missing = templateVars.filter(variable => !variables[variable]);
    setMissingVariables(missing);

    // Generate preview
    let previewText = template.content;
    templateVars.forEach(variable => {
      const value = variables[variable] || `{{${variable}}}`;
      previewText = previewText.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), value);
    });

    setPreview(previewText);
  }, [template.content, variables]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Message Preview
        </h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {preview}
        </p>
      </div>

      {missingVariables.length > 0 && (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Missing Variables
          </h3>
          <ul className="list-disc list-inside text-sm text-yellow-700">
            {missingVariables.map((variable) => (
              <li key={variable}>{variable}</li>
            ))}
          </ul>
        </div>
      )}

      {template.description && (
        <div className="bg-gray-50 rounded-lg border p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Template Description
          </h3>
          <p className="text-sm text-gray-700">
            {template.description}
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Template Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-gray-500">Name</dt>
          <dd className="text-gray-900">{template.name}</dd>
          <dt className="text-gray-500">Type</dt>
          <dd className="text-gray-900">
            {template.isGlobal ? 'Global Template' : 'Personal Template'}
          </dd>
          <dt className="text-gray-500">Created</dt>
          <dd className="text-gray-900">
            {new Date(template.createdAt).toLocaleDateString()}
          </dd>
          <dt className="text-gray-500">Last Updated</dt>
          <dd className="text-gray-900">
            {new Date(template.updatedAt).toLocaleDateString()}
          </dd>
        </dl>
      </div>
    </div>
  );
}
