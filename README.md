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

## Getting Started


### Installation

`$. yarn add swr`


### Quick Start

**For normal RESTful APIs with JSON data, first you need to create a `fetcher` function, which is just a wrapper of the native fetch:**

```js
const fetcher = (...args) => fetch(...args).then(res => res.json())
```

If you want to use `GraphQL API` or libs like `Axios`, you can create your own fetcher function. We will tell later in this text file.

Then you can import `useSWR` and start using it inside any function components:

```js
import useSWR from 'swr'

function Profile () {
  const { data, error } = useSWR('/api/user/123', fetcher)
  
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  
  // render data
  return <div>hello {data.name}!</div>
}
```

**Normally, there're `3` possible states of a request: `"loading"`, `"ready"`, or `"error"`. You can use the value of data and error to determine the current state of the request, and return the corresponding UI.**

### Make It Reusable

When building a web app, you might need to reuse the data in `many places of the UI`. It is incredibly easy to create reusable data hooks on top of `SWR`

```js
function useUser (id) {
  const { data, error } = useSWR(`/api/user/${id}`, fetcher)
  return {
    user: data,
    isLoading: !error && !data,
    isError: error
  }
}
```

And use it in your components:

```js
function Avatar ({ id }) {
  const { user, isLoading, isError } = useUser(id)
  if (isLoading) return <Spinner />
  if (isError) return <Error />
  return <img src={user.avatar} />
}
```

By adopting this pattern, you can forget about **fetching** data in the imperative way: start the request, update the loading state, and return the final result. Instead, your code is more declarative: you just need to specify what data is used by the component.


### Example

In a real-world example, our website shows a navbar and the content, both depend on user

Traditionally, we fetch data once using useEffect in the top level component, and pass it to child components via props (notice that we don't handle error state for now)

```js
// page component
function Page () {
  const [user, setUser] = useState(null)
  // fetch data
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])
  // global loading state
  if (!user) return <Spinner/>
  return <div>
    <Navbar user={user} />
    <Content user={user} />
  </div>
}

// child components
function Navbar ({ user }) {
  return <div>
    ...
    <Avatar user={user} />
  </div>
}

function Content ({ user }) {
  return <h1>Welcome back, {user.name}</h1>
}

function Avatar ({ user }) {
  return <img src={user.avatar} alt={user.name} />
}
```

Usually, we need to keep all the data fetching in the top level component and add props to every component deep down the tree. The code will become harder to maintain if we add more data dependency to the page.

Although we can avoid passing props using Context, there's still the dynamic content problem: components inside the page content can be dynamic, and the top level component might not know what data will be needed by its child components.

**SWR solves the problem perfectly. With the useUser hook we just created, the code can be refactored to:**

```js
// page component
function Page () {
  return <div>
    <Navbar />
    <Content />
  </div>
}

// child components
function Navbar () {
  return <div>
    ...
    <Avatar />
  </div>
}

function Content () {
  const { user, isLoading } = useUser()
  if (isLoading) return <Spinner />
  return <h1>Welcome back, {user.name}</h1>
}

function Avatar () {
  const { user, isLoading } = useUser()
  if (isLoading) return <Spinner />
  return <img src={user.avatar} alt={user.name} />
}
```

**Data is now bound to the components which need the data, and all components are independent to each other. All the parent components don't need to know anything about the data or passing data around. They just render. The code is much simpler and easier to maintain now.**

**The most beautiful thing is that there will be only `1 request` sent to the API, because they use the same `SWR key` and the request is `deduped`, `cached` and `shared` automatically.**

**Also, the application now has the ability to `refetch` the data on user focus or network reconnect! That means, when the user's laptop wakes from sleep or they switch between browser tabs, the data will be refreshed automatically.**



## API Options

`const { data, error, isValidating, mutate } = useSWR(key, fetcher, options)`


### Parameters

. `key`: a unique key string for the request (or a function / array / null)
. `fetcher`: (optional) a Promise returning function to fetch your data
. `options`: (optional) an object of options for this SWR hook

### Return Values

. `data`: data for the given key resolved by fetcher (or undefined if not loaded)
. `error`: error thrown by fetcher (or undefined)
. `isValidating`: if there's a request or revalidation loading
. `mutate(data?, shouldRevalidate?)`: function to mutate the cached data

### Options

. `suspense = false`: enable React Suspense mode
. `fetcher = undefined`: the fetcher function
. `initialData`: initial data to be returned (note: This is per-hook)
. `revalidateOnMount`: enable or disable automatic revalidation when component is mounted (by default revalidation occurs on mount when initialData is not set, use this flag to force behavior)
. `revalidateOnFocus = true`: auto revalidate when window gets focused
. `revalidateOnReconnect = true`: automatically revalidate when the browser regains a network connection (via navigator.onLine)
. `refreshInterval = 0`: polling interval (disabled by default)
. `refreshWhenHidden = false`: polling when the window is invisible (if `refreshInterval` is `enabled`)
. `refreshWhenOffline = false`: polling when the browser is offline (determined by navigator.onLine)
. `shouldRetryOnError = true`: retry when fetcher has an error
. `dedupingInterval = 2000`: dedupe requests with the same key in this time span
. `focusThrottleInterval = 5000`: only revalidate once during a time span
. `loadingTimeout = 3000`: timeout to trigger the onLoadingSlow event
. `errorRetryInterval = 5000`: error retry interval
. `errorRetryCount`: max error retry count
. `onLoadingSlow(key, config)`: callback function when a request takes too long to load (see loadingTimeout)
. `onSuccess(data, key, config)`: callback function when a request finishes successfully
. `onError(err, key, config)`: callback function when a request returns an error
. `onErrorRetry(err, key, config, revalidate, revalidateOps)`: handler for error retry
. `compare(a, b)`: comparison function used to detect when returned data has changed, to avoid spurious rerenders. By default, fast-deep-equal is used.

**When under a slow network (2G, <= 70Kbps), errorRetryInterval will be `10s`, and loadingTimeout will be `5s` by default.**

**You can also use global configuration to provide default options.**

## Global Configuration

The context `SWRConfig` can provide global configurations (options) for all SWR hooks.

```js
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

In this example, all SWR hooks will use the same fetcher provided to load JSON data, and refresh every 3 seconds by default:

```js
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // override
  // ...
}

