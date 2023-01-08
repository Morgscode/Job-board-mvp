import { useState, useEffect } from 'react';

function useFetchResource(resource_id, schema, service) {
  const [fetchedResource, setFetchedResource] = useState(false);
  const [resource, setResource] = useState({ ...schema });
  useEffect(() => {
    async function getResource(resource_id) {
      const resource = await service.find(resource_id);

      if (!resource) {
        getResource(resource_id);
      }
      setResource(resource);
      setFetchedResource(true);
    }
    if (!fetchedResource) {
      getResource(resource_id);
    }
  }, [fetchedResource, resource]);

  return resource;
}

export default useFetchResource;
 