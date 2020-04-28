<template>
    <div class="imgupload">
        <div class="imgItemParent" v-for="(item,index ) in pageImgs" :key="index" v-show="index < limit">
            <div class="imgItem" :class="{active:item.check}">
                <i class="el-icon-plus" v-show="!item.url "></i>
                <img class="content" :src="item.url" v-show="item.url">

                <input type="file" accept="image/*" @change="imgChange($event,index)" multiple>
                <i class="el-icon-delete" v-show="item.url" @click.stop="deleteImg(index)"></i>
            </div>
            <div class="name" :title="item.name" v-if="item.name" @click="checkFun(index)">
                <i class="el-icon-success" v-show="item.check"></i>
                <i class="no-check" v-show="!item.check"></i>
                <span :class="{active:item.check}">{{item.name}}</span>
            </div>
        </div>

        <div style="clear: both;"></div>
    </div>
</template>

<script>
    export default {
        props: ['imgList', 'limit', 'isMultiple', 'type'],
        data() {
            return {
                pageImgs: [{}]
            }
        },
        methods: {
            deleteImg(index) { //删除图片
                let self = this;
                let imgObj = self.pageImgs[index];
                let params = {
                    id: imgObj.id
                };
                self.$http({
                    url: "/drug/images/deleteImages",
                    method: "post",
                    params: params,
                }).then(resp => {
                    if(resp.success) {
                        self.pageImgs.splice(index, 1);
                    }
                });

            },
            checkFun(index) { //选中图片
                if(this.isMultiple) {
                    this.pageImgs[index].check = !this.pageImgs[index].check;
                } else { //默认只能选择一张
                    this.pageImgs.map((item, index1) => {
                        if(index1 == index) item.check = !item.check;
                        else item.check = false;
                        return item;
                    })
                }
            },
            imgChange(e, index) { //选择文件
                if(e.target.files.length) {
                    let file = e.target.files[0];
                    if(file.type !== 'image/png' && file.type !== 'image/jpeg') {
                        return false
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (eve) => {
                        if(!this.pageImgs[index].url) {
                            this.pageImgs.push({
                                url: eve.target.result,
                                name: file.name,
                                check: false
                            })
                            this.uploadImageToBack(file.name, eve.target.result);
                        } else {
                            let id = this.pageImgs[index].id;
                            this.$set(this.pageImgs, index, {
                                url: eve.target.result,
                                name: file.name,
                                check: false
                            });
                            this.updateImages(id, file.name, eve.target.result);
                        }
                    }

                }
            },

            updateImages(id, name, url) {
                let self = this;
                let params = {
                    id: id,
                    fileName: name,
                    fileType: this.type,
                    fileBlob: url
                };
                self.$http({
                    url: "/drug/images/updateImages",
                    method: "post",
                    data: JSON.stringify(params),
                    dataType: 'json',
                    contentType: "application/json",
                }).then(resp => {

                });
            },

            uploadImageToBack(fileName, fileBlob) {
                let self = this;
                let params = {
                    fileName: fileName,
                    fileType: this.type,
                    fileBlob: fileBlob
                };
                self.$http({
                    url: "/drug/images/addImages",
                    method: "post",
                    data: JSON.stringify(params),
                    dataType: 'json',
                    contentType: "application/json",
                }).then(resp => {
                    if(resp.success) {
                        self.$eventBus.$emit("updateImagesList", self.type)
                    }
                });
            }
        },
        watch: {
            imgList(val) {
                this.pageImgs = val;
            }
        }
    }
</script>

<style scoped lang="scss">
    .imgupload {
        .imgItemParent {
            float: left;
            margin-right: 20px;
            .name {
                padding: 5px 0;
                font-size: 12px;
                color: #333333;
                text-align: center;
                width: 120px;
                cursor: pointer;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                i {
                    font-size: 18px;
                    vertical-align: middle;
                    margin-right: 5px;
                    &.el-icon-success {
                        color: #409eff;
                    }
                    &.no-check {
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        border: 1px solid #cccccc;
                        border-radius: 50%;
                    }
                }
                span {
                    vertical-align: middle;
                    &.active {
                        color: #409eff;
                    }
                }
            }
        }
        .imgItem {
            border: 1px dashed #cccccc;
            width: 120px;
            height: 120px;
            box-sizing: border-box;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fbfdff;
            &.active {
                border: 1px solid #409eff;
                background-color: #eff6ff;
            }
            .el-icon-plus {
                font-size: 30px;
                color: #cccccc;
            }
            .el-icon-delete {
                font-size: 12px;
                position: absolute;
                right: 0;
                top: 0;
                padding: 5px;
                cursor: pointer;
                z-index: 2;
                background: #8e8888b8;
                color: #ffffff;
            }
            input {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }
            .content {
                max-width: 100%;
                max-height: 100%;
            }
            .click {
                font-size: 12px;
            }
        }
    }
</style>