import { useState, useEffect } from 'react';

export default function useActiveState(ref) {
    const [active, setActive] = useState(false);
    useEffect(() => {
      if (active) {
        ref.current?.classList?.remove('hidden');
      } else {
        ref.current?.classList?.add('hidden');
      }
    }, [active]);

    return [active, setActive];
}