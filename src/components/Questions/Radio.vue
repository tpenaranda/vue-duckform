<template>
  <ul class="list-unstyled options mb-2" :class="`_${value.type}`">
    <li v-for="(answer, answerIndex) in value.possible_answers" :key="answer.id">
      <label class="row">
        <div class="selector py-1">
          <input type="radio"
            :disabled="disabled"
            :id="`A${answer.id}`"
            :name="`Q${value.id}`"
            @change="handleInputChange(answer.id)"
            :checked="selectedAnswerId === answer.id"
          >
          <span class="radio marker"></span>
        </div>
        <span class="label pl-2 py-1">{{ answer.text }}</span>
      </label>
    </li>
    <validation-provider :rules="rules" v-slot="{ errors }" :name="value.text">
      <input type="text" v-model="value.possible_answers_selected" style="display: none;">
      <p class="text-danger small">{{ errors.join(' ') }}</p>
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
        return this.value.possible_answers_selected = [{id: id, data: null}]
      }
    }
  }
</script>

<style lang="scss" scoped>
  $marker-size: 19px;

  .selector {
    display: inline-block;

    input {
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
    input:checked ~ .marker {
      background-color: #8ec0ed;
      border-color: #8ec0ed;
    }
    label:hover {
      .marker {
        border-color: #adc0c4;
      }
    }
  }
</style>
