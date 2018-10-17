<template>
	<div>
		<ele-header :seller="seller"></ele-header>
		
		<div class="tab">
			<div class="tab-item">
				<router-link to="/goods">商品</router-link>
			</div>
			
			<div class="tab-item">
				<router-link to="/ratings">评价</router-link>
			</div>
			
			<div class="tab-item">
				<router-link to="/seller">店家</router-link>
			</div>
		</div>
		
		<keep-alive>
			<router-view :seller = "seller"></router-view>
		</keep-alive>
	</div>
</template>

<script>
	import header from './components/header/header'
	const OK = 0
	
	export default{
		components:{
			'ele-header' : header
		},
		
		data(){
			return {
				seller : {}
			}
		},
		
		created(){
			setTimeout(()=>{
				this.$axios.get('/seller').then((response)=>{
					const result = response.data
					if(result.code === OK){
						this.seller = result.data
						this.seller.score = 2.6
					}
				}).catch((err)=>{
					console.log(err)
				})
			},1000)
		}
	}
	
</script>

<style lang="stylus">
@import "./common/stylus/mixins";
  .tab
    height 40px
    line-height 40px
    display flex
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      font-size 14px
      color rgb(77,85,93)
      text-align center
      a
      	display block
      .active
        color red
</style>


