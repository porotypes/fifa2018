<template>
  <div class="rule">
    <div class="rule-item">
      <h1>竞猜规则</h1>
      <p>
        1. 世界杯举行期间，每场比赛开始前可以在下注页进行比分竞猜;<br>
        2. 比赛开始后，可以在已开赛页面看到每场比赛的竞猜结果(包括每个人的竞猜比分);<br>
        3. 比赛结束后，由管理员录入比分后，可看到每个人的得分情况;<br>
        4. 淘汰赛竞猜比分以最终比分为准，即：如有加时赛或点球大战，以最后总得分为准;<br>
        5. 排名页会统计出当前所有人的得分排名。
      </p>
    </div>

    <div class="rule-item">
      <h1>积分规则</h1>
      <p>
        1. 每场比赛结束后，根据比分，猜中输赢得 1 积分，猜中比分得 3 积分;<br>
        2. 每场比赛猜中比分(即得到3积分)，可以领取小礼物(如: 饮料)一份;<br>
        3. 世界杯全部比赛结束后，根据积分排名，可以得到最后的礼品大奖。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rule'
}
</script>

<style>
.rule {
  padding: 2rem;
}
.rule-item {
  margin: 2rem 0;
}
.rule-item h1 {
  margin-bottom: 1rem;
}
.rule p {
  font-size: 16px;
  text-align: left;
}
</style>
