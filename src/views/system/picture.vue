<template>
	<div class="app-container upLoadPicture">
		<div class="title">登录页背景图片</div>
        <el-button type="primary" size="small" @click="submit1">设置图片</el-button>
        <el-button size="small" type="primary">点击上传</el-button>
        <br /><br />
        <img-upload limit="3" :imgList.sync="imgArr1"></img-upload>
        <br /><br />
        <hr>
        <br /><br />

        <div class="title">看板轮播图片</div>
        <el-button type="primary" size="small" @click="submit2">设置图片</el-button>
        <el-button size="small" type="primary">点击上传</el-button>
        <br /><br />
        <img-upload limit="30" :imgList.sync="imgArr2" :isMultiple="true"></img-upload>
	</div>
</template>

<script>
    import imgUpload from './imgUpload'
	export default {
        components:{imgUpload},
		data() {
			return {
			    imgArr1:[],//
                imgArr2:[],//
			};
		},
		methods: {
            submit1(){
                let checkedVal = [];
                for(let i = 0;i < this.imgArr1.length;i++){
                    if(this.imgArr1[i].check) checkedVal.push(this.imgArr1[i]);
                }
                if(checkedVal.length){
                    console.log(checkedVal)
                }else{
                    this.$message.error('最少要选择一张图片！');
                }
            },
            submit2(){
                let checkedVal2 = [];
                for(let i = 0;i < this.imgArr2.length;i++){
                    if(this.imgArr2[i].check) checkedVal2.push(this.imgArr2[i]);
                }
                if(checkedVal2.length){
                    console.log(checkedVal2)
                }else{
                    this.$message.error('最少要选择一张图片！');
                }
            }
		}
	}
</script>

<style scoped lang="scss">
    .picture{
        .title {
            font-size: 14px;
        }
    }
</style>