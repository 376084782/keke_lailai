<template>
  <van-dialog 
		v-model="show" 
		title="榜单说明" 
		:showConfirmButton="false"
		:showCancelButton="false"
		:closeOnClickOverlay="true">
		<div class="tipBox">
			<p>富豪榜</p>
			是送出钻石礼物产生的财富值，从高到低排序
		</div>
		<div class="tipBox">
			<p>魅力榜</p>
			是收到钻石礼物产生的魅力值，从高到低排序
		</div>
	</van-dialog>
</template>
<script>
import * as Util from 'utils';
import { mapGetters, mapActions } from 'vuex';
export default {
	props:{
		value: Boolean
	},
	data(){
		return{
			show: this.value,
		}
	},
	watch:{
		value(val){
			this.show = val;
		},
		show(val){
			this.$emit('input', val)
		}
	},
	methods:{
	}
}
</script>
<style lang="scss" scoped>
	.tipBox{
		position: relative;
		margin: 24px auto;
		border: 1px solid #EDEDED;
		border-radius: 4px;
		padding: 15px 12px;
		color: #646464;
		font-size: 12px;
		text-align: left;
		&:nth-child(1){
			margin-top: 0;
		}
		p{
			position: absolute;
			top: -10px;
			left: 50%;
			transform: translateX(-50%);
			width: 60px;
			line-height: 20px;
			border-radius: 10px;
			color: #fff;
			text-align: center;
			margin:0;
		}
		&:nth-child(1) p{
			background-color: #F5A623;
		}
		&:nth-child(2) p{
			background-color: #EE386F;
		}
	}
</style>