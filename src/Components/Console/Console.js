import React from 'react';
import classes from './Console.module.scss'

const scrollToBottom = () => {
    //if(this.textLog){
    setTimeout(() => this.textLog.scrollTop = this.textLog.scrollHeight-100)
    //}
};

const Console = (props) => {

    return (
        <textarea ref={textLog => this.textLog = textLog} onChange={scrollToBottom()} readOnly value={props.output.join("\n")} className={classes.Console}> </textarea>
    );
};

export default Console;

