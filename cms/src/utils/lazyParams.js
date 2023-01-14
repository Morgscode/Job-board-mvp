import { useState, useEffect } from 'react';

function useLazyParams(first, page, getResource, setPage) {
  let loadLazyTimeout = null;
  const [lazyParams, setLazyParams] = useState({
    first,
    rows: 10,
    page,
    sortOrder: null,
    sortField: null,
  });

  useEffect(() => {
    loadLazyData();
  }, [lazyParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLazyData = () => {
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }

    //imitate delay of a backend call
    loadLazyTimeout = setTimeout(async () => {
      await getResource(lazyParams.page);
      setPage(lazyParams.page);
    }, 300);
  };

  return [lazyParams, setLazyParams];
}

export default useLazyParams;
