/**
 * Editor component
 */

import SubsAss from './tem-subs-ass.js';

const Editor = {
    name: 'editor',
    props: ['value'],
    data() {
        let lines;
        let columns;
        if (this.value.meta.format === 'ass') {
            columns = {
                'Start': 'r',
                'End': 'r',
                'Style': 'r',
                'Text': 'w'
            };
            const evts = this.value.parsed.filter(s => s.section === 'Events')[0];
            lines = evts.body
                .filter(e => e.key === 'Dialogue').map(e => e.value);  // extract Dialogue

            lines.forEach((line, idx) => line.idx = idx);  // array idx per Dialogue obj
        }

        return {
            columns,
            lines,
            updating: false,
        };
    },

    methods: {
        async pushUpdate() {
            try {
                this.updating = true;
                const projId = this.project.meta.projId;
                const params = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.project.parsed),
                }
                this.updating = false;
                await fetch(`/projects/${projId}`, params);

            } catch (ex) {
                console.error(ex);

            }
        },
    },

    components: {
        'sub-line-ass': SubsAss
    },

    template: `
    <div class="editor">
        <h2 class="proj-name">{{ value.meta.filename }}</h2>
        <span class="proj-id">{{ value.meta.projId }}</span>
        <span id="updating" v-if="updating" style="margin-left: 3px;">Updating...</span>

        <sub-line-ass v-model="value" @update-subs="pushUpdate"/>

        </table>
    </div>
    `
};

export default Editor;
