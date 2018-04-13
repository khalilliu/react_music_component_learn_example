
import React , {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './react-music-player.css';


let rotateTimer = 0;

class ReactMusicPlayer extends Component{
	constructor(props){
		super(props);
		this.state = {
			isPaused: false,
			totalTime: 0,
			playerPer: 0,
			bufferedPer: 0,
			playedLeft: 0,
			volumnLeft: 0,
			remainTime: 0,
			angle: 0,
			mouseDown: false,
			musicListShow: false,
			isPlayed: false,
			currentMusic: {},
		};


	}

	componentDidMount(){
		let audio = this.refs.audio;
		this.setState({
			currentMusic: this.props.info[0]
		});
		audio.addEventListener('canplay', ()=>{
			let totalTime = parseInt(this.refs.audio.duration);
			this.setState({
				totalTime: this.getTime(totalTime),
				remainTime: this.getTime(totalTime),
				playedLeft: this.refs.played.getBoundingClientRect().left,
				volumnLeft: this.refs.totalVolume.getBoundingClientRect().left
			});
		})
		this.refs.volumnProgress.style.width = '50%';
		audio.volume = 0.5;
	}

	last(){

	}

	play(){
		let audio = this.ref.audio;
		if(audio.paused&&this.state.currentMusic.src){
			//play the music
			audio.play();
			this.setState({
				isPaused: true,
				isPlayed: true //正在播放
			},()=>{
				rotateTimer= setInterval(()=>{
          this.setState({
          	angle:this.state.angle+1
          },()=>{
          	this.refs.musicAvatar.style.transform = `rotate(${this.state.angle}deg)`
          })
				}, 33)
			})
		}else {
			//pause the music
			audio.paused();
			this.setState({
				isPaused: false
			}, ()=>{
				clearInterval(rotateTimer);
			})
		}

		audio.addEventListener('timeupdate', ()=>{
			//播放进度条
			let playerPer = audio.currentTime / audio.duration;
			this.refs.played.style.width = playerPer*100 + '%';
			//buffered 
			let timeRages = audio.buffered;
			let bufferedTime = 0;
			if(timeRages.length !== 0){
				bufferedTime = timeRages.end(timeRages.length-1);
			}
			let bufferedPer = bufferedTime / audio.duration;
			this.refs.buffered.style.width = bufferedPer*100+'%';
			//remaining time
			let remainTime = audio.duration - audio.currentTime;

			this.setState({remainTime: this.getTime(remainTime)});
		})

		//已播放完
		if(audio.ended){
			this.next();
		}
	}

	next(){

	}



	delMusic(i,id){
		let audio = this.refs.audio;
		this.setState({});
		if(this.props.info[i].src === this.state.currentMusic.src){
			if(i<=this.prosp.info.length - 1 && this.props.info[i+1]){
				//有下一首
				this.setState({
					currentMusic: this.props.info[i+1]
				}, () => {
					this.play();
					this.props.onDel(i,id);
				})
			}	else if(!this.props.info[i+1] && this.props.info[i-1]){
				this.setState({
					currentMusic: this.props.info[0]
				},()=>{
					this.play();
					this.props.onDel(i,id);
				})
			} else {
				//最后一首
				clearInterval(rotateTimer);
				audio.currentTime = 0;
				this.refs.buffered.style.width = 0;
				this.refs.played.style.width = 0;
				this.setState({
					currentMusic: {},
					isPlayed: false,
					musicListShow: false,
				}, () => {
					this.props.onDel(i,id);
				})
			}
		} else {
			this.props.onDel(i,id);
		}
	}



	render(){
		return(
			<div id='react-music-player'>
				<div className='react-music-player-wrapper'>
					<div className='react-music-player-inner'>
						<div className='left-control'>
							<span className='icon-last' onClick={this.last}></span>
							<span className={this.state.isPaused&&this.state.currentMusic.src? 'icon-pause' : 'icon-play' onClick={this.play} }></span>
							<span className='icon-next' onClick={this.next}></span>
						</div>
						<div className='music-box'>
							<div className='picture'>
								{
									this.state.currentMusic.src 
										? <img src={this.state.currentMusic.img ref='musicAvatar' alt='CD图片'} />
										: null 
								}
							</div>
							<div className='music-info'>
								<div className='music-name'>
									{
										this.state.currentMusic.src?(`${this.state.currentMusic.artist}:${this.state.currentMusic.name}`):`等待播放`
									}
								</div>
								<div className='progress-wrapper' ref='progress'
										 onClick={this.clickChangeTime.bind(this)}
										 onMouseDown={this.mouseDown.bind(this)}
										 onMouseMove={this.slideChangeTime.bind(this)}
										 onMouseLeave={this.mouseLeave.bind(this)}
								>
									<div className='progress'>
										<div className='progress-buffered' ref='buffered'></div>
										<div className='progress-played' ref='played'></div>
									</div>
								</div>
								<div className='time'>
									<div className='total-time'>{this.state.totalTime?this.state.totalTime:`00:00`}</div>
									<span>/</span>
									<div className='remain-time'>{this.state.remainTime?this.state.remainTime:`00:00`}</div>
								</div>
							</div>
						</div>
						<div className='music-list-btn'>
							<span className='icon-menu' onClick={this.showMusicList.bind(this)}></span>
						</div>
						<div className='right-control'></div>
						<audio src={ this.state.currentMusic.src ? this.state.currentMusic.src : '' } ref='audio'></audio>
					</div>
				</div>

				<ReactCSSTransitionGroup>
					{this.state.musicListShow ? 
						<div className='music-list'>
							<div className='music-list-title'>
								<span>播放列表</span>
							</div>
							<div className='single-music-wrapper'>
								{this.props.info.map( (v,i) => {
									return (
										<div className='single-music' style={ 
											this.state.currentMusic.src === v.src && this.state.isPlayed ? {background: "#33beff",color:"#fff"} : null} key={v.src}>
											<div className='single-music-play'>
												<span className={this.state.currentMusic.src === v.src && this.state.isPlayed ? 'icon-playing' : 'icon-play'} onClick={this.playThis.bind(this, i)}></span>
											</div>
											<div className='single-music-name'>{v.name}</div>
											<div className='single-music-artist'>{v.artist}</div>
											<div className='single-music-del'>
												<span className='icon-del' onClick={()=>{this.delMusic.bind(this,i,v.id)}}
											</div>
										</div>
									)
								})
							}
							</div>
						</div>
						:
						null 	
					}
				</ReactCSSTransitionGroup>
				<ReactCSSTransitionGroup>
					{
						this.state.musicListShow 
							? <div className='modal' onClick={this.showMusicList}></div>
							: null
					}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}

export default ReactMusicPlayer;