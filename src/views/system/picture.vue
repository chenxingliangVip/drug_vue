<template>
    <div class="app-container upLoadPicture">
        <div class="title">登录页背景图片</div>
        <el-button type="primary" class="makePic" size="small" @click="submit1">设置图片</el-button>
        <br /><br />
        <img-upload limit="3" :imgList="imgArr1" :type="logoType"></img-upload>
        <br />
        <hr>
        <br />
        <div class="title">看板轮播图片</div>
        <el-button type="primary" class="makePic" size="small" @click="submit2">设置图片</el-button>
        <br /><br />
        <img-upload limit="30" :imgList="imgArr2" :type="screenType" :isMultiple="true"></img-upload>
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

                logoType: "0",
                screenType: "1",
            };
        },
        mounted() {
            let self = this;
            self.getList();
            self.$eventBus.$on("updateImagesList", function(type) {
                self.getList();
            });

        },
        methods: {
            getList() {
                let self = this;
                self.$http({
                    url: "/drug/images/queryImagesList",
                    method: "post",
                }).then(resp => {
                    if(resp.success) {
                        self.imgArr1 = [];
                        self.imgArr2 = [];
                        for(let data of resp.result) {
                            let image = {
                                id: data.id,
                                url: data.fileBlob,
                                name: data.fileName,
                                check: data.fileCheck == '1' ? true : false
                            };
                            if(data.fileType == '0') {
                                self.imgArr1.push(image);
                            } else {
                                self.imgArr2.push(image);
                            }
                        }
                        self.imgArr1.push({
                            url: ""
                        });
                        self.imgArr2.push({
                            url: ""
                        });
                    }
                });
            },

            submit1() {
                let checkedVal = [];
                for(let i = 0; i < this.imgArr1.length; i++) {
                    if(this.imgArr1[i].check) checkedVal.push(this.imgArr1[i]);
                }
                if(checkedVal.length) {
                    let params = [];
                    for(let data of checkedVal) {
                        let param = {
                            id: data.id,
                            fileCheck: "1",
                            fileType: this.logoType
                        };
                        params.push(param);
                    }
                    this.updateImagesStatus(params);
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
                    let params = [];
                    for(let data of checkedVal2) {
                        let param = {
                            id: data.id,
                            fileCheck: "1",
                            fileType: this.screenType
                        };
                        params.push(param);
                    }
                    this.updateImagesStatus(params);
                    this.$message.success('看板轮播图片！');
                } else {
                    this.$message.warning('最少要选择一张图片！');
                }
            },
            updateImagesStatus(params) { //删除图片
                let self = this;
                self.$http({
                    url: "/drug/images/updateImagesCheck",
                    method: "post",
                    data: JSON.stringify(params),
                    dataType: 'json',
                    contentType: "application/json",
                }).then(resp => {});

            },
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