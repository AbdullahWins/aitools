import React, { useState, useEffect } from 'react';
import { MdComputer } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { format } from 'timeago.js'
import Image from './Image'

/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const ChatMessage = (props) => {
  const { id, createdAt, text, ai = false, selected, picUrl } = props.message
  console.log(picUrl)
  
  const [word, setWord] = useState('');
  const words = text.split(" ");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let intervalId = null;
    if (wordIndex < words.length) {
      intervalId = setInterval(() => {
        setWord(word + " " + words[wordIndex]);
        setWordIndex(wordIndex + 1);
      }, 100);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [word, wordIndex, words]);

  return (
    <div key={id} className={`${ai && 'flex-row-reverse'} message`}>
      {
        selected === 'Images' && ai ?
          <Image url={text} />
          :
          <div className='message__wrapper'>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <ReactMarkdown className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
                children={word}
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || 'language-js')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, '')}
                        style={atomDark} language={match[1]} PreTag="div" {...props}
                      />
                    ) : (<code className={className} {...props}>{children} </code>)
                  }
                }} />
            </div>

            <div className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>{format(createdAt)}</div>
          </div>}

      <div className="message__pic">
        {
          ai ? <MdComputer /> :
            <img className='cover w-10 h-10 rounded-full' loading='lazy' src={picUrl} alt='profile pic' />
        }
      </div>
    </div>
  )
}

export default ChatMessage

