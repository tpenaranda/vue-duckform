<template>
  <div class="duckform">
    <div v-if="loadingData">
      <slot name="loading" v-bind:form="form">
        <p class="df-title df-tc">{{ form.title || 'Loading...' }}</p>
      </slot>
    </div>
    <div v-else-if="errorLoading">
      <slot name="errorLoading" v-bind:form="form">
        <p class="df-title df-tc">Ups, there was an error loading the form.</p>
      </slot>
    </div>
    <div v-else-if="!form.sections || !form.sections.length">
      <p class="df-title df-tc">There are no sections defined on this form.</p>
    </div>
    <div v-else>
      <validation-observer ref="validationObserver" v-slot="slotProps">
        <main class="df-content">
          <slot name="completed" v-if="formSubmitted" v-bind:survey="form">
            <p class="df-title df-tc">Thanks!</p>
            <p class="df-subtitle df-tc">Form is completed.</p>
          </slot>
          <form v-else>
            <p v-if="form.title" class="df-title df-tc">{{ form.title }}</p>
            <ul v-if="!disabled" class="df-progress df-list-unstyled">
              <li v-for="(section, index) in form.sections" :class="{'df-active': index <= currentSectionIndex}"></li>
            </ul>
            <header>
              <p class="df-subtitle df-tc df-pb-4">{{ currentSection.title }}</p>
              <p class="df-section-description" v-if="currentSection.description"><strong>{{ currentSection.description }}</strong></p>
            </header>
            <section v-if="currentSection.questions && currentSection.questions.length">
              <fieldset v-for="(question, questionIndex) in currentSection.questions" :key="`S${currentSectionIndex}|Q${questionIndex}`">
                <header>
                  <div class="df-pb-1">{{ question.text }}<span v-if="question.required" class="df-td df-small"> *</span></div>
                </header>
                <checkbox-question v-if="question.type === 'multiselect'"
                  v-model="currentSection.questions[questionIndex]"
                  :disabled="disabled"
                  @input="handleQuestionInput">
                </checkbox-question>
                <scale-question v-if="question.type === 'scale'"
                  v-model="currentSection.questions[questionIndex]"
                  :disabled="disabled"
                  @input="handleQuestionInput">
                </scale-question>
                <date-question v-if="question.type === 'date'"
                  v-model="currentSection.questions[questionIndex]"
                  :disabled="disabled"
                  @input="handleQuestionInput">
                </date-question>
                <input-question v-if="['free_text', 'integer'].indexOf(question.type) >= 0"
                  v-model="currentSection.questions[questionIndex]"
                  :disabled="disabled"
                  @input="handleQuestionInput">
                </input-question>
                <radio-question v-if="['single_select', 'yes_no'].indexOf(question.type) >= 0"
                  v-model="currentSection.questions[questionIndex]"
                  :disabled="disabled"
                  @input="handleQuestionInput">
                </radio-question>
              </fieldset>
            </section>
            <div v-else>
              <p class="df-tc"><strong>No questions defined on this section.</strong></p>
            </div>
            <div v-if="!disabled" class="df-control">
              <div v-if="validationFailed && slotProps.invalid" class="df-small df-td df-mb-4">
                <p>Please complete the following questions:</p>
                <p v-for="errorText in filterArray(slotProps.errors)">{{ errorText }}.</p>
              </div>
              <button v-if="currentSectionIndex > 0" class="df-button df-back" type="button" @click="prevSection">Back</button>
              <button class="df-button df-mt-3" type="button" @click="nextSection">
                <span v-if="isLastSection">{{ savingData ? 'Submitting...' : 'Submit' }}</span>
                <span v-else>{{ savingData ? 'Saving...' : 'Continue' }}</span>
              </button>
            </div>
          </form>
        </main>
      </validation-observer>
    </div>
  </div>
</template>

