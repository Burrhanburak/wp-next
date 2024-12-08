import { useState, useEffect } from 'react';

interface VariableEditorProps {
  content: string;
  variables: Record<string, string>;
  onChange: (variables: Record<string, string>) => void;
  className?: string;
}

export default function VariableEditor({
  content,
  variables,
  onChange,
  className = '',
}: VariableEditorProps) {
  const [variableList, setVariableList] = useState<string[]>([]);

  useEffect(() => {
    // Extract variables from content
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    const uniqueVars = Array.from(new Set(
      matches.map(match => match.slice(2, -2).trim())
    ));
    setVariableList(uniqueVars);
  }, [content]);

  const handleVariableChange = (variable: string, value: string) => {
    const updatedVariables = {
      ...variables,
      [variable]: value,
    };
    onChange(updatedVariables);
  };

  if (variableList.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Template Variables
        </h3>
        <div className="space-y-3">
          {variableList.map((variable) => (
            <div key={variable}>
              <label
                htmlFor={`variable-${variable}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {variable}
              </label>
              <input
                type="text"
                id={`variable-${variable}`}
                value={variables[variable] || ''}
                onChange={(e) => handleVariableChange(variable, e.target.value)}
                placeholder={`Enter value for ${variable}`}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {variableList.some(variable => !variables[variable]) && (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Missing Variables
          </h3>
          <p className="text-sm text-yellow-700">
            Please fill in all variables to complete the message.
          </p>
        </div>
      )}
    </div>
  );
}
