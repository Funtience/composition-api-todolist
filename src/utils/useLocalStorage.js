function parse(str) {
  let value
  try {
    value = JSON.parse(str)
  } catch (error) {
    value = null
  }
  return value
}

function stringfy(obj) {
  let value
  try {
    value = JSON.stringify(obj)
  } catch (error) {
    value = null
  }
  return value
}

export default () => {
  function getItem(key) {
    let value = window.localStorage.getItem(key)
    if (value) {
      value = parse(value)
    }
    return value
  }

  function setItem(key, value) {
    window.localStorage.setItem(key, stringfy(value))
  }

  return {
    setItem,
    getItem,
  }
}
