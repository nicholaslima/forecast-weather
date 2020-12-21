

import { createGlobalStyle } from 'styled-components';


export default createGlobalStyle`
    
    body{
        margin: 0 auto;
        background-color: #f0f0f5;
        font-family: Nunito, sans-serif;
        width: 1200px;
    }

    .header-table{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-top: 15px;
        background-image: linear-gradient(to right, #159AF9,#5FD5F3);
        border-radius: 7px 7px 0px 0px;
        padding: 15px;
        div{
            font-size: 20px;
            font-weight: 600;
            text-transform: capitalize;
            color: white; 
        }
    }

    
    *{
        margin: 0px;
        padding: 0px;
        outline: 0px;
        box-sizing: border-box;
    } 

    a{ 
        text-decoration: none;

    }

    button{ 
        cursor: pointer;
    }


    input{
        font-family: Roboto, sans-serif;
        padding: 20px;
        border-radius: 7px;
        border-width: 0px;
        width: 500px;
    }

    h1{
        font-size: 40px;
        font-family: Roboto;
        font-weight: 700;
        margin: 0 auto;
        margin-top: 30px;
        margin-bottom: 30px;
    }
`;