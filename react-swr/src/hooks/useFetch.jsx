import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const baseUrl = 'https://pokeapi.co/api/v2/'

const useFetch = (path, name) => {
  if (!path) {
    throw new Error('path is required!');
  }

  const url = name ? baseUrl + path + '/' + name : baseUrl + path;

  const { data, error } = useSWR(path ? url : null, fetcher);

  return {data, error};
}

export default useFetch;