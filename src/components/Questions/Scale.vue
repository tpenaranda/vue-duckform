<template>
  <label class="df-scale">
    <range-slider
      :disabled="disabled"
      :max="value.possible_answers.length"
      min="1"
      step="1"
      v-model="selectedId">
    </range-slider>
    <div class="df-selection">
      <div class="df-w-25 df-small df-tl">{{ value.possible_answers[0].text }}</div>
      <div class="df-w-50 df-tc" style="">{{ selectedId }}</div>
      <div class="df-w-25 df-small df-tr">{{ value.possible_answers[value.possible_answers.length - 1].text }}</div>
    </div>
    <validation-provider :rules="{ 'required': value.required }" v-slot="{ errors }" :name="value.text">
      <input type="text" v-model="value.possible_answers_selected[0].data" style="display: none;">
      <p class="df-td df-small">{{ errors.join(' ') }}</p>
    </validation-provider>
  </label>
</template>

<script>
import RangeSlider from 'vue-range-slider'
import { integer, required } from 'vee-validate/dist/rules'
import { ValidationProvider, extend } from 'vee-validate'

import 'vue-range-slider/dist/vue-range-slider.css'

extend('required', {
  ...required,
  message: 'Field is required.'
})

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => { return { possible_answers: [], possible_answers_selected: [] } }
    },
  },
  created () {
    if (!this.value.possible_answers_selected[0]) {
      const centerIndex = Math.ceil(this.value.possible_answers.length / 2) - 1
      this.value.possible_answers_selected = [{ id: this.value.possible_answers[centerIndex].id, data: null }]
    }
  },
  components: {
    RangeSlider,
    ValidationProvider
  },
  computed: {
    selectedId: {
      get () {
        return this.value.possible_answers.findIndex((item) => item.id === this.value.possible_answers_selected[0].id) + 1
      },
      set (val) {
        this.value.possible_answers_selected = [{ id: this.value.possible_answers[val - 1].id, data: true }]
        this.$emit('input', this.value)
      }
    }
  }
}
</script>
