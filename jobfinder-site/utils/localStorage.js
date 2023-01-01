function set(key, value) {
    self.localStorage.setItem(key, value);
  }
  
  function get(key) {
    return self.localStorage.getItem(key);
  }
  
  function drop(key) {
    self.localStorage.removeItem(key);
  }
  
  export default { set, get, drop };
  