<template>
  <van-dialog
    v-model="show"
    title="公告"
    :showConfirmButton="false"
    :showCancelButton="false"
    :closeOnClickOverlay="true"
  >
    <div class="content">{{content}}</div>
  </van-dialog>
</template>
<script>
import * as Util from 'utils';
import { mapGetters, mapActions } from 'vuex';
export default {
	props:{
		value: Boolean,
		content:String,
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
.content {
  margin: 0 auto 20px;
  text-align: left;
  color: #969696;
  font-size: 15px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
  min-height: 125px;
}
</style>
