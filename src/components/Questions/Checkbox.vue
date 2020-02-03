<template>
  <ul class="df-checkbox df-list-unstyled">
    <li v-for="(answer, answerIndex) in value.possible_answers" :key="answer.id">
      <label class="df-row">
        <div class="df-selector df-py-1">
          <input type="checkbox"
            :checked="isSelected(answer.id)"
            :disabled="disabled"
            :id="`A${answer.id}`"
            :name="`Q${value.id}`"
            @change="handleInputChange(answer.id)"
          >
          <span class="df-marker"><img src="./../../assets/images/check.png" class="df-icon"></span>
        </div>
        <span v-if="answer.text.toLowerCase() === 'other' && isSelected(answer.id)" class="df-input">
          <input class="df-ml-2" type="text" v-model="otherText" @input="setAnswerData(answer.id, otherText)">
        </span>
        <span v-else class="df-label df-pl-2 df-py-1">{{ answer.text }}</span>
      </label>
    </li>
      <validation-provider :rules="value.required ? 'required' : null" v-slot="{ errors }" :name="value.text">
        <input type="text" v-model="value.possible_answers_selected" style="display: none;">
        <p class="df-small df-td">{{ errors.join(' ') }}</p>
      </validation-provider>
      <validation-provider :rules="getOtherAnswerSelected() ? 'required' : null" v-slot="{ errors }" :name="`${value.text} (Specify)`" :custom-messages="{required: 'Please specify'}" immediate>
        <input type="text" v-model="otherText" style="display: none;">
        <p class="df-small df-td">{{ errors.join(' ') }}</p>
      </validation-provider>
  </ul>
</template>

<script>
  import { ValidationProvider, extend } from 'vee-validate'
  import { required } from 'vee-validate/dist/rules'

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
    data () {
      return {
        otherText: null,
        selectedAnswers: []
      }
    },
    created () {
      const otherAnswerSelected = this.getOtherAnswerSelected()

      if (otherAnswerSelected) {
        this.otherText = otherAnswerSelected.data
      }
    },
    methods: {
      getOtherAnswerSelected () {
        const otherAnswer = this.value.possible_answers.find(i => i.text.toLowerCase() === 'other')

        if (!otherAnswer) {
          return null
        }

        return this.value.possible_answers_selected.find(i => i.id === otherAnswer.id)
      },
      isSelected(id) {
        return this.value.possible_answers_selected.find(i => i.id === id)
      },
      setAnswerData (id, data) {
        this.value.possible_answers_selected = this.value.possible_answers_selected.filter(i => i.id !== id).concat({ id: id, data: data })
      },
      handleInputChange (id, data = null) {
        if (this.isSelected(id)) {

          const answer = this.value.possible_answers.find(i => i.id === id)

          if (answer && answer.text.toLowerCase() === 'other') {
            this.otherText = null
          }

          this.value.possible_answers_selected = this.value.possible_answers_selected.filter(o => o.id !== id)
        } else {
          this.value.possible_answers_selected = this.value.possible_answers_selected.concat({ id: id, data: data })
        }

        this.$emit('input', this.value)
      }
    }
  }
</script>
