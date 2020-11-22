import acceptedFormats from './accept-formats.js';
import Editor from './tem-editor.js';
import Upload from './tem-upload.js';


const App = {
    name: 'app',
    data() {
        return {
            project: {
                file: undefined,
                meta: {
                    projId: undefined,
                    filename: undefined,
                    format: undefined,
                    timestamp: undefined,
                },
                parsed: undefined,
            },
            acceptedFormats: acceptedFormats,
        }
    },

    components: {
        'upload-modal': Upload,
        'editor': Editor
    },

    template: `
    <div id="container">
        <upload-modal v-model="project" :acceptedFormats="acceptedFormats" />
        <hr>
        <editor v-if="project.parsed !== undefined" v-model="project" />
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
