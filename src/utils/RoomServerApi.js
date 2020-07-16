import * as Util from "utils";
export default {
  tellServerJoinRoomSuccess(roomid) {
    Util.doAjax({
      url: Util.URLConfig("/room/join/confirm"),
      params: {
        room_id: roomid,
      },
      callback: function (msg) {
        console.log("通知服务器加入声网",msg);
      },
      errcallback: function (msg) {
        console.log('cuocuocuco', msg)
      },
      completecallback: function () {}
    });
  },
  tellServerMicroStatusChanged(status, roomid) {
    return new Promise((rsv, rej) => {
      // status 1上麦 -1下麦
      let url = status == 1 ? '/room/intomicro/confirm' : '/room/outmicro/confirm'
      Util.doAjax({
        url: Util.URLConfig(url),
        params: {
          room_id: roomid,
        },
        callback: function (msg) {
          console.log("通知服务器加入声网");
          rsv()
        },
        errcallback: function (msg) {
          console.log('cuocuocuco', msg)
          rej()
        },
        completecallback: function () {}
      });
    })
  },
  /**
   * 
   * @param {*} room_id 房间id
   * @param {*} microphone_id 要跳过去的麦序
   */
  askServerJumpMicro(room_id, microphone_id) {
    Util.doAjax({
      url: Util.URLConfig('/room/microphone/jump'),
      params: {
        room_id,
        microphone_id
      },
      callback: function (msg) {
        console.log("跳麦成功");
        rsv()
      },
      errcallback: function (msg) {
        console.log('cuocuocuco', msg)
        rej()
      },
      completecallback: function () {}
    });
  },
  /**
   * 
   * @param {*} status 1上麦 -1下麦
   * @param {*} hostType 1主持麦 2普通
   * @param {*} roomType 0排麦房 1普通房
   * @param {*} roomid 房间id
   * @param {*} microId 麦位
   */
  askServerMicroStatusChange(status, hostType, roomType, roomid, microId, guideType = 0) {
    return new Promise((rsv, rej) => {
      // status 1上麦 -1下麦
      let url;
      let data = {};
      if (hostType == 1) {
        // status 1上麦 -1下麦
        url = status == 1 ? '/room/hostmicrophone/into' : '/room/hostmicrophone/out'
        data = {
          hostmicrophone_id: microId,
          room_id: roomid
        }
      } else if (hostType == 2) {
        if (roomType == 0) {
          // 排麦房，请求排麦的接口
          url = status == 1 ? '/room/microphone/apply' : '/room/microphone/out'
        } else {
          // 普通房直接上麦
          url = status == 1 ? '/room/microphone/into' : '/room/microphone/out'
        }
        // status 1上麦 -1下麦
        data = {
          microphone_id: microId,
          room_id: roomid,
          guard_type: guideType
        }
      }
      Util.doAjax({
        url: Util.URLConfig(url),
        params: data,
        callback: function (msg) {
          console.log(1)
          rsv()
        },
        errcallback: function (msg) {
          rej()
        },
        completecallback: function () {}
      });
    })

  }

}
