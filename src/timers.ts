let id = 0
const intervals = new Map<number, Worker>()

// Most browsers will defer setInterval events if the tab is not active. This uses a Worker make it more reliable.
export function setInterval(fn: () => void, interval: number) {
  const blob = new Blob([`(${workerFn.toString()})(${interval})`], { type: 'application/javascript' })
  const worker = new Worker(URL.createObjectURL(blob))
  worker.onmessage = () => fn()
  intervals.set(++id, worker)
  return id
}

export function clearInterval(id: number | undefined) {
  if (!id || !intervals.get(id)) return

  intervals.get(id)!.terminate()
  intervals.delete(id!)
}


// This function gets serialized into a Blob and run in a Worker
const workerFn = (interval: number) => setInterval(() => postMessage(null), interval)
