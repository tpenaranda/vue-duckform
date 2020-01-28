<template>
  <label>
    <range-slider class="slider"
      min="1"
      :max="value.possible_answers.length"
      step="1"
      v-model="selectedId"
      :disabled="disabled">
    </range-slider>

    <div class="selection">
      <div class="w-25 small text-left">{{ value.possible_answers[0].text }}</div>
      <div class="w-50 text-center" style="">{{ selectedId }}</div>
      <div class="w-25 small text-right">{{ value.possible_answers[value.possible_answers.length - 1].text }}</div>
    </div>

    <validation-provider :rules="{ 'required': value.required }" v-slot="{ errors }" :name="value.text">
      <input type="text" v-model="value.possible_answers_selected[0].data" style="display: none;">
      <p class="text-danger small">{{ errors.join(' ') }}</p>
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
      }
    }
  }
}
</script>
<style lang="scss">
  .selection {
    display: flex;
  }
  .range-slider-inner {
    min-width: 80px;
  }
  .range-slider {
    box-sizing: border-box;
    display: block;
    height: 40px;
    margin-bottom: 10px;
    width: 100%;

    .range-slider-knob {
      background-color: #8ec0ed;
      border: none;
      height: 25px;
      width: 25px;
    }

    input[type="text"] {
      background: transparent;
      border: none;
      color: #004D50;
      cursor: default;
      font-size: 1rem;
      padding-top: 40px;
      text-align: center;
      user-select: none;
    }
    .range-slider-fill {
      background-color: #8ec0ed30;
      border-radius: 25px;
      height: 25px;
    }
    .range-slider-rail {
      background-color: #e7e9e730;
      border-radius: 25px;
      height: 25px;
    }
}
</style>
