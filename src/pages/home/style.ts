import styled from 'styled-components';


export const Container = styled.div`
    height: 100Vh;
    margin: 0 auto;
    

    .title{
        font-size: 20px;
        font-weight: 600;
        text-transform: capitalize;
        color: white;
        
    }

    header{
        margin-top: 50px;
        margin-bottom: 70px;
    }

    button{
        color: #fff;
        background-color: #04d361;
        padding: 16px 20px;
        font-size: 20px;
        text-transform: capitalize;
        font-weight: 600;
        border-radius: 0px 7px 7px 0px;
        border-width: 0px;
    }

    
    li{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        background-color: white;
        border-radius: 7px;
        margin-top: 7px;
        padding: 20px;
    }

`;