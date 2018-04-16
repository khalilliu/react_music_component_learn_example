import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ReactMusicPlayer from './react-music-player';

class App extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      songInfo: [
        {
            src:"https://img.webnots.com/2015/07/suture_self.mp3",
            artist:"青蛙乐队",
            name:"小跳蛙",
            img:"http://singerimg.kugou.com/uploadpic/softhead/400/20160913/20160913140233132.jpg",
            id:"66575568441"
        },
        {
            src:"http://mp3.flash127.com/music/38570.mp3",
            artist:"周杰伦",
            name:"甜甜的",
            img:"http://singerimg.kugou.com/uploadpic/softhead/400/20171026/20171026100450393.jpg",
            id:"66575568442"
        },
        {
            src:"http://mp3.flash127.com/music/28751.mp3",
            artist:"潘玮柏",
            name:"不得不爱",
            img:"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=781787101,1026788150&fm=27&gp=0.jpg",
            id:"66575568443"
        },
        {
            src:"http://mp3.flash127.com/music/1412.mp3",
            artist:"张韶涵",
            name:"再见之前",
            img:"http://games.enet.com.cn/jzimages/201009/s1283410316.jpg",
            id:"66575568444"
        },
        {
            src:"http://mp3.flash127.com/music/214.mp3",
            artist:"邓紫棋",
            name:"画",
            img:"http://img.18183.com/uploads/allimg/140510/41-140510145612.jpg",
            id:"66575568445"
        },
        {
            src:"http://mp3.flash127.com/music/3536.mp3",
            artist:"张靓颖",
            name:"无字碑",
            img:"http://singerimg.kugou.com/uploadpic/softhead/400/20170628/20170628110356447.jpg",
            id:"66575568446"
        },
        {
            src:"http://mp3.flash127.com/music/17674.mp3",
            artist:"阿桑",
            name:"叶子",
            img:"http://star.kuwo.cn/star/starheads/180/66/26/1776695622.jpg",
            id:"66575568447"
        }
      ]
    }
    this.delSong = this.delSong.bind(this);
  }

  delSong(i,id){
    this.state.songInfo.splice(i,1);
  
  }

  render() {
    return (
      <div className="App">
        <ReactMusicPlayer 
          info = {this.state.songInfo}
          onDel = {this.delSong}
        />
      </div>
    );
  }
}

export default App;
