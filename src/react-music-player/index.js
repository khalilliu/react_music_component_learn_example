
import React , {Component} from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
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

		this.last = this.last.bind(this);
    this.play = this.play.bind(this);
    this.next = this.next.bind(this);
    this.startChangeTime = this.startChangeTime.bind(this)
    this.moveProgress = this.moveProgress.bind(this)
    this.moveVolume = this.moveVolume.bind(this)
    this.startMoveVolume = this.startMoveVolume.bind(this)
    this.clickChangeTime = this.clickChangeTime.bind(this)
    this.slideChangeTime = this.slideChangeTime.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.clickChangeVolume = this.clickChangeVolume.bind(this)
    this.mouseDownvolume = this.mouseDownvolume.bind(this)
    this.slideChangeVolume = this.slideChangeVolume.bind(this)
    this.mouseUpVolume = this.mouseUpVolume.bind(this)
    this.showMusicList = this.showMusicList.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.delMusic = this.delMusic.bind(this)
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
		this.refs.volumeProgress.style.width = '50%';
		audio.volume = 0.5;
	}

	last(){
		this.setState({angle:0});
		if(!this.state.currentMusic.src){
			return;
		}
		let current = '';
		this.props.info.map((music,index) => {
			if(music.src === this.state.currentMusic.src){
				current = index;
			}
			return current
		})

		if(current>0){
			this.setState({
				currentMusic: this.props.info[current-1]
			})
		}else{
			this.setState({
				currentMusic: this.props.info[this.props.info.length-1]
			}, () => {
				this.play();
			})
		}
	}

	play(){
		let audio = this.refs.audio;
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
			audio.pause();
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
		this.setState({angle: 0});
		if(!this.state.currentMusic.src){
			return;
		}
		let current = '';
		this.props.info.map((music,index) => {
			if(music.src === this.state.currentMusic.src){
				current = index;
			}
			return current;
		})

		if(current<this.props.info.length - 1){
			this.setState({
				currentMusic: this.props.info[current+1]
			},()=>{
				this.play();
			})
		}else{
			this.setState({
				currentMusic: this.props.info[0]
			},()=>{this.play()})
		}
		console.log(this.state);
	}

	setTimeOnPc(e){
		let audio = this.refs.audio;
		if(audio.currentTime !== 0){
			let audio = this.refs.audio;
			let newWidth = (e.pageX - this.state.playedLeft) / this.refs.progress.offsetWidth;
			this.refs.played.style.width = newWidth*100 + '%';
			audio.currentTime = newWidth*audio.duration;
		}
	}

	clickChangeTime(e){
		if(!e.pageX){
			return;
		}
		this.setTimeOnPc(e)
	}

	//PC端拖动进度条
	mouseDown(){
		this.setState({
			mouseDown: true
		})
	}

	slideChangeTime(e){
		if(this.state.mouseDown){
			this.setTimeOnPc(e)
		}
	}

	mouseUp(){
		this.setState({
			mouseDown: false
		})
	}

	startChangeTime(e){
		if(this.refs.audio.currentTime !== 0){
			this.setTime(e)
		}
	}

	moveProgress(e){
		let audio = this.refs.audio;
		if(audio.currentTime !== 0){
			this.setTime(e);
		}
	}

	getTime(musicTime){
		if(musicTime){
			if(musicTime<60){
				musicTime = `00:${musicTime<10 ? `0${musicTime}` : musicTime}`
			}else{
				musicTime= `${parseInt(musicTime/60)<10?`0${parseInt(musicTime/60)}`:parseInt(musicTime/60)}:${musicTime%60<10?`0${Math.round(musicTime%60)}`:Math.round(musicTime%60)}`
			}
			return musicTime;
		}else{
			return `00:00`
		}
	}

	setTime(e){
		let audio = this.refs.audio;
		let newWidth = (e.touches[0].pageX - this.state.playedLeft)/this.refs.progress.offsetWidth;
		this.refs.played.style.width = newWidth*100+'%';
		audio.currentTime = newWidth*audio.duration;
	}

	//移动端改变音量
	setVolume(pageX){
		let audio = this.refs.audio;
		let volumeRate = (pageX - this.state.volumnLeft)/this.refs.totalVolume.offsetWidth;
		if(volumeRate>0.01&&volumeRate<=1){
			audio.volume = volumeRate;
			this.refs.volumeProgress.style.width = volumeRate*100+'%';
		}else if(volumeRate<0.01){
			audio.volume = 0;
		}else{
			audio.volume = 1;
		}
	}

	startMoveVolume(e){
		if(this.refs.audio.currentTime !== 0){
			this.setVolume(e.touches[0].pageX);
		}
	}

	moveVolume(e){
		if(this.refs.audio.currentTime !== 0){
			this.setVolume(e.touches[0].pageX);
		}
	}

	//pc端改变音量
	clickChangeVolume(e){
		if(this.refs.audio.currentTime !== 0){
			this.setVolume(e.pageX);
		}
	}

	mouseDownvolume(e){
		this.setState({
			mouseDown: true
		})
	}

	slideChangeVolume(e){
		if(this.state.mouseDown && this.refs.audio.currentTime!==0){
			this.setVolume(e.pageX);
		}
	}

	mouseUpVolume(){
		this.setState({
			mouseDown:false
		})
	}

	mouseLeave(){
		this.setState({
			mouseDown:false
		})
	}

	showMusicList(){
		this.setState({
			musicListShow: !this.state.musicListShow
		})
	}

	playThis(i){
		this.setState({
			currentMusic: this.props.info[i]
		}, ()=>{
			this.play();
		})
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
							<span className={this.state.isPaused&&this.state.currentMusic.src? 'icon-pause' : 'icon-play'} onClick={this.play} ></span>
							<span className='icon-next' onClick={this.next}></span>
						</div>
						<div className='music-box'>
							<div className='picture'>
								{
									this.state.currentMusic.src 
										? <img src={this.state.currentMusic.img} ref='musicAvatar' alt='CD图片' />
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
										 onTouchMove={this.moveProgress.bind(this)}
										 onTouchStart={this.startChangeTime.bind(this)}
										 onClick={this.clickChangeTime.bind(this)}
										 onMouseDown={this.mouseDown.bind(this)}
										 onMouseMove={this.slideChangeTime.bind(this)}
										 onMouseUp={this.mouseUp.bind(this)}
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
						<div className='right-control'>
							<div className='volume-control-wrapper'
								onTouchMove={this.moveVolume.bind(this)}
								onTouchStart={this.startMoveVolume.bind(this)}
								onClick={this.clickChangeVolume.bind(this)}
								onMouseDown={this.mouseDown.bind(this)}
								onMouseMove={this.slideChangeVolume.bind(this)}
								onMouseUp={this.mouseUpVolume.bind(this)}
								onMouseLeave={this.mouseLeave.bind(this)}
							>
								<div className='volume-control' ref='totalVolume'>
									<div className='volume-progress' ref='volumeProgress'></div>
								</div>
							</div>
						</div>
						<audio src={ this.state.currentMusic.src ? this.state.currentMusic.src : '' } ref='audio'></audio>
					</div>
				</div>

				<CSSTransitionGroup
					transitionName='music-list-show'
					transtionEnterTimeout={500}
					transitionEnterTimeout={300}
				>
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
												<span className='icon-del' onClick={()=>(this.delMusic(i,v.id))}></span>
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
				</CSSTransitionGroup>
				<CSSTransitionGroup
					transitionName='music-list-model'
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}
				>
					{
						this.state.musicListShow 
							? <div className='modal' onClick={this.showMusicList}></div>
							: null
					}
				</CSSTransitionGroup>
			</div>
		)
	}
}

export default ReactMusicPlayer;