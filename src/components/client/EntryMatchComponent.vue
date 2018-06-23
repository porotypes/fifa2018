<template>
  <section>
    <van-button type="primary" size="large" @click="showDialog()">添加比赛</van-button>

    <van-dialog
      v-model="isShowDialog"
      @confirm="saveMatch()"
      show-cancel-button>
      <van-field
        label="比赛时间"
        placeholder="比赛时间"
        v-model="selectedDate"
        disabled
        center>
        <van-button @click="openDateTimeModel" slot="button" size="small" type="primary">选择时间</van-button>
      </van-field>
      <van-field
        label="比赛类型"
        placeholder="比赛类型"
        v-model="selectedType"
        disabled
        center>
        <van-button @click="openTypeModel" slot="button" size="small" type="primary">选择类型</van-button>
      </van-field>
      <van-field
        label="主队"
        placeholder="主队"
        v-model="selectedHostTeam"
        disabled
        center>
        <van-button @click="openHostTeamModel" slot="button" size="small" type="primary">选择队伍</van-button>
      </van-field>
      <van-field
        label="客队"
        placeholder="客队"
        v-model="selectedGuestTeam"
        disabled
        center>
        <van-button @click="openGuestTeamModel" slot="button" size="small" type="primary">选择队伍</van-button>
      </van-field>
    </van-dialog>

    <van-popup v-model="isShowDateTime" position="bottom">
      <van-datetime-picker
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onSelectedDate($event)"
        @cancel="isShowDateTime = false"/>
    </van-popup>

    <van-popup v-model="isShowType" position="bottom">
      <van-picker :columns="matchTypes" show-toolbar @confirm="onSelectedType($event)"/>
    </van-popup>

    <van-popup v-model="isShowHostTeam" position="bottom">
      <van-picker :columns="matchTeams" show-toolbar @confirm="onSelectedHostTeam($event)"/>
    </van-popup>

    <van-popup v-model="isShowGuestTeam" position="bottom">
      <van-picker :columns="matchTeams" show-toolbar @confirm="onSelectedGuestTeam($event)"/>
    </van-popup>
  </section>
</template>

<script>
import { Toast } from 'vant'
import matchService from '@/assets/js/matchService'
import matchTypeService from '@/assets/js/matchTypeService'
import matchTeamService from '@/assets/js/matchTeamService'
import dateTimeUtil from '@/assets/js/dateTimeUtil'
import handlePickerData from '@/assets/js/handlePickerData'
export default {
  name: 'EntryMatchComponent',
  data () {
    return {
      matchTypes: [],
      matchTeams: [],
      isShowDialog: false,
      isShowDateTime: false,
      isShowType: false,
      isShowHostTeam: false,
      isShowGuestTeam: false,
      selectedDate: '',
      selectedType: '',
      selectedTypeId: null,
      selectedHostTeam: '',
      selectedHostTeamId: null,
      selectedGuestTeam: '',
      selectedGuestTeamId: null,
      minDate: new Date(2018, 5, 1),
      maxDate: new Date(2018, 6, 31),
      isSaving: false
    }
  },
  methods: {
    getMatchTypes () {
      matchTypeService.getMatchTypes().then(res => {
        this.matchTypes = handlePickerData.handlePicker(res)
      })
    },
    getMatchTeams () {
      matchTeamService.getMatchTeams().then(res => {
        this.matchTeams = handlePickerData.handlePicker(res)
      })
    },
    showDialog () {
      this.getMatchTypes()
      this.getMatchTeams()
      this.isShowDialog = true
    },
    openDateTimeModel () {
      this.isShowDateTime = true
    },
    onSelectedDate (val) {
      this.selectedDate = dateTimeUtil.getDateString(val)
      this.isShowDateTime = false
    },
    openTypeModel () {
      this.isShowType = true
    },
    onSelectedType (val) {
      for (let i = 0; i < this.matchTypes.length; i++) {
        if (this.matchTypes[i] === val) {
          this.selectedTypeId = i + 1
        }
      }
      this.selectedType = val
      this.isShowType = false
    },
    openHostTeamModel () {
      this.isShowHostTeam = true
    },
    onSelectedHostTeam (val) {
      for (let i = 0; i < this.matchTeams.length; i++) {
        if (this.matchTeams[i] === val) {
          this.selectedHostTeamId = i + 1
        }
      }
      this.selectedHostTeam = val
      this.isShowHostTeam = false
    },
    openGuestTeamModel () {
      this.isShowGuestTeam = true
    },
    onSelectedGuestTeam (val) {
      for (let i = 0; i < this.matchTeams.length; i++) {
        if (this.matchTeams[i] === val) {
          this.selectedGuestTeamId = i + 1
        }
      }
      this.selectedGuestTeam = val
      this.isShowGuestTeam = false
    },
    saveMatch () {
      if (this.isSaving) {
        return
      }
      if (!this.selectedDate || !this.selectedTypeId || !this.selectedHostTeamId || !this.selectedGuestTeamId) {
        Toast.error({message: '请填写完整的数据'})
        return
      }
      Toast.loading({message: '保存中...'})
      this.isSaving = true
      let match = {
        'startTime': this.selectedDate,
        'type': this.selectedTypeId,
        'hostTeam': this.selectedHostTeamId,
        'guestTeam': this.selectedGuestTeamId
      }
      matchService.entryMatch(match).then(res => {
        this.isSaving = false
        Toast.success({message: '保存成功'})
      })
    }
  }
}
</script>

<style>

</style>
