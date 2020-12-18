import React from 'react';
import './App.css';
import { ReactMic }  from '@matuschek/react-mic';


const ws = new WebSocket('ws://localhost:2700');
let data = 'hi';
ws.addEventListener("open", () => {
    console.log('connected to websocket');
})
ws.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    data = event.data
});
ws.addEventListener("close", function (data){
    console.log("Closing socket");
    console.log(data);
})

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            record: false,
            data: data
        }
    }

    sendWS = (blob) => {
        if(blob !== null){
            let _blob = new Blob([blob], {type: 'audio/wav' });
            ws.send(_blob);
        }
    }

    startRecording = () => {
        this.setState({ record: true });
    }

    stopRecording = () => {
        this.setState({ record: false });
    }

    onData = (recordedBlob) => {

        let blob = new Blob([recordedBlob], {type: 'audio/wav' });
        // ws.send(blob);'
        console.log('chunk of real-time data is: ', blob);
        this.sendWS(blob)
    }

    onStop = (recordedBlob) => {
        console.log('recordedBlob is: ', recordedBlob);
        this.sendWS(recordedBlob);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div>
                        <ReactMic
                            record={this.state.record}
                            className="sound-wave"
                            onStop={this.onStop}
                            onData={this.onData}
                            strokeColor="#000000"
                            backgroundColor="#FF4081" />
                        <button onClick={this.startRecording} type="button">Start</button>
                        <button onClick={this.stopRecording} type="button">Stop</button>

                        <p>{this.state.data}</p>
                        <p>{this.state.data['text']}</p>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
