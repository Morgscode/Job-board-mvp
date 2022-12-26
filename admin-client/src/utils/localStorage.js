function set(key, value) {
  window.localStorage.setItem(key, value);
}

function get(key) {
  return window.localStorage.getItem(key);
}

function drop(key) {
  window.localStorage.removeItem(key);
}

export default { set, get, drop };
