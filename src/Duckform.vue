<template>
  <div class="duckform">
    <div v-if="loadingData">
      <slot name="loading" v-bind:form="form">
        <h1 class="text-center">{{ form.title || 'Loading...' }}</h1>
      </slot>
    </div>
    <div v-else-if="errorLoading">
      <slot name="errorLoading" v-bind:form="form">
        <h1 class="text-center">Ups, there was an error loading the form.</h1>
      </slot>
    </div>
    <div v-else-if="!form.sections || !form.sections.length">
      <h1 class="text-center">There are no sections defined on this form.</h1>
    </div>
    <div v-else>
      <validation-observer ref="validationObserver" v-slot="slotProps">
        <main class="content">
          <slot name="completed" v-if="formSubmitted" v-bind:survey="form">
            <h1 class="text-center">Thanks!</h1>
            <h2 class="text-center">Form was submitted correctly.</h2>
          </slot>
          <form v-else ref="surveyTop">
            <h1 v-if="form.title" style="font-size: 2em" class="text-center">{{ form.title }}</h1>
            <ul v-if="!disabled" class="progress list-unstyled">
              <li v-for="(section, index) in form.sections" :class="{'active': index <= currentSectionIndex}"></li>
            </ul>
            <header>
              <h2 class="text-center pb-3">{{ currentSection.title }}</h2>
              <h3 v-if="currentSection.description">{{ currentSection.description }}</h3>
            </header>
            <section v-if="currentSection.questions && currentSection.questions.length">
              <fieldset v-for="(question, questionIndex) in currentSection.questions" :key="`S${currentSectionIndex}|Q${questionIndex}`">
                <header>
                  <div class="statement pb-1">{{ question.text }}<span v-if="question.required" class="text-danger small"> *</span></div>
                </header>
                <span v-if="question.type === 'multiselect'">
                  <checkbox-question v-model="currentSection.questions[questionIndex]" :disabled="disabled"></checkbox-question>
                </span>
                <span v-if="question.type === 'scale'">
                  <scale-question v-model="currentSection.questions[questionIndex]" :disabled="disabled"></scale-question>
                </span>
                <span v-if="question.type === 'date'">
                  <date-question v-model="currentSection.questions[questionIndex]" :disabled="disabled"></date-question>
                </span>
                <span v-if="['free_text', 'integer'].indexOf(question.type) >= 0">
                  <input-question v-model="currentSection.questions[questionIndex]" :disabled="disabled"></input-question>
                </span>
                <span v-if="['single_select', 'yes_no'].indexOf(question.type) >= 0">
                  <radio-question v-model="currentSection.questions[questionIndex]" :disabled="disabled"></radio-question>
                </span>
              </fieldset>
            </section>
            <div v-else>
              <h3>No questions defined on this section.</h3>
            </div>
            <div v-if="!disabled" class="control">
              <div v-if="validationFailed && slotProps.invalid" class="small text-danger mb-4">
                <p class="pb-2">Please complete the following questions:</p>
                <p v-for="errorText in filterArray(slotProps.errors)">{{ errorText }}.</p>
              </div>
              <button v-if="currentSectionIndex > 0" class="button back" type="button" @click="prevSection">Back</button>
              <button class="button mt-3" type="button" @click="nextSection">
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

  import axios from 'axios'
  import _ from 'lodash'
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
        this.form.sections = _.values(_.merge(formSectionsArranged, savedSectionsArranged))
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
              this.$refs.surveyTop.scrollIntoView()
            }
          }).finally(() => {
            this.$emit('input', this.form)
            this.$emit('save')
          })
        })
      },
      prevSection () {
        if (this.currentSectionIndex > 0) {
          this.currentSectionIndex--
          this.$refs.surveyTop.scrollIntoView()
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

    p {
        margin: 3px 0;
    }

    header h3 {
      margin-left: 20px;
    }

    .row {
        display: flex;
    }

    .shadow {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }

    .bg-white {
      background-color: #fff !important;
    }

    .text-center {
      text-align: center !important;
    }
    .text-right {
      text-align: right !important;
    }
    .text-left {
      text-align: left !important;
    }

    .text-danger {
      color: #dc3545 !important;
    }

    .list-unstyled {
      padding-left: 0;
      list-style: none;
    }

    .small {
        font-size: .75em;
    }

    .w-25 {
      width: 25% !important;
    }
    .w-50 {
      width: 50% !important;
    }
    .w-100 {
      width: 100% !important;
    }

    .pt-0, .py-0 {
        padding-top: 0 !important;
    }
    .pt-1, .py-1 {
        padding-top: .25em !important;
    }
    .pt-2, .py-2 {
        padding-top: .5em !important;
    }
    .pt-3, .py-3 {
        padding-top: .75em !important;
    }
    .pt-4, .py-4 {
        padding-top: 1em !important;
    }

    .pb-0, .py-0 {
        padding-bottom: 0 !important;
    }
    .pb-1, .py-1 {
        padding-bottom: .25em !important;
    }
    .pb-2, .py-2 {
        padding-bottom: .5em !important;
    }
    .pb-3, .py-3 {
        padding-bottom: .75em !important;
    }
    .pb-4, .py-4 {
        padding-bottom: 1em !important;
    }

    .pl-0, .px-0 {
        padding-left: 0 !important;
    }
    .pl-1, .px-1 {
        padding-left: .25em !important;
    }
    .pl-2, .px-2 {
        padding-left: .5em !important;
    }
    .pl-3, .px-3 {
        padding-left: .75em !important;
    }
    .pl-4, .px-4 {
        padding-left: 1em !important;
    }

    .pr-0, .px-0 {
        padding-right: 0 !important;
    }
    .pr-1, .px-1 {
        padding-right: .25em !important;
    }
    .pr-2, .px-2 {
        padding-right: .5em !important;
    }
    .pr-3, .px-3 {
        padding-right: .75em !important;
    }
    .pr-4, .px-4 {
        padding-right: 1em !important;
    }

    .mt-0, .my-0 {
        margin-top: 0 !important;
    }
    .mt-1, .my-1 {
        margin-top: .25em !important;
    }
    .mt-2, .my-2 {
        margin-top: .5em !important;
    }
    .mt-3, .my-3 {
        margin-top: .75em !important;
    }
    .mt-4, .my-4 {
        margin-top: 1em !important;
    }

    .mb-0, .my-0 {
        margin-bottom: 0 !important;
    }
    .mb-1, .my-1 {
        margin-bottom: .25em !important;
    }
    .mb-2, .my-2 {
        margin-bottom: .5em !important;
    }
    .mb-3, .my-3 {
        margin-bottom: .75em !important;
    }
    .mb-4, .my-4 {
        margin-bottom: 1em !important;
    }

    .ml-0, .mx-0 {
        margin-left: 0 !important;
    }
    .ml-1, .mx-1 {
        margin-left: .25em !important;
    }
    .ml-2, .mx-2 {
        margin-left: .5em !important;
    }
    .ml-3, .mx-3 {
        margin-left: .75em !important;
    }
    .ml-4, .mx-4 {
        margin-left: 1em !important;
    }

    .mr-0, .mx-0 {
        margin-right: 0 !important;
    }
    .mr-1, .mx-1 {
        margin-right: .25em !important;
    }
    .mr-2, .mx-2 {
        margin-right: .5em !important;
    }
    .mr-3, .mx-3 {
        margin-right: .75em !important;
    }
    .mr-4, .mx-4 {
        margin-right: 1em !important;
    }

    a {
      transition-duration: .4s
    }

    fieldset {
      border-bottom: 1px solid #ccc;
      border-left: 0;
      border-right: 0;
      border-top: 0;
      padding: 0 0 25px 0;
      margin: 20px 20px 10px 20px;
    }

    button {
      transition-duration: .4s;
      &:focus { outline: none; }
      &:not([disabled]) { cursor: pointer; }
    }

    .button {
      background-color: #edaca0;
      border: none;
      color: #fff;
      display: inline-block;
      font-size: 1.4rem;
      padding: 15px 30px;
      text-decoration: none;
      border: 1px solid #fff;

      &[disabled] {
        background-color: #A5AFA5;
      }
      &:not([disabled]):hover {
        background-color: #fff;
        color: #000;
        border: 1px solid #000;
      }
      &.orange {
        background-color: #FF5900;
      }
      &.orange:hover {
        background-color: #004D50;
      }
    }

    .statement {

    }
    .input {
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

    .content {
      flex: 1 0 0;
      padding: 25px 0 25px 0;
      margin: 0 auto;
    }

    .control {
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

    .progress {
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
        &.active {
          opacity: 1;
          border-top-color: #0055ff;
        }
      }
    }
  }
</style>
