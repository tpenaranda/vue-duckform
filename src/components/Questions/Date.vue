<template>
  <div class="df-date">
    <validation-provider ref="validationProvider" :rules="{ required: value.required, regex: /^\d{2}-\d{2}-\d{4}$/ }" v-slot="{ errors }" :name="value.text" >
      <date-pick ref="datePicker"
        v-model="value.possible_answers_selected[0].data"
        :isDateDisabled="isFutureDate"
        :inputAttributes="{readonly: false}"
        :editable="!disabled"
        format="MM-DD-YYYY"
        @change="dateSelected">
      </date-pick>
      <p class="df-small df-td">{{ errors.join(' ') }}</p>
    </validation-provider>
  </div>
</template>

<script>
import 'vue-date-pick/dist/vueDatePick.css';
import DatePick from 'vue-date-pick';
import moment from 'moment';

import { regex, required } from 'vee-validate/dist/rules'
import { ValidationProvider, extend } from 'vee-validate'

extend('regex', {
  ...regex,
  message: "Field must match the 'MM-DD-YYYY' pattern."
})

extend('required', {
  ...required,
  message: 'Field is required.'
})

export default {
  components: {
    DatePick,
    ValidationProvider
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
      this.$refs.validationProvider.validate()
      this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: date }]
      this.$emit('input', this.value)
    }
  }
}
</script>
