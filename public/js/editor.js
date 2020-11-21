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

    methods: {
        calculateColour(str) {
            const c = str.slice(0, 100) // slice here to prevent OOM from .repeat(6)
                .split('').map(c => c.charCodeAt())  // array of charcode
                .reduce((a, b) => a + b * 64).toString(16)  // sub and express as hex
                .repeat(6).slice(0, 6);  // duplicate to make string of length 6

            const colour = [ c.slice(0, 2), c.slice(2, 4), c.slice(4, 6)]  // [r, g, b]
                .map(c => Number.parseInt(c, 16))  // back to int
                .map(c => Math.trunc(c * 0.25 + 192))  // scale to 75~100% of rgb
                .map(c => c.toString(16)).join('');  // back to hexcode
            // console.log(`${str} -> #${colour}`);
            return `#${colour}`;
        }
    },

    components: {
        'sub-line': SubLine
    },

    template: `
    <div class="editor">
        <h2 class="proj-name">{{ value.meta.filename }}</h2>
        <span class="proj-id">{{ value.meta.projId }}</span>
        <table class="table subs-lines">
            <thead style="background-color: #333388; color: #ffffff">
                <tr>
                    <th scope="col" v-for="(rw, col) in columns">{{ col }}</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="line in lines" :style="{ 'background-color': calculateColour(line.Style) }">
                    <td v-for="(rw, col) in columns" :class="{ 'col-8': rw === 'w' }">
                        <span v-if="rw === 'r'">{{ line[col] }}</span>
                        <input type="text" v-else v-model="line.Text" style="width: 100%" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `
};

export default Editor;
