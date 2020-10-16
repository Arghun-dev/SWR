# SWR

`SWR` is a React Hooks library for remote data fetching

**SWR is a strategy to first return the data from cache (stale), then send the fetch request (revalidate), and finally come with the up-to-date data.**

**With SWR, components will get a stream of data updates `constantly` and `automatically`.
And the UI will be always `fast` and `reactive`.**

**it will show you the cached version of data if it has it, and in the background it's going to fetch the new version once it gets it, it has a lot of built in support, for example `suspense`**


## Overview

```js
import useSWR from 'swr'
function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

In this example, the `useSWR` hook accepts a `key string` and a `fetcher function`. `key` is a unique identifier of the data `(normally the API URL)` and will be passed to `fetcher`. `fetcher can be any asynchronous function` which returns the `data`, you can use the native fetch or tools like `Axios`.

The hook returns 2 values: `data` and `error`, based on the status of the request.
