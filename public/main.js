var news = Vue.component('news', {
	props: ['dataFrom'],
	template: '#new',
	methods: {
		hello: function () {
		},

	},
	computed: {
		// Вычисляемое свойство, которое будет преобразовывать данные из JSON в объект js.
		decodedData() {
			return JSON.parse(this.dataFrom)
		}
	},
	mounted() {
		console.log(JSON.parse(this.dataFrom))
	},

})


var view = new Vue({
	el: '#app',
	props: ['dataFrom'],
	computed: {
		// Вычисляемое свойство, которое будет преобразовывать данные из JSON в объект js.
		decodedData() {
			console.log(this.dataFrom)
			return JSON.parse(this.dataFrom);
		}
	},
	components: {
		'news': news
	},
	mounted() {
		console.log(this.dataFrom)
	},


	template: ''
})

// delimiters: ["[[","]]"]
// const attrValue = view.$refs.div.getAttribute('data-html');
