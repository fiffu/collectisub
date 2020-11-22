const Upload = {
    name: 'upload-modal',

    props: ['value', 'acceptedFormats'],

    data() {
        return {
            fileSelected: false,
        }
    },

    computed: {
        submitDisabled() {
            return !this.fileSelected;  // some validation here
        },
        accepts() {
            return this.acceptedFormats
                .map(f => `.${f}`)  // prepend .
                .join(',');
        }
    },

    methods: {
        onChange(evt) {
            const file = evt.target.files[0];
            this.value.file = file;
            this.value.meta.filename = file.name;
            this.fileSelected = file ? true : false;
        },

        async onSubmit() {
            if (!this.value.file) return;

            const form = new FormData();
            form.append('subFile', this.value.file);

            try {
                const json = await fetch('/projects', {method: 'POST', body: form})
                    .then(r => r.json());

                const projId = json['projId'];
                const proj = await fetch(`/projects/${projId}`, {method: 'GET'})
                    .then(res => res.json());

                this.value.meta = {
                    projId: proj.projId,
                    filename: proj.filename,
                    format: proj.format,
                    timestamp: proj.timestamp,
                }
                this.value.parsed = proj.parsed;

                this.fileSelected = false;

            } catch (ex) {
                console.error(ex);
            }
        }
    },


    template: `
    <div class="row"><div class="col-4">
        <div class="input-group">

            <div class="custom-file">
                <input
                    type="file" id="sub-file"
                    class="custom-file-input"
                    :accept="accepts"
                    @change="onChange"
                    >
                <label class="custom-file-label" for="customFile">
                    {{ this.value.meta.filename || 'Choose file' }}
                </label>
            </div>

            <button
                type="button"
                class="btn btn-primary"
                :disabled="submitDisabled"
                @click="onSubmit">
                Submit
            </button>
        </div>
    </div></div>
    `,
};

export default Upload;