function App () {
  return (
    <SWRConfig 
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Dashboard />
    </SWRConfig>
  )
}
```

## Data Fetching

```js
{ data, error } = useSWR(key, fetcher)
```

**This is the very fundamental API of SWR. The fetcher here is an async function that **accepts the `key` of SWR**, and returns the data.**

The returned value will be passed as `data`, and if it throws, it will be caught as `error`

**Note that fetcher can be omitted from the parameters if it's provided globally.**


### Fetch

You can use any library to handle data fetching, for example a fetch `polyfill` developit/unfetch:

```js
import fetch from 'unfetch'

const fetcher = url => fetch(url).then(r => r.json())

function App () {
  const { data, error } = useSWR('/api/data', fetcher)
  // ...
}
```

**If you are using Next.js, you don't need to import this polyfill:**


### Axios

```js
import axios from 'axios'

const fetcher = url => axios.get(url).then(res => res.data)

function App () {
  const { data, error } = useSWR('/api/data', fetcher)
  // ...
}
```

### GraphQl

Or using GraphQL with libs like `graphql-request`:

```js
import { request } from 'graphql-request'

const fetcher = query => request('https://api.graph.cool/simple/v1/movies', query)

function App () {
  const { data, error } = useSWR(
    `{
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }`,
    fetcher
  )
  // ...
}
```

## Error Handling

If an `error` is thrown inside fetcher, it will be returned as error by the hook.

```js
const fetcher = url => fetch(url).then(r => r.json())
// ...

const { data, error } = useSWR('/api/user', fetcher)
```

The error object will be defined if the fetch promise is rejected.

### Status Code and Error Object

Sometimes we want an API to return an error object alongside the status code. Both of them are useful for the client.

We can customize our fetcher to return more information. If the status code is not 2xx, we consider it an error even if it can be parsed as JSON:

```js
const fetcher = async url => {
  const res = await fetch(url)
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  
  return await res.json()
}

// ...
const { data, error } = useSWR('/api/user', fetcher)
// error.info === {
//   message: "You are not authorized to access this resource.",
//   documentation_url: "..."
// }
// error.status === 403
```

**Note that data and error can exist at the same time. So the UI can display the existing data, while knowing the upcoming request has failed.**

### Error Retry

SWR uses the exponential backoff algorithm to retry the request on error. The algorithm allows the app to recover from errors quickly, but not waste resources retrying too often.

You can also override this behavior via the onErrorRetry option:

```js
useSWR('/api/user', fetcher, {
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
  
    // Never retry on 404.
    if (error.status === 404) return
    
    // Never retry for a specific key.
    if (key === '/api/user') return
    
    // Only retry up to 10 times.
    if (retryCount >= 10) return
    
    // Retry after 5 seconds.
    setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000)
  }
})
```

This callback gives you the flexibility to retry based on various conditions. You can also disable it by setting `shouldRetryOnError: false`
**It's also possible to provide it via the Global Configuration context.**

### Global Error Report

You can always get the error object inside the component reactively. But in case you want to handle the error globally, to notify the UI to show a toast or a snackbar, or report it somewhere such as Sentry, there's an onError event:

```js
<SWRConfig value={{
  onError: (error, key) => {
    if (error.status !== 403 && error.status !== 404) {
      // We can send the error to Sentry,
      // or show a notification UI.
    }
  }
}}>
  <MyApp />