<script>
  import InputQuestion from './components/Questions/Input.vue'
  import RadioQuestion from './components/Questions/Radio.vue'
  import CheckboxQuestion from './components/Questions/Checkbox.vue'
  import ScaleQuestion from './components/Questions/Scale.vue'
  import DateQuestion from './components/Questions/Date.vue'

  import _ from 'lodash'
  import axios from 'axios'
  import moment from 'moment';
  import { ValidationObserver } from 'vee-validate'

  export default {
    name: 'Duckform',
    components: {
      CheckboxQuestion,
      DateQuestion,
      InputQuestion,
      RadioQuestion,
      ScaleQuestion,
      ValidationObserver
    },
    data () {
      return {
        currentSectionIndex: 0,
        errorLoading: false,
        form: this.formData,
        formDataLoaded: false,
        formId: null,
        formSubmitted: false,
        loadingData: true,
        savingData: false,
        submit: this.submitData,
        submitDataLoaded: false,
        validationFailed: false,
      }
    },
    props: {
      formData: {
        type: Object,
        default: () => { return {} }
      },
      formDataEndpoint: {
        type: String,
        default: null
      },
      disabled: {
        type: Boolean,
        default: false
      },
      submitData: {
        type: Object,
        default: () => { return {} }
      },
      submitId: {
        type: [Number, String],
        default: null
      },
      value: {
        type: Object,
        default: () => { return {} }
      },
    },
    computed: {
      currentSection () {
        return this.form.sections[this.currentSectionIndex]
      },
      isLastSection () {
        return this.currentSectionIndex + 1 >= this.form.sections.length
      }
    },
    mounted () {
      if (_.isEmpty(this.formDataEndpoint)) {
        this.proccessFormSections()
        this.getSubmitAndMerge().then(() => { this.loadingData = false })
      } else {
        this.getForm().then(() => {
          this.getSubmitAndMerge().then(() => { this.loadingData = false })
        })
      }
    },
    methods: {
      handleQuestionInput (question) {
        this.$emit('input', this.form)
      },
      filterArray(errors) {
        const errorIndexes = Object.values(errors).map((v, k) => { return v.length ? k : null }).filter((i) => i !== null)

        return Object.keys(errors).filter((v, k) => errorIndexes.indexOf(k) >= 0)
      },
      getForm () {
        return axios.get(this.formDataEndpoint).then(response => {
          this.form = response.data.data
          this.proccessFormSections()
        }).catch(() => {
          this.errorLoading = true
        }).finally(() => {
          this.formDataLoaded = true
        })
      },
      getSubmit () {
        return axios.get(`${this.formDataEndpoint}/submits/${this.submitId}`).then(response => {
          this.submit = response.data.data
          this.formSubmitted = !_.isEmpty(response.data.data.completed_at)
        }).catch(() => {
          this.errorLoading = true
        }).finally(() => {
          this.submitDataLoaded = true
        })
      },
      getSubmitAndMerge () {
        if (_.isEmpty(this.submitId)) {
          this.mergeSubmitData()
          return new Promise((resolve) => resolve())
        } else {
          return this.getSubmit().then(() => this.mergeSubmitData())
        }
      },
      proccessFormSections () {
        this.form.sections = _.sortBy(this.form.sections, (i) => i.order || 0).map((section) => {
          if (section.questions) {
            section.questions.map((question) => {
              question.possible_answers = _.sortBy(question.possible_answers, (i) => i.order || 0)
              this.$set(question, 'possible_answers_selected', [])
              return question
            })
          }
          return section
        })
      },
      mergeSubmitData() {
        if (!this.submit.sections || !this.submit.sections.length) {
          return null
        }
        const savedSectionsArranged = _.keyBy(this.submit.sections.map((section) => {
          section.questions = _.keyBy(section.questions, 'id')
          return section
        }), 'slug')
        const formSectionsArranged = _.keyBy(this.form.sections.map((section) => {
          section.questions = _.keyBy(section.questions, 'id')
          return section
        }), 'slug')
        this.form.sections = _.values(_.merge(formSectionsArranged, savedSectionsArranged)).map((section) => {
          section.questions = _.values(section.questions)
          return section
        })
      },
      nextSection () {
        this.$refs.validationObserver.validate().then(success => {
          if (!success) {
            this.validationFailed = true
            return false
          }

          this.validationFailed = false

          this.save().then(() => {
            if (this.currentSectionIndex + 1 < this.form.sections.length) {
              this.currentSectionIndex++
            }
          }).finally(() => {
            this.$emit('save', this.form)
          })
        })
      },
      prevSection () {
        if (this.currentSectionIndex > 0) {
          this.currentSectionIndex--
        }
      },
      saveToApi () {
        this.savingData = true
        const responseHandler = (response) => {
          this.submit = response.data.data
          this.mergeSubmitData()

          if (this.isLastSection) {
            this.formSubmitted = !_.isEmpty(response.data.data.completed_at)
          }
        }

        if (this.submit.token) {
          return axios.patch(`${this.formDataEndpoint}/submits/${this.submit.token}`, { data: this.form }).then(responseHandler).finally(() => {
            this.savingData = false
          })
        }

        return axios.post(`${this.formDataEndpoint}/submits`, { data: this.form }).then(responseHandler).finally(() => {
          this.savingData = false
        })
      },
      save () {
        if (!_.isEmpty(this.formDataEndpoint)) {
          return this.saveToApi()
        }

        if (this.isLastSection) {
          this.form.completed_at = moment().toISOString()
          this.formSubmitted = true
        }

        return new Promise((resolve) => resolve())
      }
    }
  }
</script>

