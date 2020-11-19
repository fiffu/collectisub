const SubLine = {
    name: 'sub-line',
    props: ['value'],
    data() {
        return {
            readColumns: ['Start', 'End', 'Style']
        }
    },
    template: `
    <td v-for="col in readColumns">
        {{ value[col] }}
    </td>
    <td>
        <input type="text" :value="value['Text']">
    </td>
    `
};

export default SubLine;