</SWRConfig>
```


## Auto Revalidation

### Revalidate on Focus

When you re-focus a page or switch between tabs, SWR automatically revalidates data.

This can be useful to immediately synchronize to the latest state. This is helpful for refreshing data in scenarios like stale mobile tabs, or laptops that `went to sleep`.


### Revalidate on Interval

In many cases, data changes because of multiple devices, multiple users, multiple tabs. How can we over time update the data on screen?

SWR will give you the option to automatically refetch data. It’s smart which means refetching will only happen if the component associated with the hook is on screen.

You can enable it by setting a `refreshInterval` value:

```js
useSWR('/api/todos', fetcher, { refreshInterval: 1000 })
```

There're also options such as `refreshWhenHidden` and `refreshWhenOffline`. Both are disabled by default so SWR won't fetch when the webpage is not on screen, or there's no network connection.

### Revalidate on Reconnect

It's useful to also revalidate when the user is back online. This scenario happens a lot when the user unlocks their computer, but the internet is not yet connected at the same moment.

To make sure the data is always up-to-date, SWR automatically revalidates when network recovers.

This feature is enabled by default. You can disable it via the `revalidateOnReconnect` option.


## Conditional Data Fetching

### Conditional

Use null or pass a function as key to conditionally fetch data. If the function throws or returns a falsy value, SWR will not start the request.

```js
// conditionally fetch
const { data } = useSWR(shouldFetch ? '/api/data' : null, fetcher)

// ...or return a falsy value
const { data } = useSWR(() => shouldFetch ? '/api/data' : null, fetcher)

// ... or throw an error when user.id is not defined
const { data } = useSWR(() => '/api/data?uid=' + user.id, fetcher)
```

### Dependant

SWR also allows you to fetch data that depends on other data. It ensures the maximum possible parallelism (avoiding waterfalls), as well as serial fetching when a piece of dynamic data is required for the next data fetch to happen.

```js
function MyProjects () {
  const { data: user } = useSWR('/api/user')
  const { data: projects } = useSWR(() => '/api/projects?uid=' + user.id)
  
  // When passing a function, SWR will use the return
  // value as `key`. If the function throws or returns
  // falsy, SWR will know that some dependencies are not
  // ready. In this case `user.id` throws when `user`
  // isn't loaded.
  
  if (!projects) return 'loading...'
  return 'You have ' + projects.length + ' projects'
}
```

## Arguments

By default, `key` will be passed to `fetcher` as the argument. So the following 3 expressions are equivalent:

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

### Multiple

In some scenarios, it's useful pass multiple arguments (can be any value or object) to the fetcher function. For example an authorized fetch request:

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

This is **incorrect**. Because the identifier (also the cache key) of the data is '/api/user', so even if token changes, SWR will still use the same key and return the wrong data.

Instead, you can use an `array` as the key parameter, which contains multiple arguments of fetcher:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

The function `fetchWithToken` still accepts the same 2 arguments, but the cache key will also be associated with `token` now.


### Passing Objects

Say you have another function that fetches data with a user scope: `fetchWithUser(api, user)`. You can do the following:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
// ...and pass it as an argument to another query
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

The key of the request is now the combination of both values. SWR shallowly compares the arguments on every render, and triggers revalidation if any of them has changed.
Keep in mind that you should not recreate objects when rendering, as they will be treated as different objects on every render:

```js
// Don’t do this! Deps will be changed on every render.
useSWR(['/api/user', { id }], query)
// Instead, you should only pass “stable” values.
useSWR(['/api/user', id], (url, id) => query(url, { id }))
```


## Mutation

### Revalidate

You can broadcast a revalidation message globally to all SWRs with the same key by calling `mutate(key)`.

This example shows how to automatically refetch the login info (e.g.: inside <Profile/>) when the user clicks the “Logout” button.

```js
import useSWR, { mutate } from 'swr'
function App () {
  return (
    <div>
      <Profile />
      <button onClick={() => {
        // set the cookie as expired
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        // tell all SWRs with this key to revalidate
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

### Mutation and Post Request

In many cases, applying local mutations to data is a good way to make changes feel faster — no need to wait for the remote source of data.

With `mutate`, you can update your local data programmatically, while revalidating and finally replace it with the latest data.

```js
import useSWR, { mutate } from 'swr'
function Profile () {
  const { data } = useSWR('/api/user', fetcher)
  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        
        // update the local data immediately, but disable the revalidation
        mutate('/api/user', { ...data, name: newName }, false)
        
        // send a request to the API to update the source
        await requestUpdateUsername(newName)
        
        // trigger a revalidation (refetch) to make sure our local data is correct
        mutate('/api/user')
      }}>Uppercase my name!</button>
    </div>
  )
}
```

Clicking the button in the example above will send a POST request to modify the remote data, locally update the client data and try to fetch the latest one (revalidate).
