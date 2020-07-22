import store from '../store'
import Vue from 'vue'
import Agora from './Agora';
import {
  Dialog
} from 'vant';
import RoomServerApi from './RoomServerApi';
export default {
  im: null,
  init(appKey, token) {
    var config = {
      appkey: appKey,
    };
    this.im = RongIMLib.init(config);
    console.log('初始化')
    this.listen();
  },
  joinRoom(chatRoomId) {
    return new Promise((rsv, rej) => {
      chatRoomId = '' + chatRoomId
      var chatRoom = this.im.ChatRoom.get({
        id: chatRoomId
      });
      console.log(chatRoom)
      chatRoom.join({
        count: 0 // 进入后, 自动拉取 20 条聊天室最新消息
      }).then(function () {
        console.log('加入聊天室成功');
        rsv()
      }).catch(e => {
        console.log(e, '融云加入失败')
      })
    })
  },
  handleMessage(result) {
    console.log('融云消息：', result)
    switch (result.k) {
      case 20006: {
        result.codeIM = 20006
        // 送礼物的消息
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'giftMsg',
          data: result
        })
        break;
      }
      case 20004: {
        result.codeIM = 20004
        // 送礼物的消息
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'giftMsg',
          data: result
        })
        break;
      }
      case 30002: {
        // 更新主持麦UI，显示主持麦上的人。
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'hostUpdate1',
          data: result
        })
        break;
      }
      case 30004: {
        // 主持人下麦
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'hostOff'
        })
        break;
      }
      case 30005: {
        // 主持麦显示闭麦小图标
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'hostUpdate',
          data: {
            volume: false
          }
        })
        break;
      }
      case 30006: {
        // 主持麦去掉闭麦小图标
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'hostUpdate',
          data: {
            volume: true
          }
        })
        break;
      }
      case 30007: {
        // 判断如果是自己，则agora转换成主持角色。
        if (result.uid == store.getters.BASE_userinfo.user_id) {
          // 执行agora身份切换
          Agora.changeRole(true).then(e => {
            // 通知服务器声网身份切换完成
            RoomServerApi.tellServerMicroStatusChanged(
              1,
              store.getters.ROOM_roomInfo.room_id
            );
          });
        }
        break;
      }
      case 30008: {
        // 更新普通麦信息，显示普通麦上人，如果是自己，显示底部功能麦操作标。
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateMicroList',
          data: result
        })
        break
      }
      case 30095: {
        // 更改排麦方式
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'changeMicroFree',
          data: result
        })

      }
      case 30009: {
        // 判断如果是自己，则agora转换成观众角色。
        if (result.uid == store.getters.BASE_userinfo.user_id) {
          // 执行agora身份切换
          Agora.changeRole(false).then(e => {
            // 通知服务器声网身份切换完成
            RoomServerApi.tellServerMicroStatusChanged(
              -1,
              store.getters.ROOM_roomInfo.room_id
            )
          });
        }
        break

      }
      case 30010: {
        // 判断如果是自己，则agora转换成观众角色。
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'clearSeat',
          data: result
        })
        break
      }
      case 30011: {
        // 更新普通麦对应麦的UI，禁用该麦。
        result.lock = true;
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateSeatConfig',
          data: result
        })
        break

      }
      case 30012: {
        // 更新普通麦对应麦的UI，取消禁用该麦
        result.lock = false;
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateSeatConfig',
          data: result
        })
        break

      }
      case 30013: {
        // 更新普通麦对应麦的UI，设置该麦为老板位
        result.boss = true;
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateSeatConfig',
          data: result
        })
        break

      }
      case 30014: {
        // 更新普通麦对应麦的UI，取消该麦老板位
        result.boss = false;
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateSeatConfig',
          data: result
        })
        break

      }
      case 30015: {
        // 如果mid为-1，为全体闭麦，如果闭麦指令里有自己，则转换成观众角色。
        result.volume_self = false
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateMicroStatus',
          data: result
        })
        break
      }
      case 30016: {
        // 如果mid为-1，为全体闭麦，如果闭麦指令里有自己，则转换成观众角色。
        result.volume_self = false
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateMicroStatus',
          data: result
        })
        break
      }
      case 30017: {
        // 如果mid为-1，为全体开麦，如果开麦指令里有自己，则转换成主播角色。这里有个逻辑，如果是主持人闭麦，则不允许用户自己开麦。
        result.volume_self = true
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateMicroStatus',
          data: result
        })
        break
      }
      case 30018: {
        // 如果mid为-1，为全体开麦，如果开麦指令里有自己，则转换成主播角色。这里有个逻辑，如果是主持人闭麦，则不允许用户自己开麦。
        result.volume_self = true
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateMicroStatus',
          data: result
        })
        break
      }
      case 30040: {
        // 从排麦列表里增加该人
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'addToWaitingList',
          data: result
        })
        break
      }
      case 30041: {
        // 从排麦列表里删除该人。
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateLineUp',
          data: result
        })
        break;
      }
      case 30043: {
        // 从排麦列表里删除所有人
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'clearWaitingList',
          data: result
        })
        break;
      }
      case 30045: {
        // 被管理员提出房间，如果是自己，进行离开房间相应的操作。
        if (result.uid == store.getters.BASE_userinfo.user_id) {
          Vue.prototype.$bus.$emit('room/IM', {
            type: 'closeRoom',
            data: result
          })
        }
        break;
      }
      case 30048: {
        // 更新在线人数，增加一条进入房间消息10003，显示XX进入了房间
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateRoomInfo',
          data: {
            online_count: result.ruc
          }
        })
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'chatMessage',
          data: {
            type: 1,
            nickname: result.nn,
            message: '进入了排队',
            user_id: result.uid
          }
        })
        break;
      }
      case 30049: {
        // 更新在线人数
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateRoomInfo',
          data: {
            online_count: result.ruc
          }
        })
        break;
      }
      case 30051: {
        // 公告编辑
        break;
      }
      case 30052: {
        // 公告编辑
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateRoomInfo',
          data: {
            desc: result.n
          }
        })
        break;
      }
      case 30061: {
        // 如果是自己，弹窗提示主持人邀请你上麦是否上麦，点击上麦，调用上麦接口。
        Dialog.confirm({
            title: '标题',
            message: '弹窗内容',
          })
          .then(() => {
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
        break;
      }
      case 30062: {
        // 设置头饰通知
        break;
      }
      case 30063: {
        // 取消头饰通知
        break;
      }
      case 30066: {
        // 进入关闭房间流程
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'closeRoom',
          data: result
        })
        break;
      }
      case 30068: {
        // 更新热度值
        Vue.prototype.$bus.$emit('room/IM', {
          type: 'updateRoomInfo',
          data: {
            hot: result.hot
          }
        })
        break;
      }
      case 30076: {
        // 如果有自己，更换成观众角色
        if (result.uid == store.getters.BASE_userinfo.user_id) {
          // 执行agora身份切换
          Agora.changeRole(false).then(e => {
            // 通知服务器声网身份切换完成
            RoomServerApi.tellServerMicroStatusChanged(
              -1,
              store.getters.ROOM_roomInfo.room_id
            ).then(e => {
              console.log('clearSeat')
              Vue.prototype.$bus.$emit('room/IM', {
                type: 'clearSeat',
                data: result
              })
            })
          });
        }
        break;
      }
    }
  },
  quitRoom(roomId) {
    return new Promise(rsv => {
      var chatRoom = this.im.ChatRoom.get({
        id: '' + roomId
      });
      chatRoom.quit().then(function () {
        console.log('退出聊天室成功');
        rsv()
      });

    })
  },
  sendMsg(roomId, msg, extraData) {
    return new Promise(rsv => {
      var chatRoom = this.im.ChatRoom.get({
        id: '' + roomId
      });
      let sendData = {
        messageType: 'RC:TxtMsg', // 填写开发者定义的 messageType
        content: {
          content: msg,
          extra: JSON.stringify(extraData)
        },
        pushContent: msg, // Push 显示内容
        pushData: msg, // Push 通知时附加信息, 可不填
      }
      chatRoom.send(sendData).then(function (message) {
        rsv(message)
      });
    })
  },
  listen() {
    let self = this;
    this.im.watch({
      // 接收到的消息
      async message(message) {
        let result = message.message.content;
        if (message.message.messageType == 'RC:TxtMsg') {
          console.log(message)
          // 聊天协议
          if (result.extra) {
            let extra = JSON.parse(result.extra)
            Vue.prototype.$bus.$emit('room/IM', {
              type: 'chatMessage',
              data: {
                type: 2,
                image: extra.fimg,
                message: result.content,
                nickname: extra.fnn,
                user_id: message.message.senderUserId
              }
            })
          }
        } else if (message.message.messageType == 'kk:audio_room') {
          self.handleMessage(result)
        }
        return
      },
      conversation() {

      }
    });
  },
  connect(token) {
    console.log('开始连接用户')
    return new Promise((rsv, rej) => {
      this.im.connect({
        token
      }).then((userId) => {
        console.log("连接成功, 用户 id 为", userId);
        // 设置router融云连接成功
        store.dispatch('base/setRongInited', true)
        rsv()
        // 连接已成功, 此时可通过 getConversationList 获取会话列表并展示
        // RongIMClient.getInstance().joinChatRoom(chatRoomId, 0, {
        //   onSuccess: function () {
        //     console.log("加入聊天室成功");
        //   },
        //   onError: function (error) {
        //     console.log("加入聊天室失败", error);
        //   }
        // });
      })
    })
  }
};