const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const nowTime = date=>{
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
}

//获取今年
const year = date => {
  const year = date.getFullYear()
  return [year].map(formatNumber) + '年'
}

//获取今天
const formatDate = date => {
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [month].map(formatNumber) + '月' + [day].map(formatNumber) + '日'
}
//获取明天
const tomorrowDate = date => {
  const month = date.getMonth() + 1
  const day = date.getDate() + 1

  return [month].map(formatNumber) + '月' + [day].map(formatNumber) + '日'
}
const aftertomorrowDate = date => {
  const month = date.getMonth() + 1
  const day = date.getDate() + 2

  return [month].map(formatNumber) + '月' + [day].map(formatNumber) + '日'
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  nowTime:nowTime,
  formatTime: formatTime,
  year:year,
  formatDate: formatDate,
  tomorrowDate: tomorrowDate,
  aftertomorrowDate: aftertomorrowDate
}