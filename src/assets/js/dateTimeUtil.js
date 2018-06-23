function getDateString (date) {
  if (!date) {
    return ''
  }
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getHours() + 1)
  let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
  let hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  let minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:00`
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
