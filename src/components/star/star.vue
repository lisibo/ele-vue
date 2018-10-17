<template>
  <div class="star" :class="`star-${size}`">
    <!-- c代表循环数组每一项的class类名 on|half|off -->
    <span class="star-item" :class="c" v-for="c in starClasses"></span>
  </div>
</template>
<script>
const CLASS_ON = "on";
const CLASS_HALF = "half";
const CLASS_OFF = "off";

export default {
	
  props: {
    score: Number,
    size: Number
  },
  
  computed: {
    starClasses() {
      const scs = [];
      // 向scs添加CLASS_ON
      const score = Math.floor(this.score);
      for (var i = 0; i < score; i++) {
        scs.push(CLASS_ON);
      }
      // 向scs添加CLASS_HALF
      if (this.score - score >= 0.5) {
        scs.push(CLASS_HALF);
      }
      // 向scs添加CLASS_OFF
//    while (scs.length < 5) {//五星评价
//      scs.push(CLASS_OFF);
//    }
      while(5-scs.length){
        scs.push(CLASS_OFF)
      }	
      return scs
    }
  }
};
</script>
<style lang="stylus">
@import '../../common/stylus/mixins.styl'
.star-24
  .star-item
    display inline-block
    width 10px
    height 10px
    background-repeat no-repeat
    background-size 10px 10px
  .on
    bg-star(star24_on)
  .half
    bg-star(star24_half)
  .off
    bg-star(star24_off)
.star-36
  .star-item
    display inline-block
    width 15px
    height 15px
    background-repeat no-repeat
    background-size 15px 15px
  .on
    bg-star(star36_on)
  .half
    bg-star(star36_half)
  .off
    bg-star(star36_off)
.star-48
  .star-item
    display inline-block
    width 20px
    height 20px
    background-repeat no-repeat
    background-size 20px 20px
  .on
    bg-star(star48_on)
  .half
    bg-star(star48_half)
  .off
    bg-star(star48_off)
</style>
