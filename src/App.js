import React, { useEffect, useRef } from 'react';
import './App.css';
import myVideo from './warrior-is-a-child.mp4';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

// hello this is a new commit
// hello this is my second commit rebase it

// added new remote commit hereeeeee
// this is my local commit and modified this by another and then also updated by the remote

const videoMachine = Machine({
  id: 'videoMachine',
  initial: 'loading',
  context: {
    video: null
  },
  states: {
    loading: {
      on: {
        LOADED: {
          target: 'ready',
          actions: assign({
            video: (_ctx, event) => event.video
          })
        },
        FAIL: 'failure'
      }
    },
    ready: {
      initial: 'paused',
      states: {
        playing: {
          on: {
            PAUSE: {
              target: 'paused',
              actions: 'pauseVideo'
            },
            STOP: {
              target: 'ended',
              actions: 'stopVideo'
            }
          },
        },
        paused: {
          on: {
            PLAY: {
              target: 'playing',
              actions: 'playVideo'
            },
            STOP: {
              target: 'ended',
              actions: 'stopVideo'
            },
          },
        },
        ended: {
          on: {
            PLAY: {
              target: 'playing',
              actions: 'playVideo'
            },
          },
        },
      },
    },
    failure: {
      type: 'final',
    },
  },
});


const playVideo = (context, _event) => {
  context.video.play()
}

const pauseVideo = (context, _event) => {
  context.video.pause()
}

const stopVideo = (context, _event) => {
  context.video.currentTime = 0
  context.video.pause()
}

function App() {
  const [currentState, send] = useMachine(videoMachine, { actions:  { playVideo, pauseVideo, stopVideo }});
  const ref = useRef(null)

  console.log('context ---> ', currentState.context)
  console.log(currentState);


  return (
    <div className="App">
      <header className="App-header">
        {/* {currentState.matches('loading') && <div>Loading....</div>} */}
        {/* {currentState.matches('ready') && ( */}
          <div>
            <video ref={ref} controls
            onCanPlay={() => {
              send('LOADED', { video: ref.current });
            }}
            onError={() => {
              send('FAIL')
            }}
            onEnded={() => {
              send('STOP')
            }}
            >
              <source src={myVideo} type="video/mp4" />
            </video>
            <div>
              <Buttons currentState={currentState} send={send} />
            </div>
          </div>
        {/* )} */}
      </header>
    </div>
  );
}

export default App;

function Buttons({ currentState, send }) {
  return (
    <div>
      {(currentState.matches({ready: 'paused'}) || currentState.matches({ready: 'ended'})) && (
          <button onClick={() => send('PLAY')}>Play</button>
      )}
      {currentState.matches({ready: 'playing'}) && (
          <button onClick={() => send('PAUSE')}>Pause</button>
      )}
      <button onClick={() => send('STOP')}>Stop</button>
    </div>
  );
}
