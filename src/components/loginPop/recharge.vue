<template>
  <van-dialog 
		v-model="show" 
		title="钻石充值" 
		:showConfirmButton="false"
		:showCancelButton="false"
		:closeOnClickOverlay="true">
		<p>请搜索关注来来语音公众号</p>
		<van-button round type="primary" @click="show=false">再看看</van-button>
		<van-button round plain type="primary" @click="show=false">复制来来语音并打开微信</van-button>
	</van-dialog>
</template>
<script>
export default {
	props:{
		value: Boolean
	},
	data(){
		return{
			show: this.value
		}
	},
	watch:{
		value(val){
			this.show = val;
		},
		show(val){
			this.$emit('input', val)
		}
	}
}
</script>
<style lang="scss" scoped>
	p{
		font-size: 18px;
		margin: 0 0 24px;
	}
</style>