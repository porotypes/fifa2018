<template>
  <section class="match">
    <h4 class="title">{{ transferTime(bet.match.startTime) }}</h4>
    <p class="match-type">{{ bet.match.type.name }}</p>

    <div class="match-content">
      <div class="team">
        <span class="team-name">
          <img :src="'/static/flag/' + bet.match.hostTeam.flag">
          {{ bet.match.hostTeam.name }}({{ bet.match.hostTeam.fifaGroup }})
        </span>
        <span style="float: left;width: 20%;text-align: center;">-</span>
        <span>
          {{ bet.match.guestTeam.name }}({{ bet.match.guestTeam.fifaGroup }})
          <img :src="'/static/flag/' + bet.match.guestTeam.flag">
        </span>
      </div>
      <div class="score">
        <span class="number">
          {{ bet.hostScore }}
          <i>({{ bet.match.hostScore }})</i>
        </span>
        <span>:</span>
        <span class="number">
          {{ bet.guestScore }}
          <i>({{ bet.match.guestScore }})</i>
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import dateTimeUtil from '@/assets/js/dateTimeUtil'
export default {
  name: 'HistoryBetComponent',
  props: ['bet'],
  data () {
    return {}
  },
  methods: {
    transferTime (date) {
      return dateTimeUtil.getDateTimeString(date)
    }
  }
}
</script>

<style>
.match {
  position: relative;
  padding: 1rem;
  width: 100%;
  border-bottom: 1px dotted #ccc;
}
.match:last-child {
  border: none;
}
.match .title {
  font-size: 25px;
}
.match .match-type {
  font-size: 14px;
}
.match .match-content {
  margin-top: 1rem;
  width: 100%;
  font-size: 17px;
  color: #444;
}
.match .match-content span.team-name {
  float: left;
  width: 40%;
  text-align: center;
}
.match .match-content span.team-name:last-child {
  float: right;
  text-align: right;
}
.match .match-content img {
  width: 2rem;
  height: 2rem;
  vertical-align: text-top;
}
.match .match-content .score {
  margin-top: 2rem;
  width: 100%;
  font-size: 34px;
  overflow: hidden;
}
.match .match-content .score span {
  float: left;
  width: 20%;
}
.match .match-content .score i {
  font-style: normal;
}
.match .match-content .score span.number {
  width: 40%;
}
</style>
