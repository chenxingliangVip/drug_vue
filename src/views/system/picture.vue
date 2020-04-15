<template>
	<div class="app-container upLoadPicture">
		<div class="title">登录页背景图片</div>
		<el-button type="primary" class="makePic" size="small" @click="submit1">设置图片</el-button>
		<br /><br />
		<img-upload limit="3" :imgList.sync="imgArr1"></img-upload>
		<br />
		<hr>
		<br />
		<div class="title">看板轮播图片</div>
		<el-button type="primary" class="makePic"  size="small" @click="submit2">设置图片</el-button>
		<br /><br />
		<img-upload limit="30" :imgList.sync="imgArr2" :isMultiple="true"></img-upload>
	</div>
</template>

<script>
	import imgUpload from './imgUpload'
	export default {
		components: {
			imgUpload
		},
		data() {
			return {
				imgArr1: [], //
				imgArr2: [], //
			};
		},
		methods: {
			submit1() {
				let checkedVal = [];
				for(let i = 0; i < this.imgArr1.length; i++) {
					if(this.imgArr1[i].check) checkedVal.push(this.imgArr1[i]);
				}
				if(checkedVal.length) {
					console.log(checkedVal)
					this.$message.success('设置为登录页背景图片！');
				} else {
					this.$message.warning('最少要选择一张图片！');
				}
			},
			submit2() {
				let checkedVal2 = [];
				for(let i = 0; i < this.imgArr2.length; i++) {
					if(this.imgArr2[i].check) checkedVal2.push(this.imgArr2[i]);
				}
				if(checkedVal2.length) {
					console.log(checkedVal2)
					this.$message.success('看板轮播图片！');
				} else {
					this.$message.warning('最少要选择一张图片！');
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.upLoadPicture {
		.title {
			font-size: 14px;
			margin: 10px 0;
		}
		.makePic {
			background: #2e827f;
			border: 1px solid #2e827f;
			&:hover {
				opacity: .8;
			}
		}
	}
</style>