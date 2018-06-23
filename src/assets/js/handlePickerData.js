function handlePicker (data) {
  if (!data || data.length === 0) {
    return []
  }
  let arr = []
  data.forEach(item => {
    arr.push(item.name)
  })
  return arr
}

export default {
  handlePicker
}
