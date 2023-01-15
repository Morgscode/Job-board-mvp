import { useState, useEffect } from 'react';

function useLazyParams(first, rows = 10, page, getResource, setPage) {
  let loadLazyTimeout = null;
  const [lazyParams, setLazyParams] = useState({
    first,
    rows,
    page,
    sortOrder: null,
    sortField: null,
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
