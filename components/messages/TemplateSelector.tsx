import { useState, useEffect } from 'react';
import { Dialog, Combobox } from '@headlessui/react';
import { SearchIcon, CheckIcon } from '@heroicons/react/solid';
import { MessageTemplate } from '@prisma/client';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: MessageTemplate) => void;
}

export default function TemplateSelector({
  isOpen,
  onClose,
  onSelect,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/templates');
      if (!response.ok) {
        throw new Error('Failed to load templates');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      setError('Failed to load templates. Please try again.');
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = query === ''
    ? templates
    : templates.filter((template) => {
        const searchStr = `${template.name} ${template.description || ''} ${template.content}`.toLowerCase();
        return searchStr.includes(query.toLowerCase());
      });

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Select Template
          </Dialog.Title>

          <div className="mt-4">
            <Combobox
              value={null}
              onChange={(template) => {
                onSelect(template as MessageTemplate);
                onClose();
              }}
            >
              <div className="relative">
                <div className="relative w-full">
                  <Combobox.Input
                    className="w-full py-2 pl-10 pr-4 text-sm leading-5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search templates..."
                    displayValue={() => ''}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>

                <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {loading && (
                    <div className="px-4 py-2 text-sm text-gray-700">
                      Loading...
                    </div>
                  )}

                  {error && (
                    <div className="px-4 py-2 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {!loading && !error && filteredTemplates.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-700">
                      No templates found
                    </div>
                  )}

                  {filteredTemplates.map((template) => (
                    <Combobox.Option
                      key={template.id}
                      value={template}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {template.name}
                          </span>
                          {selected && (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-blue-600'
                              }`}
                            >
                              <CheckIcon className="w-5 h-5" aria-hidden="true" />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
