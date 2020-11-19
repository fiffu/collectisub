const SUBTITLE_FILE = {};

Vue.component('sub-line', {
    props: ['item'],
    template: `
    <span>
        <span class="product">{{item.product}}</span>
        <span class="quantity"><input type="number" v-model.number="item.quantity"></span>
        <span class="cost">{{item.cost * item.quantity}}</span>
    </span>
    `
});


Vue.component('upload-modal', {
    props: ['file', 'canSubmit'],
    data() {
        return {
            cannotSubmit: true,
        }
    },
    template: `
    <div>
        <input type="file" id="sub-file" @change="onChange" />
        <input type="submit" value="Submit" :disabled="cannotSubmit" @click="onSubmit" />
    </div>
    `,
    methods: {
        onChange(evt) {
            const file = evt.target.files[0];
            this.file = file;
            this.cannotSubmit = file ? false : true;
        },
        async onSubmit() {
            console.log('bar');
            if (!this.file) return;

            const form = new FormData();
            form.append('subFile', this.file);

            try {
                const res = await fetch('/submit', {method: 'POST', body: form});
                const data = await res.json();
                const subid = data['subid'];

                const subObj = await fetch(`/sub/${subid}`, {method: 'GET'})
                    .then(res => res.json());
                console.log(subObj);
                
            } catch (ex) {
                console.log(ex.message || ex);
            }
        }
    },
});


const App = {
    name: 'app',
    data() {
        return {
            sublines: [],
        }
    },

    template: `
    <div id="container">
        <upload-modal />
        <!--
        <ol id="list">
            <li v-for="item in cart">
                <list-item :item="item" />
            </li>
        </ol>
        -->
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
