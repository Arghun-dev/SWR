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


## Features

With just one single line of code, you can simplify the logic of data fetching in your project, and also have all these amazing features out-of-the-box:

. JAMstack oriented
. Fast, lightweight and reusable data fetching
. Built-in cache and request deduplication
. Real-time experience
. Transport and protocol agnostic
. TypeScript ready
. React Native

SWR has you covered in all aspects of `speed`, `correctness`, and `stability` to help you build better experiences:

. Fast page navigation
. Polling on interval
. Data dependency
. Revalidation on focus
. Revalidation on network recovery
. Local mutation (Optimistic UI)
. Smart error retry
. Pagination and scroll position recovery
. React Suspense



### Without SWRConfig
example: 

`$. yarn add swr`

```js
import React from 'react'
import SWR, { SWRConfig } from 'swr'

export default function App() {
  const url = 'https://jsonplaceholder.typicode.com/posts'
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(url, fetcher)
  
  if (error) {
    return <div>Error...</div>
  }
  
  if (!data) {
    return <div>Loading...</div>
  }
  
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

Now if you run the program you actually notice that the component render twice

**The first time which is rendering is the `stale data`**

**We first examine if we have an error or not, then we examine the data loaded or not, and finally if we are in the last line, we guarantee that we do not have an error, and data has been loaded successfully**



### With SWRConfig

```js
import React from 'react'
import useSWR, {SWRConfig} from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function App() {
  return (
    <SWRConfig value={{ fetcher }}>
      <Crimes />
    </SWRConfig>
  )
}

function Crimes() {
  const url = 'https://jsonplaceholder.typicode.com/posts'
  const { data, error } = useSWR(url)
  
  if (error) {
    return <div>error</div>
  }
  
  if (!data) {
    return <div>loading...</div>
  }
  
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
```

**in `SWR` every time you change the tab and then come back, the data is refreshing, that means if you change the browser tab and then come back it will refresh the page, now if you don't want this to happen, `SWR` has several options you can use, in this case `revalidateOnFocus`**

in this case I want `revalidateOnFocus to be false`

```js
<SWRConfig value={{ fetcher, revalidateOnFocuse: false }}>
  <Crimes />
</SWRConfig>
```
