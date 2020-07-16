<template>
  <van-dialog 
		v-model="show" 
		title="完善资料" 
		:showConfirmButton="false"
		:showCancelButton="false"
		:closeOnClickOverlay="true">
		<van-field class="inputSingle" v-model="nickname" placeholder="请输入昵称" clearable/>
		<van-row type="flex" justify="space-between">
			<van-col span="10">
				<van-button round plain size="small" :type="sex==1?'primary':'default'" @click="sex=1">我是男神</van-button>
			</van-col>
			<van-col span="10">
				<van-button round plain size="small" :type="sex==2?'primary':'default'" @click="sex=2">我是女神</van-button>
			</van-col>
		</van-row>
		<p>性别要慎重，已经确定不能修改哦</p>
		<van-button round type="primary" @click="onEdit">完成</van-button>
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
			nickname: '用户12345',
			sex:1
		}
	},
	computed:{
		...mapGetters({
			userinfo: "BASE_userinfo"
		})
	},
	watch:{
		value(val){
			this.show = val;
			if(val){
				this.sex = this.userinfo.gender
				this.nickname = this.userinfo.nickname
			}
		},
		show(val){
			this.$emit('input', val)
		}
	},
	methods:{
		...mapActions({
			getUserinfo: "base/getUserinfo"
		}),
		onEdit(){
			let self = this;
			Util.doAjax({
				url: Util.URLConfig('editUserinfo'),
				type: 'post',
				params: {
					nickname: self.nickname,
					gender: self.sex
				},
				callback: function (msg) {
					self.$toast.success('编辑成功')
					console.log(msg)
					self.getUserinfo({
						user_id: self.userinfo.user_id
					});
					self.show = false;
				},
				errcallback: function (msg) {},
				completecallback: function () {}
			});
		}
	}
}
</script>
<style lang="scss" scoped>
	p{
		color: #B9B9B9;
		font-size: 12px;
		margin: 0 0 20px;
	}
</style>