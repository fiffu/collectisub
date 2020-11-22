const SubsAss = {
    name: 'subs-ass',
    props: ['value'],
    data() {
        const evts = this.value.parsed.filter(s => s.section === 'Events')[0];
        const lines = evts.body
            .filter(e => e.key === 'Dialogue').map(e => e.value);  // extract Dialogue
        lines.forEach((line, idx) => line.idx = idx);  // array idx per Dialogue obj

        return {
            lines: lines,
            columns: {
                'Start': 'read',
                'End': 'read',
                'Style': 'read',
                'Text': 'write'
            },
        }
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
            return `#${colour}`;
        }
    },

    template: `
    <table class="table">
        <thead style="background-color: #333388; color: #ffffff">
            <tr>
                <th scope="col" v-for="(_, col) in columns">{{ col }}</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="line in lines" :style="{ 'background-color': calculateColour(line.Style) }">
                <td v-for="(rw, col) in columns" :class="{ 'col-8': rw === 'write', 'align-middle': true }">
                    <span v-if="rw === 'read'">{{ line[col] }}</span>
                    <input type="text"
                        v-else v-model="line.Text"
                        style="width: 100%"
                        class="editable-sub" />
                </td>
            </tr>
        </tbody>
    </table>
    `
};

export default SubsAss;
