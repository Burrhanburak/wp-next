import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Papa from 'papaparse';

interface CsvUploadProps {
  onNumbersLoaded: (numbers: string[]) => void;
}

export function CsvUpload({ onNumbersLoaded }: CsvUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const numbers = await new Promise<string[]>((resolve, reject) => {
        Papa.parse(file, {
          complete: (results) => {
            const phoneNumbers = results.data
              .flat() // Handle both single column and multiple column CSVs
              .map(num => String(num).trim()) // Convert to string and trim
              .filter(num => num && num.length > 0) // Remove empty values
              .map(num => {
                // Add + prefix if not present and number is valid
                const cleaned = num.replace(/[^0-9]/g, '');
                return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
              });
            resolve(phoneNumbers);
          },
          error: (error) => {
            reject(new Error('Failed to parse CSV file'));
          },
        });
      });

      if (numbers.length === 0) {
        throw new Error('No valid phone numbers found in the CSV file');
      }

      onNumbersLoaded(numbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        handleFileChange({ target: { files: dataTransfer.files } } as any);
      }
    } else {
      setError('Please upload a CSV file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Phone Numbers</CardTitle>
        <CardDescription>
          Upload a CSV file containing phone numbers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
          {isLoading ? (
            <p>Processing file...</p>
          ) : fileName ? (
            <p className="text-sm text-gray-600">Loaded: {fileName}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Drag and drop your CSV file here, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-2">
                File should contain one phone number per row
              </p>
            </>
          )}
        </div>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setFileName(null);
            setError(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        >
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}
