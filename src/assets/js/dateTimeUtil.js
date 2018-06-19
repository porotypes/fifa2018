function getDateString (date) {
  if (!date) {
    return ''
  }
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getDateTimeString (date) {
  if (!date) {
    return ''
  }
  let day = date.split('T')[0]
  let time = date.split('T')[1].split('+')[0]
  return `${day} ${time}`
}

export default {
  getDateString,
  getDateTimeString
}
