

import styled,{css} from 'styled-components';


interface messageType{
    visible: boolean;
}

export const Container = styled.div<messageType>`
    display: none;
    
    ${ (props) => props.visible && css`
        display: block;
    `}

    div{ 
        background-color: #e63946;
        padding: 20px;
        border-radius: 5px;
        color: white;
        font-family: Nunito;
        font-size: 16px;
    }

`;