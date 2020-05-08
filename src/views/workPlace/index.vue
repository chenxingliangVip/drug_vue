<template>
	<div class="workPlace">
		<div class="Maincontain">
			<div class="topImg_logo">
		        <img src="@/assets/logo.png" class="app-login-logo" />
		        <img src="@/assets/logoTitle.png" class="app-login-logoTitle" />
			</div>
			<div class="workForm">
				<p class="title_txt">扫码送样工作台</p>
				<el-input type="text" class="workInput" />
			</div>
		</div>
	</div>
</template>

<script>
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
        	width: 40%;
        	margin-top: 10%;
	        .topImg_logo {
				height: 85px;
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
	        	width: 60%;
	        	margin: auto;
	        	margin-top: 25%;
		        .title_txt {
					color: #fff;
					text-align: center;
					margin-top: 10px;
					font-size: 18px;
					font-family: serif;
				}
	        	
	        }
	    } 
	}
</style>