function handleTotalPointData (data) {
  let chartData = []
  for (let key in data) {
    let oneData = {name: data[key].player.name, data: []}
    for (let k in data[key].dailyStats) {
      oneData.data.push({name: k, y: +data[key].dailyStats[k].totalPoints})
    }
    chartData.push(oneData)
  }
  return chartData
}

function handleBingoCountData (data) {
  let chartData = []
  for (let key in data) {
    let oneData = {name: data[key].player.name, data: []}
    for (let k in data[key].dailyStats) {
      oneData.data.push({name: k, y: +data[key].dailyStats[k].bingoCount})
    }
    chartData.push(oneData)
  }
  return chartData
}

function handleWinnerCountData (data) {
  let chartData = []
  for (let key in data) {
    let oneData = {name: data[key].player.name, data: []}
    for (let k in data[key].dailyStats) {
      oneData.data.push({name: k, y: +data[key].dailyStats[k].winnerCount})
    }
    chartData.push(oneData)
  }
  return chartData
}

function handleTotalScoreData (data) {
  let chartData = []
  for (let key in data) {
    let oneData = {name: data[key].player.name, data: []}
    for (let k in data[key].dailyStats) {
      oneData.data.push({name: k, y: +data[key].dailyStats[k].totalPoints})
    }
    chartData.push(oneData)
  }
  return chartData
}

export default {
  handleTotalPointData,
  handleBingoCountData,
  handleWinnerCountData,
  handleTotalScoreData
}
