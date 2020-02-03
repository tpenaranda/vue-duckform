<template>
  <ul class="df-radio df-list-unstyled df-mb-2">
    <li v-for="(answer, answerIndex) in value.possible_answers" :key="answer.id">
      <label class="df-row">
        <div class="df-selector df-py-1">
          <input type="radio"
            :disabled="disabled"
            :id="`A${answer.id}`"
            :name="`Q${value.id}`"
            @change="handleInputChange(answer.id)"
            :checked="selectedAnswerId === answer.id"
          >
          <span class="df-marker"></span>
        </div>
        <span class="df-pl-2 df-py-1">{{ answer.text }}</span>
      </label>
    </li>
    <validation-provider :rules="rules" v-slot="{ errors }" :name="value.text">
      <input type="text" v-model="value.possible_answers_selected" style="display: none;">
      <p class="df-td df-small">{{ errors.join(' ') }}</p>
    </validation-provider>
  </ul>
</template>

<script>
  import { required } from 'vee-validate/dist/rules'
  import { ValidationProvider, extend } from 'vee-validate'

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
        default: () => { return { possible_answers: [], possible_answers_selected: [] } }
      },
    },
    computed: {
      rules () {
        return this.value.required ? 'required' : null
      },
      selectedAnswerId () {
        if (!this.value.possible_answers_selected[0]) {
          return null
        }

        return this.value.possible_answers_selected[0].id
      }
    },
    methods: {
      handleInputChange (id) {
        this.value.possible_answers_selected = [{id: id, data: null}]
        this.$emit('input', this.value)
      }
    }
  }
</script>
