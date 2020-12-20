
import styled from 'styled-components';

export const Container = styled.div`
    .detalhes{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .title{
            color: #3D3D4D;
            font-size: 20px;
            font-weight: bold;
            text-transform: capitalize;
        }
        .item{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            color: #6C6C80;
            font-size: 15px;
            margin-top: 42px;
        }
    }
    li{
        background-color: white;
        border-radius: 7px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 20px;
        margin-top: 10px;
    }

`;