<style lang="scss">
  .duckform {
    font-size: 1rem;
    text-align: left;

    a {
      transition-duration: .4s
    }

    fieldset {
      border-bottom: 1px solid #ccc;
      border-left: 0;
      border-right: 0;
      border-top: 0;
      padding: 0 0 25px 0;
      margin: 10px 20px;
    }

    button {
      transition-duration: .4s;
      &:focus { outline: none; }
      &:not([disabled]) { cursor: pointer; }
    }

    label {
      display: block;
      margin-bottom: 0;
    }

    p {
        margin: 3px 0;
    }

    header p.df-section-description {
      margin-left: 20px;
    }

    .df-title {
      font-size: 1.75rem;
    }

    .df-subtitle {
      font-size: 1.25rem;
    }

    .df-row {
        display: flex;
    }

    .df-tc {
      text-align: center !important;
    }

    .df-tr {
      text-align: right !important;
    }

    .df-tl {
      text-align: left !important;
    }

    .df-td {
      color: #dc3545 !important;
    }

    .df-list-unstyled {
      padding-left: 0;
      list-style: none;
    }

    .df-small {
      font-size: .75em;
    }

    .df-w-25 {
      width: 25% !important;
    }

    .df-w-50 {
      width: 50% !important;
    }

    .df-w-100 {
      width: 100% !important;
    }

    .df-py-1 {
        padding-top: .25em !important;
    }

    .df-pb-1, .df-py-1 {
        padding-bottom: .25em !important;
    }

    .df-pb-2 {
        padding-bottom: .5em !important;
    }

    .df-pb-3 {
        padding-bottom: .75em !important;
    }

    .df-pb-4 {
        padding-bottom: 1em !important;
    }

    .df-pl-1 {
        padding-left: .25em !important;
    }

    .df-pl-2 {
        padding-left: .5em !important;
    }

    .df-mt-3 {
        margin-top: .75em !important;
    }

    .df-mb-0 {
        margin-bottom: 0 !important;
    }

    .df-mb-2 {
        margin-bottom: .5em !important;
    }
    .df-mb-4 {
        margin-bottom: 1em !important;
    }

    .df-ml-2 {
        margin-left: .5em !important;
    }

    .df-button {
      background-color: #8ec0ed;
      border: none;
      color: #fff;
      display: inline-block;
      font-size: 1.4rem;
      padding: 15px 30px;
      text-decoration: none;
      border: 1px solid #fff;

      &[disabled] {
        background-color: #dbebf9;
      }
      &:not([disabled]):hover {
        background-color: #fff;
        color: #000;
        border: 1px solid #000;
      }
    }

    .df-input, .df-date {
      label {
        align-items: flex-start;
        cursor: pointer;
        display: flex;
      }
      input[type="text"],
      input[type="number"],
      input[type="date"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

        border-radius: 5px;
        border: 0;
        background-color: #8ec0ed30;
        box-shadow: none;
        box-sizing: border-box;
        display: block;
        padding: 5px 10px;
        &:focus {
          outline: none;
          transition-duration: .4s;
        }
      }
      input.other {
        display: inline-block;
      }
    }

    .df-content {
      flex: 1 0 0;
      padding: 25px 0 25px 0;
      margin: 0 auto;
    }

    .df-control {
      padding: 20px 0;
      text-align: center;

      button.back {
        background-color: transparent;
        border: 1px solid #ccc;
        color: #ccc;
        &:hover {
          background-color: transparent !important;
          border-color: #000;
          color: #000;
        }
      }
    }

    .df-progress {
      display: flex;
      margin: 0;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      z-index: 1;
      li {
        flex-grow: 1;
        font-size: 12px;
        text-align: center;
        transition-duration: .4s;
        border-top: 7px solid #555;
        opacity: 0.25;
        &.df-active {
          opacity: 1;
          border-top-color: #0055ff;
        }
      }
    }

    .df-scale {
      .df-selection {
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
    }

    .vdpClearInput {
      display: none;
    }
    .vdpCellContent {
      font-size: 13px;
    }
    .vdpComponent {
      width: 100%;

      input {
        font-size: 16px;
        width: 100%;
      }
    }

    .df-radio {
      $marker-size: 19px;

      .df-selector {
        display: inline-block;

        input {
          display: none;
        }

        .df-marker {
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
        input:checked ~ .df-marker {
          background-color: #8ec0ed;
          border-color: #8ec0ed;
        }
        label:hover {
          .df-marker {
            border-color: #adc0c4;
          }
        }
      }
    }

    .df-checkbox {
      $marker-size: 19px;

      .df-selector {
        display: inline-block;
        input[type="checkbox"],
        input[type="radio"] {
          display: none;
        }
        .df-marker {
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
        .df-icon {
          position: absolute;
          top: -25px;
          left: -12px;
          transform: scale(0);
          transition-duration: .4s;
        }
        input:checked ~ .df-marker {
          border-color: #8ec0ed;
          .df-icon {
            transform: scale(.5);
          }
        }
        input[type='radio']:checked ~ .df-marker {
          background-color: #8ec0ed;
        }

        .df-label {
          padding: 0 0 0 10px;
        }

        label:hover {
          .df-marker {
            border-color: #adc0c4;
          }
        }
      }
    }
  }
</style>
