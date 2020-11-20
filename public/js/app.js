import Editor from './editor.js';

const Upload = {
    name: 'upload-modal',

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
                const json = await fetch('/projects', {method: 'POST', body: form})
                    .then(r => r.json());

                const projId = json['projId'];
                const subObj = await fetch(`/projects/${projId}`, {method: 'GET'})
                    .then(res => res.json());

                this.value.meta.id = subObj.projId;
                this.value.meta.format = subObj.ext;
                this.value.meta.timestamp = subObj.timestamp;
                this.value.parsed = subObj.parsed;

            } catch (ex) {
                console.error(ex);
            }
        }
    },


    template: `
    <div class="upload">
        <input type="file" id="sub-file" @change="onChange" />
        <input type="submit" value="Submit" :disabled="submitDisabled" @click="onSubmit" />
    </div>
    `,
};


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

    components: {
        'upload-modal': Upload,
        'editor': Editor
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
        App
    },
    template: '<app />'
});
