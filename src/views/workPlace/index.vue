<template>
	<div class="workPlace" @click="inputJJ">
		<div class="Maincontain">
			<div class="zhanwei"></div>
			<div class="topImg_logo">
		        <img src="@/assets/logo.png" class="app-login-logo" />
		        <img src="@/assets/logoTitle.png" class="app-login-logoTitle" />
			</div>
			<div class="worktable">
				<table border="1" >
					<tr>
						<th>检验编码</th>
						<th>样品名称</th>
						<th>样品批号</th>
						<th>等级</th>
						<th>送样地点</th>
					</tr>
					<tr>
						<td>{{sampleDetail.sampleCode}}</td>
						<td>{{sampleDetail.materialName}}</td>
						<td>{{sampleDetail.sampleNum}}</td>
			            <td>{{sampleDetail.materialGrade}}</td>
			            <td>{{sampleDetail.locationName}}</td>
					</tr>
				</table>
			</div>
			<div class="workForm">
				<p class="title_txt">自助扫码送样区<i></i></p>
				<el-input type="text"  class="workInput" autofocus v-model="sampleCode"  placeholder="请扫待送样品的检验单号" id="workJJ"/>
			</div>
		</div>
	</div>
</template>

<script>
  export default {
    name:"workPlace",
    data(){
      return{
        sampleCode:"",
        sampleDetail:{}
      }
    },
    created(){
      this.validatorIp();
    },
    mounted() {
      let self = this;
      self.inputJJ();
    },
    methods:{

     validatorIp(){
       let self = this;
       self.$http({
         url: "/drug/sample/validatorIp",
         method: "post",
       }).then(resp => {
         if(!resp.success){
           self.$router.push({path: '/login'})
         }
       });
     },

      inputJJ(){
        let input=document.getElementById('workJJ');
        input.focus();
      },

      showTip(type){
         if(type == '3'){
           this.$notify({
             title: '提示',
             message: "送样成功!",
             type: 'success'
           });
         }
        if(type == '1'){
          this.$notify({
            title: '提示',
            message: "此码无效!",
            type: 'error'
          });
        }
        if(type == '2'){
          this.$notify({
            title: '提示',
            message: "已送在检，别扫了！",
            type: 'warning'
          });
        }
      },

      updateWorkSample(sampleCode){
        let self = this;
        self.$http({
          url: "/drug/sample/updateWorkSample",
          method: "post",
          params:{sampleCode:sampleCode}
        }).then(resp => {
          self.sampleCode = "";
          let sample = resp.result;
          let type = sample.checkStatus?(sample.checkStatus !=1?'2':'3'):'1';
          if(type =='3'){
            self.sampleDetail = sample;
          }
          self.showTip(type);
        });
      },
    },
    watch:{
      sampleCode(val){
        let self =this;
        if(!val){
          return;
        }
        if(val.length == 10){
          self.updateWorkSample(val);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
	.workPlace {
		width: 100%;
		height: 100%;
		background-color: #3d9691;
    	display: flex;
        justify-content: center;
        /*align-items: center;*/
        .Maincontain {
        	width: 100%;
        	overflow: auto;
        	/*margin-top: -5%;*/
        	.zhanwei {
        		height: 8%;
        	}
	        .topImg_logo {
        		width: 45%;
				height: 85px;
				margin: 0 auto;
	        	.app-login-logo {
			    	width: 40%;
				    height: 85px;
				    float: left;
			    }
			    .app-login-logoTitle {
			        float: left;
			    	width: 60%;
			        height: 85px;
			    }
	        }
	        .workForm {
        		width: 32%;
	        	margin: auto;
	        	/*margin-top: 25%;*/
	        	p {
	        		margin: 0;
	        	}
		        .title_txt {
					color: #fff;
					text-align: justify;
					overflow: hidden;
					height: 42px;
					margin-top: 10px;
					font-size: 42px;
					font-family: serif;
					margin-bottom: 30px;
					padding-right: 0;
					i {
						display: inline-block;
    					width: 100%;
					}
				}

	        }
	        .worktable {
	        	width: 100%;
	        	padding: 6% 0;

		    	display: flex;
		        justify-content: center;
	        	table {
					empty-cells:show;
					border-collapse: collapse;
					margin:0 auto;
					font-size: 20px;
					width: 90%;
					border:1px solid #ccc;
					table-layout:fixed;
					color: #fff;
					th {
						height:30px;
						line-height: 30px;
						padding:0 1em 0;
						text-align: center;
						font-weight: 400;
						overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
					}
					td {
						height:45px;
						line-height: 45px;
						padding:0 1em 0;
						text-align: center;
						font-weight: 400;
						overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
					}
	        	}
	        }
	    }
	}
</style>
