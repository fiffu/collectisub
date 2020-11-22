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
        console.log(lines);

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
        'sub-line-ass': SubsAss
    },

    template: `
    <div class="editor">
        <h2 class="proj-name">{{ value.meta.filename }}</h2>
        <span class="proj-id">{{ value.meta.projId }}</span>

        <sub-line-ass v-model="value" />

        </table>
    </div>
    `
};

export default Editor;
