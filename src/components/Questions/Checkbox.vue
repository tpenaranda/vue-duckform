<template>
  <ul class="list-unstyled" :class="`_${value.type}`">
    <li v-for="(answer, answerIndex) in value.possible_answers" :key="answer.id">
      <label class="row">
        <div class="selector py-1">
          <input type="checkbox"
            :checked="isSelected(answer.id)"
            :disabled="disabled"
            :id="`A${answer.id}`"
            :name="`Q${value.id}`"
            @change="handleInputChange(answer.id)"
          >
          <span class="marker checkbox"><img src="./../../assets/images/check.png" class="icon"></span>
        </div>
        <span v-if="answer.text.toLowerCase() === 'other' && isSelected(answer.id)" class="input">
          <input class="ml-2" type="text" v-model="otherText" @input="setAnswerData(answer.id, otherText)">
        </span>
        <span v-else class="label pl-2 py-1">{{ answer.text }}</span>
      </label>
    </li>
      <validation-provider :rules="value.required ? 'required' : null" v-slot="{ errors }" :name="value.text">
        <input type="text" v-model="value.possible_answers_selected" style="display: none;">
        <p class="small text-danger">{{ errors.join(' ') }}</p>
      </validation-provider>
      <validation-provider :rules="getOtherAnswerSelected() ? 'required' : null" v-slot="{ errors }" :name="`${value.text} (Specify)`" :custom-messages="{required: 'Please specify'}" immediate>
        <input type="text" v-model="otherText" style="display: none;">
        <p class="small text-danger">{{ errors.join(' ') }}</p>
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

          return this.value.possible_answers_selected = this.value.possible_answers_selected.filter(o => o.id !== id)
        }

        return this.value.possible_answers_selected = this.value.possible_answers_selected.concat({ id: id, data: data })
      }
    }
  }
</script>

<style lang="scss" scoped>
  $marker-size: 19px;

  .selector {
    display: inline-block;
    input[type="checkbox"],
    input[type="radio"] {
      display: none;
    }
    .marker {
      align-items: center;
      border-radius: $marker-size;
      border: 1px solid #adc0c480;
      display: flex;
      height: $marker-size;
      justify-content: center;
      position: relative;
      transition-duration: .4s;
      width: $marker-size;
    }
    .icon {
      position: absolute;
      top: -25px;
      left: -12px;
      transform: scale(0);
      transition-duration: .4s;
    }
    input:checked ~ .marker {
      border-color: #8ec0ed;
      .icon {
        transform: scale(.5);
      }
    }
    input[type='radio']:checked ~ .marker {
      background-color: #8ec0ed;
    }

    .label {
      padding: 0 0 0 10px;
    }

    label:hover {
      .marker {
        border-color: #adc0c4;
      }
    }
  }
</style>
