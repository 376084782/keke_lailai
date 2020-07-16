import store from '../store'
import * as Util from "utils";
import Vue from 'vue'
import RoomServerApi from './RoomServerApi';
export default {
  client: null,
  uid: null,
  localStream: null,
  flagSound: true,
  flagMicro: true,
  instant() {
    if (!this.client) {
      this.init()
    }
    return this.client;
  },
  quitRoom() {
    return new Promise((rsv, rej) => {
      this.instant().leave(function (uid) {
        // 加入房间成功回调
        console.log("client leaves channel");
        rsv()
      }, function (err) {
        console.log("client leave failed ", err);
        rej()
      })
      rsv()
    })
  },
  remoteStreamList: [],
  init(appID = store.getters.tokenAgora) {
    let self = this;
    return new Promise((rsv, rej) => {
      this.client = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8"
      });
      // Initialize the client
      this.client.init(appID, function () {
        console.log("init success");
        rsv()
      }, (err) => {
        console.error(err, '声网加入失败');
      });
      this.client.enableAudioVolumeIndicator(); // 每两秒触发 "volume-indicator" 回调
      this.client.on("volume-indicator", function (evt) {
        // console.log('blablabla', evt.attr)
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateMicroVolume',
          data: evt.attr
        })
      });

      this.client.on("stream-added", function (evt) {
        var remoteStream = evt.stream;
        self.remoteStreamList.push(remoteStream);
        var id = remoteStream.getId();
        if (id !== self.uid) {
          self.client.subscribe(remoteStream, function (err) {
            console.log("stream subscribe failed", err);
          })
        }
        console.log('stream-added remote-uid: ', id);
      });

      this.client.on("network-quality", function (evt) {
        // console.log('network-quality ', evt);
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateNewQuality',
          data: {
            downlinkNetworkQuality: evt.downlinkNetworkQuality
          }
        })
      })

      this.client.on('unmute-audio', e => {
        console.log('unmute-audio', e)
      })
      this.client.on("stream-subscribed", function (evt) {
        var remoteStream = evt.stream;
        console.log('stream-subscribed remote-uid: ', remoteStream.play);
        var id = remoteStream.getId();
        console.log('stream-subscribed remote-uid: ', id)
        // Add a view for the remote stream.
        self.addView(id);
        // Play the remote stream.
        remoteStream.play("remote_video_" + id, e => {
          console.log(e, 2222)
        });
      })
      this.client.on("stream-removed", function (evt) {
        var remoteStream = evt.stream;
        var id = remoteStream.getId();
        // Stop playing the remote stream.
        remoteStream.stop("remote_video_" + id);
        // Remove the view of the remote stream. 
        self.removeView(id);
        console.log('stream-removed remote-uid: ', id);
      })
    })
  },
  removeView(id) {
    if ($("#remote_video_panel_" + id)[0]) {
      $("#remote_video_panel_" + id).remove();
    }
  },
  addView(id, show) {
    if (!$("#" + id)[0]) {
      $("<div/>", {
        id: "remote_video_panel_" + id,
        class: "video-view",
      }).appendTo("#video");

      $("<div/>", {
        id: "remote_video_" + id,
        class: "video-placeholder",
      }).appendTo("#remote_video_panel_" + id);

      $("<div/>", {
        id: "remote_video_info_" + id,
        class: "video-profile " + (show ? "" : "hide"),
      }).appendTo("#remote_video_panel_" + id);

      $("<div/>", {
        id: "video_autoplay_" + id,
        class: "autoplay-fallback hide",
      }).appendTo("#remote_video_panel_" + id);
    }
  },
  toggleSound(flag) {
    let self = this;
    if (flag == undefined) {
      this.flagSound = !this.flagSound;
    } else {
      this.flagSound = flag
    }
    if (this.flagSound) {
      // 重新订阅
      console.log('重新订阅')
      this.remoteStreamList.forEach(remoteStream => {
        var id = remoteStream.getId();
        // Stop playing the remote stream.
        // Remove the view of the remote stream. 
        self.addView(id);
        // Play the remote stream.
        remoteStream.play("remote_video_" + id, e => {
          console.log(e, 2222)
        });
      })
    } else {
      // 把所有远端的声音设为静音
      this.remoteStreamList.forEach(remoteStream => {
        var id = remoteStream.getId();
        // Stop playing the remote stream.
        remoteStream.stop("remote_video_" + id);
        // Remove the view of the remote stream. 
        self.removeView(id);
      })
    }
    Vue.prototype.$bus.$emit('room/IM', {
      type: 'updateMute',
      data: {
        flagSound: this.flagSound
      }
    })
  },
  toggleMicro(flag) {
    if (flag == undefined) {
      this.flagMicro = !this.flagMicro;
    } else {
      this.flagMicro = flag
    }
    this.changeRole(this.flagMicro)
    Vue.prototype.$bus.$emit('room/IM', {
      type: 'updateMicroMute',
      data: {
        flagMicro: this.flagMicro
      }
    })
  },
  changeRole(isHost = true) {
    console.log(isHost, 'isHost')
    return new Promise((rsv, rej) => {
      this.instant().setClientRole(isHost ? "host" : 'audience', (e) => {
        if (!e) {
          console.log("setHost success");
          if (isHost) {
            // Create a local stream
            this.localStream = AgoraRTC.createStream({
              streamID: this.uid,
              audio: this.flagMicro,
              video: false,
              screen: false,
            })
            this.toggleSound(this.flagSound)

            this.localStream.setAudioProfile('high_quality')
            this.localStream.init(() => {
              console.log("init local stream success");
              // play stream with html element id "local_stream"
              // this.localStream.play("local_stream");
              this.client && this.localStream && this.client.publish(this.localStream, function (err) {
                console.log("publish failed");
                console.error(err);
              })
            }, function (err) {
              console.error("init local stream failed ", err);
            });
          }
          rsv()
        } else {
          console.log("setHost error", e);
          rej()
        }
      });
    })
  },
  joinRoom(roomid, token) {
    let self = this;
    roomid = '' + roomid;
    if (!this.instant()) {
      this.init().then(e => {
        this.joinRoom(roomid, token, roomid)
      })
      return;
    }
    this.instant().join(token, roomid, store.getters.BASE_userinfo.user_id, (uid) => {
      self.uid = uid;
      // 加入房间成功回调
      RoomServerApi.tellServerJoinRoomSuccess(roomid)
    }, function (err) {
      console.log("client join failed,参数如下", token, roomid, store.getters.BASE_userinfo.user_id)
    })
  },
}
