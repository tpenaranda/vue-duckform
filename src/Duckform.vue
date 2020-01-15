<template>
  <div v-if="loadingData">
    <slot name="loading" v-bind:form="form">
      <h1 class="text-center">{{ form.title || 'Loading...' }}</h1>
    </slot>
  </div>
  <div v-else class="duckform">
    <validation-observer ref="validationObserver" v-slot="slotProps">
      <main class="content">
        <slot name="completed" v-if="submit.completed_at" v-bind:survey="form">
          <h1 class="text-center">Thanks!</h1>
          <h2 class="text-center">Form was submitted properly.</h2>
        </slot>
        <form v-else ref="surveyTop">
          <h1 style="font-size: 2em" class="text-center">{{ form.title }}</h1>
          <ul class="progress list-unstyled">
            <li v-for="(section, index) in form.sections" :class="{'active': index <= currentSectionIndex}"></li>
          </ul>
          <header>
            <h2 class="text-center pb-3">{{ currentSection.title }}</h2>
            <h3 v-if="currentSection.description">{{ currentSection.description }}</h3>
          </header>
          <section>
            <fieldset v-for="(question, questionIndex) in currentSection.questions" :key="`S${currentSectionIndex}|Q${questionIndex}`">
              <header>
                <div class="statement pb-1">{{ question.text }}<span v-if="question.required" class="text-danger small"> *</span></div>
              </header>
              <span v-if="question.type === 'multiselect'">
                <checkbox-question v-model="currentSection.questions[questionIndex]" :disabled="false"></checkbox-question>
              </span>
              <span v-if="question.type === 'scale'">
                <scale-question v-model="currentSection.questions[questionIndex]" :disabled="false"></scale-question>
              </span>
              <span v-if="question.type === 'date'">
                <date-question v-model="currentSection.questions[questionIndex]" :disabled="false"></date-question>
              </span>
              <span v-if="['free_text', 'integer'].indexOf(question.type) >= 0">
                <input-question v-model="currentSection.questions[questionIndex]" :disabled="false"></input-question>
              </span>
              <span v-if="['single_select', 'yes_no'].indexOf(question.type) >= 0">
                <radio-question v-model="currentSection.questions[questionIndex]" :disabled="false"></radio-question>
              </span>
            </fieldset>
          </section>
          <div class="control">
            <div v-if="validationFailed && slotProps.invalid" class="small text-danger mb-4">
              <p class="pb-2">Please complete the following questions:</p>
              <p v-for="errorText in filterArray(slotProps.errors)">{{ errorText }}.</p>
            </div>
            <button v-if="currentSectionIndex > 0" class="button back" type="button" @click="prevSection">Back</button>
            <button class="button" type="button" @click="nextSection">
              <span v-if="currentSectionIndex + 1 < form.sections.length">{{ savingData ? 'Saving...' : 'Continue' }}</span>
              <span v-else>{{ savingData ? 'Saving...' : 'Submit' }}</span>
            </button>
          </div>
        </form>
      </main>
    </validation-observer>
  </div>
</template>
<script>
  import _ from 'lodash';
  import axios from 'axios';

  import InputQuestion from './components/Questions/Input.vue'
  import RadioQuestion from './components/Questions/Radio.vue'
  import CheckboxQuestion from './components/Questions/Checkbox.vue'
  import ScaleQuestion from './components/Questions/Scale.vue'
  import DateQuestion from './components/Questions/Date.vue'

  import { ValidationObserver } from 'vee-validate';

  export default {
    name: 'Duckform',
    data () {
      return {
        currentSectionIndex: 0,
        errorLoading: false,
        form: this.formData,
        formDataLoaded: false,
        formId: null,
        loadingData: true,
        savingData: false,
        submit: this.submitData,
        submitDataLoaded: false,
        submitId: null,
        validationFailed: false,
      }
    },
    props: {
      formData: {
        type: Object,
        default: () => { return { sections: [] } }
      },
      formDataEndpoint: {
        type: String,
        default: null
      },
      submitData: {
        type: Object,
        default: () => { return { sections: [] } }
      },
      submitDataEndpoint: {
        type: String,
        default: null
      },
    },
    components: {
      CheckboxQuestion,
      DateQuestion,
      InputQuestion,
      RadioQuestion,
      ScaleQuestion,
      ValidationObserver
    },
    computed: {
      currentSection () {
        return this.form.sections[this.currentSectionIndex]
      }
    },
    mounted () {
      if (_.isEmpty(this.formDataEndpoint)) {
        this.proccessFormSections()
        this.formDataLoaded = true
      } else {
        this.getForm()
      }

      if (_.isEmpty(this.submitDataEndpoint)) {
        this.submitDataLoaded = true
      } else {
        this.getSubmit()
      }
    },
    watch: {
      formDataLoaded: function (newValue, oldValue) {
        if (this.formDataLoaded && this.submitDataLoaded) {
          this.mergeSubmitData()
          this.loadingData = false
        }
      },
      submitDataLoaded: function (newValue, oldValue) {
        if (this.formDataLoaded && this.submitDataLoaded) {
          this.mergeSubmitData()
          this.loadingData = false
        }
      }
    },
    methods: {
      filterArray(errors) {
        const errorIndexes = Object.values(errors).map((v, k) => { return v.length ? k : null }).filter((i) => i !== null)

        return Object.keys(errors).filter((v, k) => errorIndexes.indexOf(k) >= 0)
      },
      getForm () {
        axios.get(this.formDataEndpoint).then(response => {
          this.form = response.data.data
          this.proccessFormSections()
        }).catch(() => {
          this.errorLoading = true
        }).finally(() => {
          this.formDataLoaded = true
        })
      },
      getSubmit () {
        axios.get(this.submitDataEndpoint).then(response => {
          this.submit = response.data.data
        }).catch(() => {
          this.errorLoading = true
        }).finally(() => {
          this.submitDataLoaded = true
        })
      },
      proccessFormSections () {
        this.form.sections = _.sortBy(this.form.sections, (i) => i.order || 0).map((section) => {
          section.questions.map((question) => {
            question.possible_answers = _.sortBy(question.possible_answers, (i) => i.order || 0)
            this.$set(question, 'possible_answers_selected', [])
            return question
          })
          return section
        })
      },
      mergeSubmitData() {
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
          })
        })
      },
      prevSection () {
        if (this.currentSectionIndex > 0) {
          this.currentSectionIndex--
          this.$refs.surveyTop.scrollIntoView()
        }
      },
      save () {
        this.savingData = true
        const responseHandler = (response) => {
          this.submit = response.data.data
          this.mergeSubmitData()
        }

        if (this.submit.id) {
          return axios.patch(this.submitDataEndpoint, { data: this.form }).then(responseHandler).finally(() => { this.savingData = false })
        }

        return axios.post(`${this.formDataEndpoint}/submits`, { data: this.form }).then(responseHandler).finally(() => { this.savingData = false })
      }
    }
  }
</script>

<style lang="scss">
  .duckform {
    background-color: #fff;
    font-size: 1rem;

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

    .header {
      border-bottom: 1px solid #ddd;
      text-align: center;
      width: 100%;
      @media (min-width: 1000px) {
        text-align: left;
      }
      .center {
        padding: 0 30px;
      }
      img {
        height: auto;
        width: 150px;
        margin: 15px 0;
      }
    }

    .content {
      flex: 1 0 0;
      padding: 25px 0 25px 0;
      margin: 0 auto;
      max-width: 850px;
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
          border-top-color: #0000ff;
        }
      }
    }
  }
</style>
