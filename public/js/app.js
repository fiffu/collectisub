import Editor from './editor.js';

Vue.component('editor', Editor);

Vue.component('upload-modal', {
    props: ['value'],

    data() {
        return {
            fileSelected: false,
        }
    },

    computed: {
        submitDisabled() {
            return !this.fileSelected;  // some validation here
        }
    },

    methods: {
        onChange(evt) {
            this.value.file = evt.target.files[0];
            this.fileSelected = this.value.file ? true : false;
        },

        async onSubmit() {
            if (!this.value.file) return;

            const form = new FormData();
            form.append('subFile', this.value.file);

            try {
                const json = await fetch('/submit', {method: 'POST', body: form})
                    .then(r => r.json());

                const subid = json['subid'];
                const subObj = await fetch(`/sub/${subid}`, {method: 'GET'})
                    .then(res => res.json());

                this.value.meta.id = subObj.subid;
                this.value.meta.format = subObj.ext;
                this.value.meta.timestamp = subObj.timestamp;
                this.value.parsed = subObj.parsed;
                console.log(value.meta.timestamp);

            } catch (ex) {
                console.log(ex.message || ex);
            }
        }
    },


    template: `
    <div class="upload">
        <input type="file" id="sub-file" @change="onChange" />
        <input type="submit" value="Submit" :disabled="submitDisabled" @click="onSubmit" />
    </div>
    `,
});


const App = {
    name: 'app',
    data() {
        return {
            subs: {
                file: undefined,
                meta: {
                    id: undefined,
                    format: undefined,
                    timestamp: undefined,
                },
                parsed: undefined,
            }
        }
    },

    template: `
    <div id="container">
        <upload-modal v-if="subs.parsed === undefined" v-model="subs" />

        <editor v-else v-model="subs" />
    </div>
    `
}

new Vue({
    el: '#app',
    components: {
        App, Editor
    },
    template: '<app />'
});
