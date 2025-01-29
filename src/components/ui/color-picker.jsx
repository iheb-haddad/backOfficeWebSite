import React, { useState , useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Adjust import paths
import { Input } from '@/components/ui/input'; // Adjust import paths
import { ChromePicker } from 'react-color';

const ColorPicker= ({color,setColor}) => {
  const handleChange = (newColor) => {
    setColor(newColor.hex);
  };
  return (
    <div className="flex items-center space-x-2">
      {/* Popover for Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="h-6 w-6 rounded-sm border-black border"
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
        className="w-28"
      />
    </div>
  );
};

export default ColorPicker;
