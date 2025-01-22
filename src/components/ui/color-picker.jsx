import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Adjust import paths
import { Input } from '@/components/ui/input'; // Adjust import paths
import { ChromePicker } from 'react-color';

const ColorPicker= () => {
  const [color, setColor] = useState<string>('#ff0000');

  const handleChange = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Popover for Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="h-8 w-8 rounded-full border"
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <ChromePicker color={color} onChange={handleChange} />
        </PopoverContent>
      </Popover>

      {/* Display Hex Code */}
      <Input
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-32"
      />
    </div>
  );
};

export default ColorPicker;
