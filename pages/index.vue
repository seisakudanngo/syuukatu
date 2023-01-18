<template>
  <div>
    <!--<NuxtWelcome />-->
    <!-- <div class="slider">
      <div class="slider-wrap">
        <div class="slide">
          <img src="../assets/programing2_poster.png" class="slide-image" alt="HTML">
        </div>
        <div class="slide">
          <img src="../assets/ポスター2.png" class="slide-image" alt="HTML">
        </div>
        <div class="slide">
          <img src="../assets/オタク検定.png" class="slide-image" alt="HTML">
        </div>
        <div class="slide">
          <img src="../assets/gameポスター8.png" class="slide-image">
        </div>
        <div class="slide">
          <img src="../assets/programing2_poster.png" class="slide-image" alt="HTML">
        </div>
        <div class="slide">
          <img src="../assets/ポスター2.png" class="slide-image" alt="HTML">
        </div>
        <div class="slide">
          <img src="../assets/オタク検定.png" class="slide-image" alt="HTML">
        </div>
        <div class="slide">
          <img src="../assets/gameポスター8.png" class="slide-image">
        </div>
      </div>
    </div> -->
    <!-- <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="../assets/アセット 11@3x.png" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="../assets/アセット 12@3x.png" class="d-block w-100" alt="...">
        </div>
        <div class="carousel-item">
          <img src="../assets/アセット 11@3x.png" class="d-block w-100" alt="...">
        </div>
      </div>
    </div> -->
    <div id="carouselPosterControls" class="carousel slide mx-auto" data-bs-ride="carousel">
      <div class="carousel-inner w-100">
        <!-- images1 -->
        <div class="carousel-item active">
          <div class="d-flex align-items-center">
            <div class="flex-item">
              <a href="/displayTeams?grade=soft1">
                <div class="image-wrap"><img src="~/assets/programing2_poster.png"></div>
              </a>
            </div>
            <div class="flex-item">
              <a href="/displayTeams?grade=soft1">
                <div class="image-wrap"><img src="~/assets/ポスター2.png"></div>
              </a>
            </div>
            <div class="flex-item">
              <a href="/displayTeams?grade=soft1">
                <div class="image-wrap"><img src="~/assets/サンプルポスター.png"></div>
              </a>
            </div>
          </div>
        </div>

        <!-- images2 -->
        <div class="carousel-item">
          <div class="d-flex">
            <div class="flex-item">
              <a href="/displayTeams?grade=soft2">
                <div class="image-wrap"><img src="~/assets/サンプルポスター5.png"></div>
              </a>
            </div>
            <div class="flex-item">
              <a href="/displayTeams?grade=soft2">
                <div class="image-wrap"><img src="~/assets/gameポスター8.png"></div>
              </a>
            </div>
            <div class="flex-item">
              <a href="/displayTeams?grade=soft2">
                <div class="image-wrap"><img src="~/assets/サンプルポスター3.png"></div>
              </a>
            </div>
          </div>
        </div>

        <!-- images3 -->
        <div class="carousel-item">
          <div class="d-flex">
            <div class="flex-item">
              <a href="/displayTeams?grade=soft3">
                <div class="image-wrap"><img src="~/assets/LITTLE BOMB.png"></div>
              </a>
            </div>
            <div class="flex-item">
              <a href="/displayTeams?grade=soft3">
                <div class="image-wrap"><img src="~/assets/サンプルポスター4.png"></div>
              </a>
            </div>
            <div class="flex-item">
              <a href="/displayTeams?grade=soft3">
                <div class="image-wrap"><img src="~/assets/オタク検定.png"></div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- button -->
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselPosterControls" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true" />
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselPosterControls" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true" />
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <!-- <h1>神戸電子IT分野の<br>歴史がここに!!</h1>
    <h2 class="headline">神戸電子専門学校IT分野の過去作品を見ることができます。<br>作品制作や学習に役立てましょう。</h2> -->
    <div class="home mx-auto align-items-center">
      <img src="~/assets/home画面.png" class="align-items-center">
    </div>
    <br><br>
    <div class="kd  mx-auto">
      <p>KDHubってなに？</p>
    </div>
    <div class="edge">
      <div class="cp_accordionslide08">
        <div class="slideitem">
          <h2 class="title">過去作品一覧</h2>
          <div class="slidecont">
            <p>過去の作品を学年、年度ごとに見ることができます。</p>
          </div>
        </div>
        <div class="slideitem">
          <h2 class="title">開発工程の公開</h2>
          <div class="slidecont">
            <p>各チームで行ってきた開発工程を閲覧できます。</p>
          </div>
        </div>
        <div class="slideitem">
          <h2 class="title">コードの閲覧</h2>
          <div class="slidecont">
            <p>実際に使用したプログラムコードを閲覧できます。</p>
          </div>
        </div>
        <div class="slideitem">
          <h2 class="title">自分達の作品をアピール</h2>
          <div class="slidecont">
            <p>苦労した点やアピールポイントなどを自由に記載することができます。</p>
          </div>
        </div>
        <div class="slideitem">
          <h2 class="title">就職活動のポートフォリオに</h2>
          <div class="slidecont">
            <p>自分たちの作品ページをそのままポートフォリオに利用することができます。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* .carousel{
  padding-top: 155px;
} */
/* @media screen and (min-width:576px){
  .carousel-inner{
    display: flex;
  }
  .carousel-item{
    display: block;
    margin-right: 0;
    flex: 0 0 calc(100%/3);
  }
} */
.carousel {
  width: 85vw !important;
  // padding: 15rem;
  .flex-item {
  flex-basis: 100%;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
    .image-wrap {
      img {
        width: 100%;
        // height: 300px;
      }
    }
  }
}
.home {
  width: 90vw !important;
  img{
    width: 100%;
  }
}
.carousel-inner{
  padding: 1em;
}
h1{
  margin-top: 30px;
  margin-bottom: 50px;
  text-align: center;
  font-size: 70px;
  color: rgb(67, 66, 66);
}
.headline{
  margin-bottom: 50px;
  text-align: center;
  font-size: 25px;
  color: rgb(130, 130, 130);
}
.kd{
  text-align: center;
  font-size: 55px;
  /* background-color: rgba(246, 242, 242, 0.932); */
  color: rgb(50, 50, 50);
  padding-bottom: 10px;
  p{
    padding: 2rem;
    font-weight: bold;
  }
}
@media screen and (max-width: 500px){
  .kd{
    p{
      font-size: 2.5rem;
      font-weight: bold;
    }
  }
}
.title{
  color: #3a3a3a;
}
/* @keyframes scroll{
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-450px * 4));
  }
}  */
/* .slider {
  width: 1800px;
  background: white;
  height: 800px;
  margin: auto;
  overflow:hidden;
  position: relative;
}
.slider-wrap {
  margin-top: 170px;
  animation: scroll 37s linear infinite;
	display: flex;
	width: calc(450px * 8);
	height:100%;
  }
.slide-image{
  display: flex;
  width:450px;
  height:600px;
  object-fit:cover;
} */
/* .slide{
  width:450px;
  height:100%;
  text-align:center;
} */
.edge{
  margin-top: 30px;
  margin-bottom: 60px;
  margin-left: 40px;
  margin-right: 40px;
}
.cp_accordionslide08 {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	background-color: #031625;
}
.cp_accordionslide08:hover .slideitem {
	width: 20%;
}
.cp_accordionslide08 .slideitem {
	position: relative;
	overflow: hidden;
	width: 20%;
	height: 60vh;
	-webkit-transition: width 0.5s ease;
	transition: width 0.5s ease;
	-webkit-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0);
	color: #ffffff;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}
