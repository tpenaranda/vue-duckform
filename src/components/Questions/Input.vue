<template>
  <label>
    <div class="df-input">
      <validation-provider :rules="rules.join('|')" :name="value.text" v-slot="slotProps">
        <div class="df-row">
          <input type="text" class="df-w-100"
            :disabled="disabled"
            :id="value.possible_answers[0].id"
            :name="`A${value.possible_answers[0].id}`"
            v-model.trim="inputText"
            @input="handleInputChange()"
          >
          <p v-if="value.possible_answers[0].text" class="df-label df-pl-1" style="padding-top: 2px; white-space: nowrap;">[{{ value.possible_answers[0].text }}]</p>
        </div>
        <p class="df-small df-td df-mb-0">{{ slotProps.errors.join(' ') }}</p>
      </validation-provider>
    </div>
  </label>
</template>

<script>
import { integer, required } from 'vee-validate/dist/rules'
import { ValidationProvider, extend } from 'vee-validate'

extend('integer', {
  ...integer,
  message: 'Field must be an integer.'
})
extend('required', {
  ...required,
  message: 'Field is required.'
})

export default {
  components: { ValidationProvider },
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
  data: () => ({
    rules: [],
    inputText: null
  }),
  created () {
    if (this.value.type === 'integer') {
      this.rules.push('integer')
    }

    if (this.value.required) {
      this.rules.push('required')
    }

    if (!this.value.possible_answers_selected[0]) {
      this.value.possible_answers_selected = [{ id: this.value.possible_answers[0].id, data: null }]
    }

    this.inputText = this.value.possible_answers_selected[0].data
  },
  methods: {
    handleInputChange () {
      this.value.possible_answers_selected[0].data = this.inputText
      this.$emit('input', this.value)
    }
  }
}
</script>
