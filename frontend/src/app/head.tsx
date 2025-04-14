'use client';

import { useEffect } from 'react';

export default function Head() {
  useEffect(() => {
    // Define o título da página explicitamente
    document.title = 'FoodMatch';
  }, []);

  return null;
}