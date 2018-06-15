import { firebase, firestore } from "../db";
import { UserStore } from "../store";

class Chat {
  host = "https://console.dialogflow.com/api-client/demo/embedded/";
  agent = "5ac2b9ba-5c2d-4e19-8c46-e447fd7e4baa";

  async sendMessage(message) {
    try {
      if (message.length === 0) return;

      UserStore.toggleWriting();
      await this.addUserMessage(message);

      let request = await fetch(
        `https://us-central1-globalz-store.cloudfunctions.net/dialogflowProxy?message=${message}&sessionId=${
          UserStore.id
        }`,
        {
          method: "POST"
        }
      );

      let response = await request.json();

      this.addBotMessage(response);
    } catch (e) {
      console.log("error", e);
    }
  }

  async addUserMessage(message) {
    try {
      firestore.collection("messages").add({
        time: new Date(),
        message,
        ref: UserStore.id,
        sender: "user"
      });
    } catch (e) {
      console.log(e);
    }
  }

  async addBotMessage(response) {
    try {
      let message = response.result.fulfillment.speech;

      // Toggle chatbot writing
      UserStore.toggleWriting();

      await firestore.collection("messages").add({
        time: new Date(),
        message,
        ref: UserStore.id,
        sender: "Clarinha"
      });
    } catch (e) {
      console.log(e);
    }
  }

  async fetchMessages() {
    try {
      // Register the user
      localStorage.setItem("id", UserStore.id);

      await firestore
        .collection("messages")
        .where("ref", "==", UserStore.id)
        .orderBy("time", "desc")
        .limit(10)
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              UserStore.addMessage(change.doc.id, change.doc.data());
            }
          });
        });
    } catch (e) {
      console.log(e);
    }
  }
}

export const ChatService = new Chat();
