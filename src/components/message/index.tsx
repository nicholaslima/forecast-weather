

import React,{ useState,forwardRef,useImperativeHandle } from 'react';
import {  Container } from './style';


interface messageType{
    children: string;
}

export interface refMessage{
    ativar(): void;
    closeMessage(): void;
}


const Message: React.ForwardRefRenderFunction<refMessage,messageType> = ({ children },ref) => {
    const [ visible ,setVisible ] = useState(false);

   function closeMessage(){
        setTimeout(() => {
            setVisible(false);
        },3000);
    }

    function ativar(): void{
        setVisible(true);
    }

    useImperativeHandle(ref,() => {
        return {  
            ativar,
            closeMessage
        }
    });


    return(
        <Container visible={ visible }>

            <div>
                { children }
            </div>

        </Container>
    )
}

export default forwardRef(Message);