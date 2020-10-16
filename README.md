# SWR

`SWR` is a React Hooks library for remote data fetching

**SWR is a strategy to first return the data from cache (stale), then send the fetch request (revalidate), and finally come with the up-to-date data.**

**With SWR, components will get a stream of data updates `constantly` and `automatically`.
And the UI will be always `fast` and `reactive`.**

**it will show you the cached version of data if it has it, and in the background it's going to fetch the new version once it gets it, it has a lot of built in support, for example `suspense`**
