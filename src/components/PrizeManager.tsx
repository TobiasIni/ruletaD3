'use client';

import React, { useState } from 'react';
import { Prize } from '@/types';

interface PrizeManagerProps {
  prizes: Prize[];
  onPrizesChange: (prizes: Prize[]) => void;
}

const PrizeManager: React.FC<PrizeManagerProps> = ({ prizes, onPrizesChange }) => {
  const [newPrizeText, setNewPrizeText] = useState('');
  const [newPrizeColor, setNewPrizeColor] = useState('#FF6B6B');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editColor, setEditColor] = useState('');

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A24', '#0984e3', '#6c5ce7', '#a29bfe'
  ];

  const addPrize = () => {
    if (newPrizeText.trim()) {
      const newPrize: Prize = {
        id: Date.now().toString(),
        text: newPrizeText.trim(),
        color: newPrizeColor,
      };
      onPrizesChange([...prizes, newPrize]);
      setNewPrizeText('');
      setNewPrizeColor(colors[Math.floor(Math.random() * colors.length)]);
    }
  };

  const removePrize = (id: string) => {
    onPrizesChange(prizes.filter(prize => prize.id !== id));
  };

  const startEdit = (prize: Prize) => {
    setEditingId(prize.id);
    setEditText(prize.text);
    setEditColor(prize.color);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onPrizesChange(
        prizes.map(prize =>
          prize.id === editingId
            ? { ...prize, text: editText.trim(), color: editColor }
            : prize
        )
      );
      setEditingId(null);
      setEditText('');
      setEditColor('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditColor('');
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl p-6 border border-yellow-500/30 backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4 text-yellow-400 font-serif">Gestionar Premios</h3>
      
      {/* Add new prize */}
      <div className="mb-6">
        <div className="flex flex-col space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newPrizeText}
              onChange={(e) => setNewPrizeText(e.target.value)}
              placeholder="Nuevo premio..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-yellow-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && addPrize()}
            />
            <input
              type="color"
              value={newPrizeColor}
              onChange={(e) => setNewPrizeColor(e.target.value)}
              className="w-12 h-10 border border-yellow-500/50 rounded-md cursor-pointer bg-gray-800"
            />
          </div>
          <button
            onClick={addPrize}
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-2 px-4 rounded-md hover:from-yellow-500 hover:to-yellow-400 transition-all transform hover:scale-105 border border-yellow-400"
          >
            Agregar Premio
          </button>
        </div>
      </div>

      {/* Prize list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {prizes.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No hay premios agregados</p>
        ) : (
          prizes.map((prize) => (
            <div
              key={prize.id}
              className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-colors"
            >
              {editingId === prize.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-800"
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  />
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    ✗
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: prize.color }}
                  ></div>
                  <span className="flex-1 text-sm text-gray-800 truncate">
                    {prize.text}
                  </span>
                  <button
                    onClick={() => startEdit(prize)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => removePrize(prize.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick add buttons */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Premios sugeridos:</p>
        <div className="flex flex-wrap gap-2">
          {['$100', '$50', '$20', '$10', 'JACKPOT!', 'Inténtalo de nuevo'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                const color = colors[Math.floor(Math.random() * colors.length)];
                const newPrize: Prize = {
                  id: Date.now().toString() + Math.random(),
                  text: suggestion,
                  color: color,
                };
                onPrizesChange([...prizes, newPrize]);
              }}
              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrizeManager;
