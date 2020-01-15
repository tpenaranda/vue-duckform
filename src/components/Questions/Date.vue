<template>
  <div class="input">
    <date-pick ref="datePicker"
      v-model="value.possible_answers_selected[0].data"
      :isDateDisabled="isFutureDate"
      :inputAttributes="{readonly: false}"
      :editable="!disabled"
      format="MM-DD-YYYY"
      @input="dateSelected">
    </date-pick>
  </div>
</template>

<script>
import 'vue-date-pick/dist/vueDatePick.css';
import DatePick from 'vue-date-pick';
import moment from 'moment';

export default {
  components: {
    DatePick
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => { return { possible_answers: [{}], possible_answers_selected: [] } }
    },
  },
  created () {
    if (!this.value.possible_answers_selected[0]) {
      this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: null }]
    }
  },
  methods: {
    isFutureDate (date) {
      return moment(date).isAfter(moment().subtract(1, 'day'))
    },
    dateSelected(date) {
      this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: date }]
    }
  }
}
</script>

<style lang="scss">
  .vdpClearInput {
    display: none;
  }
  .vdpCellContent {
    font-size: 13px;
  }
  .vdpComponent input {
    font-size: 16px;
  }
</style>
