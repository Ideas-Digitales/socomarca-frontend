'use client';

import { useState } from 'react';

const opcionesPrefijo = ['+569', '+56', '+562'];

export default function TelefonoInput({
  value,
  onChange,
  name,
  error,
  ...props
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, prefijo: string) => void;
  name?: string;
  error?: string;
  [key: string]: any;
}) {
  const [prefix, setPrefix] = useState('+569');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e, prefix);
  };

  return (
    <div>
      <label className="block font-medium">
        Teléfono<span className="text-red-400">*</span>
      </label>
      <div className="flex mt-1">
        <select
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          className="bg-[#EBEFF7] border border-gray-300 rounded-l px-2"
        >
          {opcionesPrefijo.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          className="w-full p-2 bg-[#EBEFF7] rounded-r border border-gray-300 border-l-0"
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
