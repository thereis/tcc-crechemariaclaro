import { observable, action, computed, toJS } from "mobx";

class User {
  @observable
  id = localStorage.getItem("id")
    ? localStorage.getItem("id")
    : this.generateUserId();

  @observable messages = [];
  @observable response = [];
  @observable botWriting = false;

  @action
  toggleWriting() {
    return (this.botWriting = !this.botWriting);
  }

  @action
  generateUserId() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return `${S4()}-${S4()}-${S4()}`;
  }

  @action
  setResponse(response) {
    return (this.response = response);
  }

  @action
  addMessage(messageId, content) {
    return this.messages.push({
      id: content.sender === "user" ? 0 : 1,
      message: content.message,
      senderName: content.sender,
      time: content.time,
      messageId
    });
  }

  @action
  modifyMessage(messageId, content) {
    let index = this.messages.findIndex(obj => obj.messageId === messageId);
    return (this.messages[index] = {
      id: content.sender === "user" ? 0 : 1,
      message: content.message,
      senderName: content.sender,
      messageId
    });
  }

  @computed
  get orderedMessages() {
    return toJS(this.messages).sort(function(x, y) {
      return x.time.seconds - y.time.seconds;
    });
  }
}

export let UserStore = new User();
