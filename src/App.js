import React from 'react';
import './App.css';
import useSWR, { SWRConfig } from 'swr'

function App() {
  const url = 'https://jsonplaceholder.typicode.com/posts'
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(url, fetcher)

  if (error) {
    return <div>Error</div>
  }

  if (!data) {
    return <div>loading...</div>
  }

  return (
    <pre className="App">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default App;
