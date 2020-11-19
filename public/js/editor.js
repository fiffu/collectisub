/**
 * Editor component
 */

import SubLine from './sub-line.js';

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
                .filter(e => e.key === 'Dialogue')
                .map(e => e.value);
        }

        return {
            columns,
            lines
        };
    },

    components: {
        'sub-line': SubLine
    },

    template: `
    <div class="editor">
        <h2 class="subs-name">{{ value.meta.id }}</h2>
        <table class="table table-striped subs-lines">
            <thead>
                <tr>
                    <th scope="col" v-for="(rw, col) in columns">{{ col }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="line in lines">
                    <td v-for="(rw, col) in columns" :class="{'col-8': rw === 'w'}"">
                        <span v-if="rw === 'r'">{{ line[col] }}</span>
                        <!--
                        <textarea v-else v-model="line.Text">
                            {{ line.Text }}
                        </textarea>
                        -->
                        <input type="text" v-else v-model="line.Text" style="width: 100%" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
};

export default Editor;
