/**
 * Editor component
 */

const Editor = {
    name: 'editor',
    props: ['value'],
    data() {
        let lines;
        let columns;
        if (this.value.meta.format === 'ass') {
            columns = ['Start', 'End', 'Style', 'Text'];
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

    template: `
    <div class="editor">
        <h2 class="subs-name">{{ value.meta.id }}</h2>
        <table class="subs-lines">
            <tr>
                <th v-for="col in columns">{{ col }}</th>
            </tr>

            <tr v-for="line in lines">
                <td v-for="col in columns">{{ line[col] }}</td>
            </tr>
        </table>
    </div>
    `
};

export default Editor;
