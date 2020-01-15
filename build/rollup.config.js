import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import vue from 'rollup-plugin-vue';

export default {
    input: './src/wrapper.js',
    output: {
        name: 'Duckform',
        exports: 'named',
        globals: {
            'axios': 'axios',
            'lodash': '_',
            'moment': 'moment',
            'vee-validate': 'veeValidate',
            'vee-validate/dist/rules': 'rules',
            'vue-date-pick': 'datePick',
            'vue-range-slider': 'rangeSlider'
        }
    },
    plugins: [
        commonjs(),
        vue({
            css: true,
            compileTemplate: true,
        }),
        buble({
            objectAssign: 'Object.assign'
        }),
        image()
    ],
    external: [
        'axios',
        'lodash',
        'moment',
        'vee-validate',
        'vee-validate/dist/rules',
        'vue-date-pick',
        'vue-date-pick/dist/vueDatePick.css',
        'vue-range-slider'
    ]
};