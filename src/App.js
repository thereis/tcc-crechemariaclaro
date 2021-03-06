import React from "react";
import { Element, animateScroll as scroll } from "react-scroll";

/**
 * Application dependencies
 */
import { UserStore } from "./store";
import { ChatService } from "./services/Chat";

/**
 * Visual dependencies
 */
import { ChatFeed } from "react-chat-ui";
import { Container, Row, Col, Button, InputGroup, Input } from "reactstrap";

import { observer } from "mobx-react";

@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: localStorage.getItem("id") ? "" : "Olá",
      messages: UserStore.messages,
      ready: true
    };
  }

  el = null;

  componentDidMount() {
    // Fetch messages from firebase
    ChatService.fetchMessages();
  }

  _handleMessage(e) {
    this.setState({
      message: e.target.value,
      ready: false
    });
  }

  _handleKeyPress(e) {
    if (e.keyCode === 13) this._handleButton();
  }

  _handleButton() {
    let { message } = this.state;

    ChatService.sendMessage(message);

    this.setState({
      message: ""
    });

    scroll.scrollToBottom();
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <Element>
                <ChatFeed
                  messages={[...UserStore.orderedMessages]}
                  isTyping={UserStore.botWriting}
                  showSenderName
                  bubblesCentered={false}
                  bubbleStyles={{
                    text: {
                      fontSize: 18
                    },
                    chatbubble: {
                      borderRadius: 10,
                      padding: 10
                    }
                  }}
                />
              </Element>
            </Col>
          </Row>
          <div
            ref={el => {
              this.el = el;
            }}
          >
            <InputGroup>
              <Input
                value={this.state.message}
                placeholder="Insira aqui a sua mensagem..."
                onChange={this._handleMessage.bind(this)}
                onKeyDown={this._handleKeyPress.bind(this)}
              />
              <Button
                color="primary"
                onClick={this._handleButton.bind(this)}
                disabled={this.state.message.length === 0 ? true : false}
              >
                Enviar
              </Button>
            </InputGroup>
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