.cp_accordionslide08 .slideitem:nth-child(1) {
	background-image: url('../assets/チーム一覧画面.png');
}
.cp_accordionslide08 .slideitem:nth-child(2) {
	background-image: url('../assets/github.png');
}
.cp_accordionslide08 .slideitem:nth-child(3) {
	background-image: url('../assets/gitcode.png');
}
.cp_accordionslide08 .slideitem:nth-child(4) {
	background-image: url('../assets/アピールポイント.png');
}
.cp_accordionslide08 .slideitem:nth-child(5) {
	background-image: url('../assets/ポートフォリオ.png');
}
.slidecont{
  color: #232323;
}
.cp_accordionslide08 .slideitem:before,
.cp_accordionslide08 .slideitem:after {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	content: '';
	-webkit-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0);
}
.cp_accordionslide08 .slideitem:after {
	-webkit-transition: opacity 0.5s ease;
	transition: opacity 0.5s ease;
	opacity: 1;
	background: rgba(159, 215, 250, 0.85);
}
.cp_accordionslide08 .slideitem:before {
	z-index: 1;
	-webkit-transition: opacity 0.5s ease, -webkit-transform 0.5s ease;
	transition: opacity 0.5s ease, -webkit-transform 0.5s ease;
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition: opacity 0.5s ease, transform 0.5s ease, -webkit-transform 0.5s ease;
	-webkit-transform: translate3d(0, 0, 0) translateY(50%);
	transform: translate3d(0, 0, 0) translateY(50%);
	opacity: 0;
	background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), color-stop(75%, rgba(159, 215, 250, 0.85)));
	background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(162, 197, 250, 0.85) 80%);
	background:         linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(162, 197, 250, 0.85) 80%);
}
.cp_accordionslide08 .slideitem:hover {
	width: 60% !important;
}
.cp_accordionslide08 .slideitem:hover:after {
	opacity: 0;
}
.cp_accordionslide08 .slideitem:hover:before {
	-webkit-transition: opacity 1s ease, -webkit-transform 1s ease 0.25s;
  transition: opacity 1s ease, -webkit-transform 1s ease 0.25s;
  transition: opacity 1s ease, transform 1s ease 0.25s;
  transition: opacity 1s ease, transform 1s ease 0.25s, -webkit-transform 1s ease 0.25s;
	-webkit-transform: translate3d(0, 0, 0) translateY(0);
	transform: translate3d(0, 0, 0) translateY(0);
	opacity: 1;
}
.cp_accordionslide08 .slideitem:hover .slidecont {
	-webkit-transition: all 0.75s ease 0.5s;
  transition: all 0.75s ease 0.5s;
	-webkit-transform: translateY(0);
	transform: translateY(0);
	opacity: 1;
}
.cp_accordionslide08 .slideitem h2 {
	font-size: 1.4em;
	position: absolute;
	z-index: 1;
	top: 50%;
	left: 50%;
	-webkit-transition: all 0.75s ease;
	transition: all 0.75s ease;
	-webkit-transform: translateX(-50%) translateY(-50%);
	transform: translateX(-50%) translateY(-50%);
	white-space: nowrap;
}
.cp_accordionslide08 .slideitem h2::before {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	content: '';
}
.cp_accordionslide08 .slideitem:hover h2 {
	top: 50%;
}
.cp_accordionslide08 .slidecont {
	position: relative;
	z-index: 1;
	top: 55%;
	margin: 0 1.618em;
	-webkit-transform: translate3d(0, 0, 0) translateY(25px);
	transform: translate3d(0, 0, 0) translateY(25px);
	text-align: center;
	opacity: 0;
}
@media only screen and (max-width:768px) {
	.cp_accordionslide08 {
		display: block;
	}
	.cp_accordionslide08:hover .slideitem {
		width: 100%;
		height: 20vh;
	}
	.cp_accordionslide08 .slideitem {
		width: 100%;
		height: 20vh;
	}
	.cp_accordionslide08 .slideitem:hover {
		width: 100% !important;
		height: 100vh !important;
	}
	.cp_accordionslide08 .slideitem h2 {
		top: 35%;
	}
}
</style>
