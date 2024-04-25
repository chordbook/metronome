// The number of milliseconds that this client's clock is offset from the server's clock.
export let offset = 0;
let delay = Infinity;

// the NTP algorithm
// t0 - client's timestamp of the request packet transmission,
// t1 - server's timestamp of the request packet reception,
// t2 - server's timestamp of the response packet transmission and
// t3 - client's timestamp of the response packet reception.
export function ntp(t0, t1, t2, t3) {
  return {
    delay: (t3 - t0) - (t2 - t1),
    offset: ((t1 - t0) + (t2 - t3)) / 2
  };
}

export async function sync () {
  const t0 = Date.now()
  const response = await fetch('https://clock.zone/_/_offset')
  const t3 = Date.now()
  const { val } = await response.json();

  const latest = ntp(t0, val, val, t3)

  if(latest.delay < delay) {
    offset = latest.offset
    delay = latest.delay
  }

  return offset
}

export function now() {
  return Date.now() + offset;
}
