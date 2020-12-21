
import styled from 'styled-components';

export const Container = styled.div`

    header{
        .list{
            display: flex;
            flex-direction: row;   
            align-items: center; 
            .item{
                display: flex;
                flex-direction: column;
                margin-right: 50px;
                .title{
                    color: #3D3D4D;
                    font-size: 20px;
                    font-weight: bold;
                    text-transform: capitalize;
                    
                }
            }
        }
    }
    .detalhes{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: 500px;
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

    ul{
        margin-top: 55px;
    }
    li{
        background-color: white;
        border-radius: 7px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 20px;
        margin-bottom: 10px;
    }

`;