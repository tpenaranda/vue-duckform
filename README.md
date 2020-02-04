## vue-duckform
Render a JS Object as a Form. Compatible with Laravel Duckform API.

## Demo
Live demo [here](https://vue-duckform-demo.tpenaranda.com).

### How to install
```bash
npm install vue-duckform
```

Register on component, or register for global usage
```js
import Vue from 'vue'
import Duckform from 'vue-duckform'

Vue.component('Duckform', Duckform)
```

### Usage with JS data (:warning: check demo site for formData format)
```js
<duckform :form-data="formData" v-model="form"></duckform>

const formData = {
  title: 'Form title',
  description: 'Form description',
  sections: [
    {
      title: 'Section title',
      description: 'Section description',
      questions: [
        {
          type: 'free_text', //free_text, single_select, multiselect, scale, date, integer
          required: true,
          text: "What's your name?",
          possible_answers: [{id: 'possible_answer_1'}]
        },
        ...
    },
    ...
  ]
}
```

### Usage with API endpoints ([Laravel Duckform package](https://github.com/tpenaranda/duckform) recommended)
```js
<duckform :form-data-endpoint="/api/duckforms/myform" v-model="form"></duckform>
```

### Props
**Name**|**Type's**|**Default**|**Description**
-----|-----|-----|-----
formData|Object|`{}`|Form data, check demo site for format
submitData|Object|`{}`|Form Submit data, this is data of a partially filled up form. Will be merged by vue-duckform to formData.
formDataEndpoint|string|`null`|Endpoint to GET form data (Laravel duckform package recommended).
submitId|Number/String|`null`|ID of a Form Submit to GET/PATCH/POST from "<formDataEndpoint>/submits/" before populating the form. This is used to retrieve a partially filled form stored in database (Laravel duckform package recommended).
disabled|boolean|`false`|Form inputs disabled
value|Object|`{}`|Form object to bind to.

### Events
**Name**|**Parameters**|**Description**
-----|-----|-----
input|form|Fires after user input on any question.
save|form|Fires after user clicks on 'Continue' or 'Submit' buttons.
