import { useState, useEffect } from 'react';

function useLazyParams(first = 0, rows = 10, page = 1, getResource, setPage) {
  let loadLazyTimeout = null;
  const [lazyParams, setLazyParams] = useState({
    first,
    rows,
    page,
  });

  useEffect(() => {
    loadLazyData();
  }, [lazyParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLazyData = async () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    await getResource(lazyParams);
    setPage(lazyParams.page);
  };

  return [lazyParams, setLazyParams];
}

export default useLazyParams;
